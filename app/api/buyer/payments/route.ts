import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import BuyerPaymentModel from '@/models/BuyerPayment';
import UserModel, { Address } from '@/models/User';
import { Product } from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      orderTotal,
      amountToPay,
      cryptoMethodUsed,
      cryptoAmount,
      cryptoAddress,
      checkoutData
    } = body;

    // Validate required fields
    if (!orderTotal || !amountToPay || !cryptoMethodUsed || !cryptoAmount || !cryptoAddress || !checkoutData) {
      console.log('Missing fields:', { orderTotal, amountToPay, cryptoMethodUsed, cryptoAmount, cryptoAddress, checkoutData });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Checkout data received:', JSON.stringify(checkoutData, null, 2));

    // Get buyer information
    const buyer = await UserModel.findUserByEmail(session.user.email, 'buyer');
    if (!buyer) {
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      );
    }

    // Get selected address
    const selectedAddress = buyer.addresses?.find((addr: Address) => addr._id?.toString() === checkoutData.selectedAddress);
    if (!selectedAddress) {
      return NextResponse.json(
        { error: 'Selected address not found' },
        { status: 404 }
      );
    }

    // Process products and seller information
    const productsInfo = [];
    const sellerInfoMap = new Map();

    for (const item of checkoutData.cartItems) {
      // Get product details - productId is actually the MongoDB _id
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId} not found` },
          { status: 404 }
        );
      }

      // Get seller information
      if (!sellerInfoMap.has(item.sellerName)) {
        const seller = await UserModel.findUserByEmail(product.sellerEmail, 'seller');
        if (seller) {
          sellerInfoMap.set(item.sellerName, {
            sellerName: seller.name,
            email: seller.email,
            country: seller.country,
            phoneNumber: seller.phone
          });
        }
      }

      productsInfo.push({
        productCode: product.productCode || item.productId, // Use productCode if available, otherwise fallback to _id
        name: item.productName,
        price: item.price,
        images: product.images,
        description: product.description,
        stock: item.stock,
        shippingFee: item.shippingFee,
        processingTime: product.processingTime,
        sellerInfo: {
          sellerName: item.sellerName,
          sellerEmail: product.sellerEmail
        }
      });
    }

    // Get the first seller's info (assuming single seller per order for now)
    const sellerInfo = sellerInfoMap.values().next().value;

    if (!sellerInfo) {
      return NextResponse.json(
        { error: 'Seller information not found' },
        { status: 404 }
      );
    }

    // Create buyer payment record
    console.log('Creating payment with data:', JSON.stringify({
      buyerInfo: {
        orderTotal,
        amountToPay,
        username: buyer.name,
        email: buyer.email,
        phoneNumber: buyer.phone,
        addresses: buyer.addresses || [],
        country: buyer.country,
        cryptoMethodUsed,
        timePaid: new Date()
      },
      sellerInfo,
      productsInfo,
      status: 'pending',
      cryptoAmount,
      cryptoAddress
    }, null, 2));

    try {
      const buyerPayment = await BuyerPaymentModel.create({
        buyerInfo: {
          orderTotal,
          amountToPay,
          username: buyer.name,
          email: buyer.email,
          phoneNumber: buyer.phone,
          addresses: buyer.addresses || [],
          country: buyer.country,
          cryptoMethodUsed,
          timePaid: new Date()
        },
        sellerInfo,
        productsInfo,
        status: 'pending',
        cryptoAmount,
        cryptoAddress
      });

      console.log('Payment created successfully:', buyerPayment);

      return NextResponse.json(
        { 
          message: 'Payment recorded successfully',
          paymentId: buyerPayment._id 
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database error creating payment:', dbError);
      return NextResponse.json(
        { error: 'Failed to save payment to database' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error creating buyer payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query
    const query: any = { 'buyerInfo.email': session.user.email };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const payments = await BuyerPaymentModel.find(query);
    const total = await BuyerPaymentModel.countDocuments(query);

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching buyer payments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

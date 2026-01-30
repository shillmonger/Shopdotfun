import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clientPromise } from '@/lib/db';
import { ObjectId } from 'mongodb';
import UserModel from '@/models/User';
import OrderModel from '@/models/Order';
import SellerNotificationModel from '@/models/SellerNotification';

// GET - Fetch all payments for admin approval
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db('shop_dot_fun');
    
    const adminUser = await db.collection('buyers').findOne({ 
      email: session.user.email,
      roles: { $in: ['admin'] }
    }) || await db.collection('sellers').findOne({ 
      email: session.user.email,
      roles: { $in: ['admin'] }
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query
    const query: any = {};
    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    const skip = (page - 1) * limit;

    const payments = await db.collection('buyerPayments')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('buyerPayments').countDocuments(query);

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
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update payment status (approve/reject)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db('shop_dot_fun');
    
    const adminUser = await db.collection('buyers').findOne({ 
      email: session.user.email,
      roles: { $in: ['admin'] }
    }) || await db.collection('sellers').findOne({ 
      email: session.user.email,
      roles: { $in: ['admin'] }
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { paymentId, status } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'Payment ID and status are required' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be approved or rejected' },
        { status: 400 }
      );
    }

    // Get the payment details
    const payment = await db.collection('buyerPayments').findOne({
      _id: new ObjectId(paymentId)
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status
    const updatedPayment = await db.collection('buyerPayments').findOneAndUpdate(
      { _id: new ObjectId(paymentId) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    // If approved, update buyer's payment history and balance, create orders, and send notifications
    if (status === 'approved') {
      const buyerEmail = payment.buyerInfo.email;
      const amountToPay = payment.buyerInfo.amountToPay;
      const cryptoAmount = payment.cryptoAmount;

      // Add to buyer's payment history using UserModel
      await UserModel.addPaymentHistory(buyerEmail, {
        paymentId: new ObjectId(paymentId),
        amountPaid: amountToPay,
        cryptoAmount: cryptoAmount,
        cryptoMethod: payment.buyerInfo.cryptoMethodUsed,
        orderTotal: payment.buyerInfo.orderTotal
      });

      // Update user balance by adding the amountPaid
      await UserModel.updateUserBalance(buyerEmail, amountToPay);

      // Create orders for each product and send notifications to sellers
      for (const product of payment.productsInfo) {
        // Generate unique order ID
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        
        // Get buyer's shipping address (use default address or first available)
        const buyerAddresses = payment.buyerInfo.addresses || [];
        const shippingAddress = buyerAddresses.find((addr: any) => addr.isDefault) || buyerAddresses[0] || null;
        
        // Get seller information
        const seller = await db.collection('sellers').findOne({ 
          email: product.sellerInfo.sellerEmail 
        });
        
        // Create order for this product
        const orderData = {
          orderId: orderId,
          buyerInfo: {
            username: payment.buyerInfo.username,
            email: payment.buyerInfo.email,
            phoneNumber: payment.buyerInfo.phoneNumber,
            shippingAddress: shippingAddress ? {
              fullName: shippingAddress.fullName,
              phone: shippingAddress.phone,
              street: shippingAddress.street,
              city: shippingAddress.city,
              state: shippingAddress.state,
              country: shippingAddress.country,
              isDefault: shippingAddress.isDefault
            } : {
              fullName: payment.buyerInfo.username,
              phone: payment.buyerInfo.phoneNumber,
              street: '',
              city: '',
              state: '',
              country: payment.buyerInfo.country || '',
              isDefault: true
            }
          },
          productInfo: {
            productCode: product.productCode,
            name: product.name,
            price: product.price,
            discount: product.discount || 0,
            quantity: product.quantity || 1,
            images: product.images || [],
            description: product.description || '',
            stock: product.stock || 0,
            shippingFee: product.shippingFee || 0,
            processingTime: product.processingTime || ''
          },
          sellerInfo: {
            sellerName: product.sellerInfo.sellerName,
            sellerEmail: product.sellerInfo.sellerEmail,
            phoneNumber: seller?.phone || '',
            country: seller?.country || ''
          },
          status: {
            shipping: 'pending' as const,
            buyerAction: 'none' as const, 
            payment: 'pending' as const, 
            adminAction: 'none' as const
          },
          paymentInfo: {
            amount: product.price,
            cryptoMethodUsed: payment.buyerInfo.cryptoMethodUsed,
            cryptoAmount: (parseFloat(payment.cryptoAmount) * (product.price / payment.buyerInfo.orderTotal)).toString(),
            cryptoAddress: payment.cryptoAddress,
            paymentId: paymentId
          }
        };

        const createdOrder = await OrderModel.create(orderData);
        console.log(`Order created for seller ${product.sellerInfo.sellerEmail}:`, createdOrder.orderId);

        // Create notification for seller
        const notificationData = {
          sellerEmail: product.sellerInfo.sellerEmail,
          sellerName: product.sellerInfo.sellerName,
          title: 'New Order Received',
          message: `Hi ${product.sellerInfo.sellerName}, ${payment.buyerInfo.username} has placed an order on a product you are selling. Please process and ship the product.`,
          type: 'new_order' as const,
          relatedOrderId: createdOrder.orderId,
          relatedOrderLink: `/general-dashboard/seller-dashboard/orders-management`
        };

        await SellerNotificationModel.create(notificationData);
        console.log(`Notification sent to seller ${product.sellerInfo.sellerEmail}`);
      }
    }

    return NextResponse.json({
      message: `Payment ${status} successfully`,
      payment: updatedPayment
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

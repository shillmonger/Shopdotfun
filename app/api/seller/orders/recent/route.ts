import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OrderModel from '@/models/Order';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Get URL parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');

    // Build query for seller-specific orders
const query: any = { 'sellerInfo.sellerEmail': session.user.email };
    
    // Add status filter if provided
    if (status) {
      query['status.shipping'] = status;
    }

    // Always try to get exactly 10 orders (or as many as exist)
    const targetLimit = 10;
    
    // First, get recent orders
    const recentOrders = await OrderModel.findRecentOrders(query, {
      limit: targetLimit,
      skip: (page - 1) * targetLimit,
      sort: { createdAt: -1 }
    });

    // If we have less than 10 orders and this is the first page, get older orders to fill up to 10
    if (recentOrders.length < targetLimit && page === 1) {
      const remainingNeeded = targetLimit - recentOrders.length;
      const olderOrders = await OrderModel.findRecentOrders(query, {
        limit: remainingNeeded,
        skip: recentOrders.length,
        sort: { createdAt: -1 }
      });
      
      // Combine recent and older orders
      const allOrders = [...recentOrders, ...olderOrders];
      
      // Get total count for pagination
      const totalCount = await OrderModel.countDocuments(query);

      // Transform the data to match the frontend format
      const transformedOrders = allOrders.map(order => ({
        id: order.orderId,
        buyer: order.buyerInfo.username,
        buyerEmail: order.buyerInfo.email,
        date: order.createdAt.toLocaleDateString(),
        shippingAddress: order.buyerInfo.shippingAddress || null,
        items: [
          {
            name: order.productInfo.name,
            qty: order.productInfo.quantity || 1,
            price: order.productInfo.price,
            discount: order.productInfo.discount || 0,
            productCode: order.productInfo.productCode,
            images: order.productInfo.images || [],
            description: order.productInfo.description || '',
            stock: order.productInfo.stock || 0,
            shippingFee: order.productInfo.shippingFee || 0,
            processingTime: order.productInfo.processingTime || ''
          }
        ],
        total: order.paymentInfo.amount,
        status: order.status,
        fulfillmentStatus: order.status,
        productInfo: order.productInfo,
        paymentInfo: order.paymentInfo,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }));

      return NextResponse.json({
        success: true,
        data: transformedOrders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalOrders: totalCount,
          hasMore: page * limit < totalCount
        }
      });
    }

    // Get total count for pagination
    const totalCount = await OrderModel.countDocuments(query);

    // Transform the data to match the frontend format for recent orders
    const transformedOrders = recentOrders.map(order => ({
      id: order.orderId,
      buyer: order.buyerInfo.username,
      buyerEmail: order.buyerInfo.email,
      date: order.createdAt.toLocaleDateString(),
      shippingAddress: order.buyerInfo.shippingAddress || null,
      items: [
        {
          name: order.productInfo.name,
          qty: order.productInfo.quantity || 1,
          price: order.productInfo.price,
          discount: order.productInfo.discount || 0,
          productCode: order.productInfo.productCode,
          images: order.productInfo.images || [],
          description: order.productInfo.description || '',
          stock: order.productInfo.stock || 0,
          shippingFee: order.productInfo.shippingFee || 0,
          processingTime: order.productInfo.processingTime || ''
        }
      ],
      total: order.paymentInfo.amount,
      status: order.status,
      fulfillmentStatus: order.status,
      productInfo: order.productInfo,
      paymentInfo: order.paymentInfo,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: transformedOrders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalOrders: totalCount,
        hasMore: page * limit < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching recent seller orders:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch recent orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

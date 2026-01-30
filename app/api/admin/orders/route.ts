import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OrderModel from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // TODO: Add admin role verification here
    // For now, we'll assume any authenticated user can access

    // Get all orders for admin monitoring
    const orders = await OrderModel.find({}, { sort: { createdAt: -1 } });

    // Transform the data to match the frontend format
    const formattedOrders = orders.map((order: any) => ({
      id: order.orderId,
      buyer: order.buyerInfo.username,
      seller: order.sellerInfo.sellerName,
      amount: `${order.paymentInfo.amount} ${order.paymentInfo.cryptoMethodUsed.toUpperCase()}`,
      date: order.createdAt.toLocaleDateString(),
      status: order.status,
      buyerInfo: order.buyerInfo,
      sellerInfo: order.sellerInfo,
      productInfo: order.productInfo,
      paymentInfo: order.paymentInfo,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedOrders
    });

  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

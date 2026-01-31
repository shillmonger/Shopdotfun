import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import OrderModel from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const buyerEmail = token.email;
    
    // Get all orders for this buyer, sorted by most recent
    const allOrders = await OrderModel.findByBuyerEmail(buyerEmail);
    
    // Separate shipped orders and others
    const shippedOrders = allOrders.filter(order => order.status?.shipping === 'shipped');
    const otherOrders = allOrders.filter(order => order.status?.shipping !== 'shipped');
    
    let recentOrders: any[] = [];
    
    // First, add shipped orders (up to 5)
    recentOrders = shippedOrders.slice(0, 5);
    
    // If we have less than 5 shipped orders, add other orders to complete the list
    if (recentOrders.length < 5) {
      const needed = 5 - recentOrders.length;
      const additionalOrders = otherOrders.slice(0, needed);
      recentOrders = [...recentOrders, ...additionalOrders];
    }
    
    // If no orders at all, return empty array
    if (recentOrders.length === 0) {
      return NextResponse.json({
        success: true,
        recentOrders: [],
        message: 'No orders found'
      });
    }
    
    // Transform orders for frontend display
    const transformedOrders = recentOrders.map(order => ({
      orderId: order.orderId,
      productName: order.productInfo.name,
      productImage: order.productInfo.images?.[0]?.thumbnailUrl || null,
      price: order.productInfo.price,
      status: order.status?.shipping || 'pending',
      createdAt: order.createdAt,
      quantity: order.productInfo.quantity,
      sellerName: order.productInfo.name
    }));
    
    return NextResponse.json({
      success: true,
      recentOrders: transformedOrders,
      totalOrders: allOrders.length,
      shippedCount: shippedOrders.length,
      otherCount: otherOrders.length
    });
    
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent orders' },
      { status: 500 }
    );
  }
}

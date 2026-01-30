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
    
    // Get all orders for this buyer
    const orders = await OrderModel.findByBuyerEmail(buyerEmail);
    
    // Count orders by status based on new nested structure
    const pendingCount = orders.filter(order => order.status?.shipping === 'pending').length;
    const shippedCount = orders.filter(order => order.status?.shipping === 'shipped').length;
    
    return NextResponse.json({
      success: true,
      orders,
      stats: {
        pending: pendingCount,
        shipped: shippedCount,
        total: orders.length
      }
    });
    
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

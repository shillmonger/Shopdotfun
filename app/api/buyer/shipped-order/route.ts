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
    
    // Get all shipped orders for this buyer
    const orders = await OrderModel.findByBuyerEmail(buyerEmail);
    const shippedOrders = orders.filter(order => order.status?.shipping === 'shipped');
    
    // Sort by updatedAt date (most recent first) and get the first one
    const mostRecentShippedOrder = shippedOrders
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
    
    return NextResponse.json({
      success: true,
      shippedOrder: mostRecentShippedOrder || null
    });
    
  } catch (error) {
    console.error('Error fetching shipped order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipped order' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import OrderModel from '@/models/Order';

export async function GET(
  request: NextRequest,
  context: { params: { orderId: string } }
) {
  try {
    const token = await getToken({ req: request });

    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const buyerEmail = token.email;
    const { orderId } = context.params;

    // Find the specific order for this buyer
    const order = await OrderModel.findByOrderIdAndBuyerEmail(
      orderId,
      buyerEmail
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import OrderModel from '@/models/Order';
import { validateStatusUpdate } from '@/lib/order-status';

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, updates } = body;

    if (!orderId || !updates) {
      return NextResponse.json(
        { error: 'Order ID and updates are required' },
        { status: 400 }
      );
    }

    // Find the order
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify the order belongs to this buyer
    if (order.buyerInfo.email !== token.email) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Validate the status update for buyer role
    const validation = validateStatusUpdate(order.status, updates, 'buyer');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Special handling for "Received" action
    if (updates.buyerAction === 'received') {
      updates.shipping = 'received';
    }

    // Update the order
    const updatedOrder = await OrderModel.updateStatus(orderId, updates);

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error updating buyer order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

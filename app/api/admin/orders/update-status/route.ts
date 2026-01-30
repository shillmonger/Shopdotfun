import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OrderModel from '@/models/Order';
import { validateStatusUpdate } from '@/lib/order-status';

export async function PATCH(request: NextRequest) {
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

    // Validate the status update for admin role
    const validation = validateStatusUpdate(order.status, updates, 'admin');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Update the order
    const updatedOrder = await OrderModel.updateStatus(orderId, updates);

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error updating admin order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

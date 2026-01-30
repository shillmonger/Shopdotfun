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

    // Fetch orders for the current seller
    const orders = await OrderModel.findBySellerEmail(session.user.email);

    // Transform the data to match the frontend format
    const formattedOrders = orders.map(order => ({
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
      paymentInfo: order.paymentInfo
    }));

    return NextResponse.json({
      success: true,
      data: formattedOrders
    });

  } catch (error) {
    console.error('Error fetching seller orders:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH - Update order status
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Verify the order belongs to this seller
    const order = await OrderModel.findById(orderId);
    if (!order || order.sellerInfo.sellerEmail !== session.user.email) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      );
    }

    const updatedOrder = await OrderModel.updateStatus(orderId, status);

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      {
        error: 'Failed to update order status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

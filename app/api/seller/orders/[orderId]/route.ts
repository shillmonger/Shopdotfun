import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OrderModel from '@/models/Order';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Find the order by ID and verify it belongs to this seller
    const order = await OrderModel.findById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify the order belongs to this seller
    if (order.sellerInfo.sellerEmail !== session.user.email) {
      return NextResponse.json(
        { error: 'Access denied - Order does not belong to this seller' },
        { status: 403 }
      );
    }

    // Return the full order data for the buyer info page
    return NextResponse.json({
      success: true,
      data: {
        orderId: order.orderId,
        buyerInfo: order.buyerInfo,
        productInfo: order.productInfo,
        status: order.status,
        paymentInfo: order.paymentInfo,
        sellerInfo: order.sellerInfo,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch order details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

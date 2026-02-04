import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OrderModel from '@/models/Order';
import UserModel from '@/models/User';
import { validateStatusUpdate } from '@/lib/order-status';
import { ObjectId } from 'mongodb';

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

    // Handle payment release logic
    if (updates.payment === 'paid' && order.status.payment !== 'paid') {
      try {
        // Get buyer and seller information
        const buyerEmail = order.buyerInfo.email;
        const sellerEmail = order.sellerInfo.sellerEmail;
        const productPrice = order.productInfo.price;
        const shippingFee = order.productInfo.shippingFee || 0;
        const totalAmount = productPrice + shippingFee;
        const paymentId = order.paymentInfo.paymentId;
        const cryptoAmount = order.paymentInfo.cryptoAmount;
        const cryptoMethod = order.paymentInfo.cryptoMethodUsed;

        // Deduct amount from buyer's balance
        await UserModel.updateUserBalance(buyerEmail, -totalAmount);
        
        // Add deduction record to buyer's payment history
        await UserModel.addBuyerPaymentHistory(buyerEmail, {
          paymentId: new ObjectId(paymentId),
          amountDeducted: totalAmount,
          cryptoAmount,
          cryptoMethod,
          orderTotal: totalAmount,
          orderId: order.orderId
        });

        // Credit amount to seller's balance
        await UserModel.updateSellerBalance(sellerEmail, totalAmount);
        
        // Add credit record to seller's payment history
        await UserModel.addSellerPaymentHistory(sellerEmail, {
          paymentId: new ObjectId(paymentId),
          amountReceived: totalAmount,
          cryptoAmount,
          cryptoMethod,
          orderTotal: totalAmount,
          orderId: order.orderId,
          payoutStatus: 'pending'
        });

        console.log(`Payment released: ${totalAmount} deducted from ${buyerEmail} and credited to ${sellerEmail}`);
      } catch (balanceError) {
        console.error('Error updating user balances:', balanceError);
        // Don't fail the order update if balance update fails
        // Log it for manual intervention
      }
    }

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

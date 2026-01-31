import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import OrderModel from '@/models/Order';
import { Product } from '@/models/Product';
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
      
      // Deduct product quantity from seller's product stock
      try {
        const productCode = order.productInfo.productCode;
        const orderQuantity = order.productInfo.quantity;
        
        // Find the product and deduct the quantity
        const product = await Product.findOne({ productCode: productCode });
        if (product) {
          const newStock = Math.max(0, product.stock - orderQuantity);
          await Product.updateOne(
            { productCode: productCode },
            { 
              $set: { 
                stock: newStock,
                updatedAt: new Date()
              }
            }
          );
          console.log(`Deducted ${orderQuantity} from product ${productCode}. New stock: ${newStock}`);
        } else {
          console.warn(`Product with code ${productCode} not found for stock deduction`);
        }
      } catch (stockError) {
        console.error('Error deducting product stock:', stockError);
        // Continue with order update even if stock deduction fails
      }
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

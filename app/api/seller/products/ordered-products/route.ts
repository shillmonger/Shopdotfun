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

    // Extract unique products from orders
    const uniqueProducts = new Map();
    
    orders.forEach(order => {
      const productKey = order.productInfo.productCode;
      if (!uniqueProducts.has(productKey)) {
        uniqueProducts.set(productKey, {
          id: productKey,
          name: order.productInfo.name,
          code: order.productInfo.productCode,
          orderId: order.orderId,
          status: order.status
        });
      }
    });

    const products = Array.from(uniqueProducts.values());

    return NextResponse.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Error fetching seller products:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

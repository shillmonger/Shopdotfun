import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clientPromise } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('shop_dot_fun');

    // Get seller info for user balance
    const seller = await db.collection('sellers').findOne({
      email: session.user.email
    });

    if (!seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      );
    }

    // Get today's date range (start and end of today)
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Calculate Total Sales - sum of productInfo.price for orders with payment: "paid"
    const paidOrders = await db.collection('orders')
      .find({
        'sellerInfo.sellerEmail': session.user.email,
        'status.payment': 'paid'
      })
      .toArray();

    const totalSales = paidOrders.reduce((sum, order) => {
      return sum + (order.productInfo?.price || 0);
    }, 0);

    // Get Can Withdraw - userBalance from sellers collection
    const canWithdraw = seller.userBalance || 0;

    // Get Orders Today - count of orders created today
    const ordersToday = await db.collection('orders').countDocuments({
      'sellerInfo.sellerEmail': session.user.email,
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd
      }
    });

    // Get Pending Ship - count of orders with shipping: "shipped"
    const pendingShip = await db.collection('orders').countDocuments({
      'sellerInfo.sellerEmail': session.user.email,
      'status.shipping': 'shipped'
    });

    return NextResponse.json({
      success: true,
      data: {
        totalSales,
        canWithdraw,
        ordersToday,
        pendingShip
      }
    });

  } catch (error) {
    console.error('Error fetching seller stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

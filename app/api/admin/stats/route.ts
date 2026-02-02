import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { clientPromise } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db('shop_dot_fun');
    
    const adminUser = await db.collection('buyers').findOne({ 
      email: session.user.email,
      roles: { $in: ['admin'] }
    }) || await db.collection('sellers').findOne({ 
      email: session.user.email,
      roles: { $in: ['admin'] }
    });

    if (!adminUser) {
      return new NextResponse('Forbidden - Admin access required', { status: 403 });
    }

    // Get total buyers count
    const totalBuyers = await db.collection('buyers').countDocuments();

    // Get total sellers count
    const totalSellers = await db.collection('sellers').countDocuments();

    // Get total orders count
    const totalOrders = await db.collection('orders').countDocuments();

    // Get pending payments count
    const pendingPayments = await db.collection('buyerPayments').countDocuments({
      status: 'pending'
    });

    const stats = {
      totalBuyers,
      totalSellers,
      totalOrders,
      pendingPayments
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { clientPromise } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';

interface UserDocument {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  country: string;
  roles: string[];
  createdAt: Date;
  userBalance?: number;
  profileImage?: string;
}

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

    // Get pending product approvals
    const pendingProductApprovals = await db.collection('products').countDocuments({
      status: 'pending'
    });

    // Get pending seller payouts (paymentHistory with payoutStatus: 'requested')
    const pendingPayouts = await db.collection('sellers').aggregate([
      { $unwind: '$paymentHistory' },
      { $match: { 'paymentHistory.payoutStatus': 'requested' } },
      { $count: 'total' }
    ]).toArray();

    // Get platform revenue (sum of admin fees from completed orders)
    const platformRevenue = await db.collection('orders').aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$adminFee' } } }
    ]).toArray();

    // Get recent buyers and sellers (5 each, mixed by latest)
    const recentBuyers = await db.collection('buyers').find({}).sort({ createdAt: -1 }).limit(5).toArray() as UserDocument[];
    const recentSellers = await db.collection('sellers').find({}).sort({ createdAt: -1 }).limit(5).toArray() as UserDocument[];

    // Combine and sort by createdAt to get the most recent users
    const allRecentUsers = [
      ...recentBuyers.map(buyer => ({
        ...buyer,
        userType: 'Buyer' as const,
        balance: buyer.userBalance || 0
      })),
      ...recentSellers.map(seller => ({
        ...seller,
        userType: 'Seller' as const,
        balance: seller.userBalance || 0
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10); // Take only the 10 most recent

    // If no recent users (fallback), get 5 buyers and 5 sellers
    let systemAlerts = allRecentUsers;
    if (allRecentUsers.length === 0) {
      const fallbackBuyers = await db.collection('buyers').find({}).limit(5).toArray() as UserDocument[];
      const fallbackSellers = await db.collection('sellers').find({}).limit(5).toArray() as UserDocument[];

      systemAlerts = [
        ...fallbackBuyers.map(buyer => ({
          ...buyer,
          userType: 'Buyer' as const,
          balance: buyer.userBalance || 0
        })),
        ...fallbackSellers.map(seller => ({
          ...seller,
          userType: 'Seller' as const,
          balance: seller.userBalance || 0
        }))
      ];
    }

    // Transform to match the expected interface
    const transformedSystemAlerts = systemAlerts.map(user => ({
      name: user.name,
      email: user.email,
      country: user.country,
      balance: user.balance,
      phone: user.phone,
      type: user.userType,
      roles: user.roles || [],
      profileImage: user.profileImage
    }));

    const stats = {
      totalBuyers,
      totalSellers,
      totalOrders,
      pendingPayments,
      pendingProductApprovals,
      pendingPayouts: pendingPayouts[0]?.total || 0,
      platformRevenue: platformRevenue[0]?.total || 0,
      systemAlerts: transformedSystemAlerts
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

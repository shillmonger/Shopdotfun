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

    // Fetch all buyers
    const buyers = await db.collection('buyers')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Remove sensitive data and add default profile image if needed
    const sanitizedBuyers = buyers.map(buyer => {
      const { password, ...buyerData } = buyer;
      if (!buyerData.profileImage) {
        buyerData.profileImage = 'https://github.com/shadcn.png';
      }
      return buyerData;
    });
    
    return NextResponse.json(sanitizedBuyers);
  } catch (error) {
    console.error('Error fetching buyers:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

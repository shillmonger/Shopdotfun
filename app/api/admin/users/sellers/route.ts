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

    // Fetch all sellers
    const sellers = await db.collection('sellers')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Remove sensitive data and add default profile image if needed
    const sanitizedSellers = sellers.map(seller => {
      const { password, ...sellerData } = seller;
      if (!sellerData.profileImage) {
        sellerData.profileImage = 'https://github.com/shadcn.png';
      }
      return sellerData;
    });
    
    return NextResponse.json(sanitizedSellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

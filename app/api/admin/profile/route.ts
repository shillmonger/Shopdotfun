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

    const client = await clientPromise;
    const db = client.db('shop_dot_fun');
    
    // Find the admin in either buyers or sellers collection
    const admin = await db.collection('buyers').findOne({ 
      email: session.user.email,
      roles: { $in: ['admin'] }
    }) || await db.collection('sellers').findOne({ 
      email: session.user.email,
      roles: { $in: ['admin'] }
    });

    if (!admin) {
      return new NextResponse('Admin not found', { status: 404 });
    }

    // Remove sensitive data before sending the response
    const { password, ...adminData } = admin;
    
    return NextResponse.json(adminData);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

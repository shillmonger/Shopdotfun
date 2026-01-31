import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { clientPromise } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PUT(request: Request) {
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

    const data = await request.json();
    const { userId, userType, status } = data;

    if (!userId || !userType || !status) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    if (!['buyers', 'sellers'].includes(userType)) {
      return new NextResponse('Invalid user type', { status: 400 });
    }

    if (!['Active', 'Suspended'].includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    const collection = db.collection(userType);
    
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    return NextResponse.json({ message: `User ${status.toLowerCase()} successfully` });
  } catch (error) {
    console.error('Error updating user status:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

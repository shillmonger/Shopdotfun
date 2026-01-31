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
    const { userId, userType, action } = data;

    if (!userId || !userType || !action) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    if (!['buyers', 'sellers'].includes(userType)) {
      return new NextResponse('Invalid user type', { status: 400 });
    }

    if (!['add', 'remove'].includes(action)) {
      return new NextResponse('Invalid action', { status: 400 });
    }

    const collection = db.collection(userType);
    
    if (action === 'add') {
      // Add admin role
      const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $addToSet: { roles: 'admin' },
          $set: { updatedAt: new Date() }
        }
      );
      
      if (result.matchedCount === 0) {
        return new NextResponse('User not found', { status: 404 });
      }
      
      return NextResponse.json({ message: 'Admin role added successfully' });
    } else {
      // Remove admin role
      const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $pull: { roles: 'admin' } as any,
          $set: { updatedAt: new Date() }
        }
      );
      
      if (result.matchedCount === 0) {
        return new NextResponse('User not found', { status: 404 });
      }
      
      return NextResponse.json({ message: 'Admin role removed successfully' });
    }
  } catch (error) {
    console.error('Error updating user role:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

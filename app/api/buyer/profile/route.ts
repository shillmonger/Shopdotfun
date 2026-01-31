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
    
    // Find the buyer in the database
    const buyer = await db.collection('buyers').findOne({ 
      email: session.user.email 
    });

    if (!buyer) {
      return new NextResponse('Buyer not found', { status: 404 });
    }

    // Remove sensitive data before sending the response
    const { password, ...buyerData } = buyer;
    
    return NextResponse.json(buyerData);
  } catch (error) {
    console.error('Error fetching buyer profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const { name, email, phone, profileImage } = data;

    // Basic validation
    if (!name || !email || !phone) {
      return new NextResponse('All fields are required', { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('shop_dot_fun');
    
    // Prepare update object
    const updateData: any = {
      name,
      email,
      phone,
      updatedAt: new Date(),
    };

    // Add profile image if provided
    if (profileImage !== undefined) {
      updateData.profileImage = profileImage;
    }
    
    // Update the buyer's information
    const result = await db.collection('buyers').updateOne(
      { email: session.user.email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return new NextResponse('Buyer not found', { status: 404 });
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating buyer profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

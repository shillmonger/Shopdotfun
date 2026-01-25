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
    const db = client.db('shpdotfun');
    
    // Find the seller in the database
    const seller = await db.collection('seller-users').findOne({ 
      email: session.user.email 
    });

    if (!seller) {
      return new NextResponse('Seller not found', { status: 404 });
    }

    // Remove sensitive data before sending the response
    const { password, ...sellerData } = seller;
    
    return NextResponse.json(sellerData);
  } catch (error) {
    console.error('Error fetching seller profile:', error);
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
    const { businessName, name, phone, country, businessAddress } = data;

    // Basic validation
    if (!businessName || !name || !phone || !country || !businessAddress) {
      return new NextResponse('All fields are required', { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('shpdotfun');
    
    // Update the seller's information
    const result = await db.collection('seller-users').updateOne(
      { email: session.user.email },
      {
        $set: {
          businessName,
          name,
          phone,
          country,
          businessAddress,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return new NextResponse('Seller not found', { status: 404 });
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating seller profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

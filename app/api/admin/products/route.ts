import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Product } from '@/models/Product';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Fetch all products with pending status
    const products = await Product.find({ status: 'pending' })
      .sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products for admin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Product } from '@/models/Product';
import { connectDB } from '@/lib/db';

// Generate a unique product code
function generateProductCode(): string {
  // Generate a random 5-digit number between 10000 and 99999
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { status, rejectionReason } = await request.json();
    
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    if (status === 'rejected' && !rejectionReason?.trim()) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }
    
    const updateData: any = { status };
    
    if (status === 'approved') {
      updateData.productCode = generateProductCode();
    } else if (status === 'rejected') {
      updateData.rejectionReason = rejectionReason;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // TODO: Send notification to seller about the status update
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product status:', error);
    return NextResponse.json(
      { error: 'Failed to update product status' },
      { status: 500 }
    );
  }
}

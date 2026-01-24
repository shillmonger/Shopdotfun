import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clientPromise } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Await params (required in new Next.js)
    const { id } = await context.params;

    // ✅ Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ✅ Connect to DB
    const client = await clientPromise;
    const db = client.db();

    // ✅ Use seller (NOT sellerEmail)
    const result = await db.collection('products').deleteOne({
      _id: new ObjectId(id),
      seller: session.user.email
    });

    console.log('DELETE DEBUG:', {
      id,
      seller: session.user.email,
      deletedCount: result.deletedCount
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });

  } catch (error) {
    console.error('❌ Delete product error:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting product' },
      { status: 500 }
    );
  }
}

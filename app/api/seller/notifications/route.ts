import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { clientPromise } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Get products collection
    const productsCollection = db.collection('products');

    // Fetch only approved and rejected products for the current seller
    const notifications = await productsCollection
      .find({
        sellerEmail: session.user.email,
        status: { $in: ['approved', 'rejected'] }
      })
      .sort({ updatedAt: -1 }) // Most recently updated first
      .toArray();

    // Transform the data to match the notification format
    const formattedNotifications = notifications.map(product => ({
      id: product._id.toString(),
      productId: product._id.toString(),
      productName: product.name,
      status: product.status.charAt(0).toUpperCase() + product.status.slice(1), // Capitalize first letter
      reason: product.status === 'approved' 
        ? 'Your product is now live. Great job on the description!' 
        : product.rejectionReason || 'Product rejected without specific reason.',
      date: product.createdAt.toLocaleDateString(), // Show actual creation date
      isRead: false, // You might want to track this in the database
    }));

    return NextResponse.json({
      success: true,
      data: formattedNotifications
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch notifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function formatDate(date: Date): string {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - notificationDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return notificationDate.toLocaleDateString();
}

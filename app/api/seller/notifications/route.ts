import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { clientPromise } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import SellerNotificationModel from '@/models/SellerNotification';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Fetch notifications from the new sellerNotifications collection
    const notifications = await SellerNotificationModel.findBySeller(session.user.email);

    // Transform the data to match the frontend notification format
    const formattedNotifications = notifications.map(notification => ({
      id: notification._id?.toString() || '',
      title: notification.title,
      message: notification.message,
      type: notification.type,
      status: notification.type === 'new_order' ? 'New Order' : 'Info',
      date: formatDate(notification.createdAt),
      isRead: notification.read,
      relatedOrderId: notification.relatedOrderId,
      relatedOrderLink: notification.relatedOrderLink
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

// PATCH - Mark notification as read
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    await SellerNotificationModel.markAsRead(notificationId);

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      {
        error: 'Failed to mark notification as read',
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
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  // If less than 1 minute ago
  if (diffMinutes < 1) return 'Just now';
  
  // If less than 1 hour ago
  if (diffHours < 1) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  
  // If less than 24 hours ago (today)
  if (diffHours < 24) {
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  }
  
  // If exactly 1 day ago (yesterday)
  if (diffDays === 1) return 'Yesterday';
  
  // If less than 7 days ago
  if (diffDays < 7) return `${diffDays} days ago`;
  
  // If less than 30 days ago
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  
  // Otherwise show the actual date
  return notificationDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: notificationDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  });
}

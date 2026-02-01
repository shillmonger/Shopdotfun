import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user already rated this product
    const existingReview = product.reviews?.find(
      (review: any) => review.userId === session.user.email
    );

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already rated this product' },
        { status: 400 }
      );
    }

    // Add a new rating with default comment
    const newReview = {
      userId: session.user.email,
      userName: session.user.name || 'Anonymous',
      rating: 1, // Default rating when clicking star
      comment: 'User rated this product',
      createdAt: new Date()
    };

    // Initialize reviews array if it doesn't exist
    if (!product.reviews) {
      product.reviews = [];
    }

    product.reviews.push(newReview);

    // Calculate new average rating and total ratings
    const totalRatings = product.reviews.length;
    const sumRatings = product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    product.averageRating = sumRatings / totalRatings;
    product.totalRatings = totalRatings;

    await product.save();

    return NextResponse.json({
      message: 'Rating added successfully',
      averageRating: product.averageRating,
      totalRatings: product.totalRatings,
      userHasRated: true
    });

  } catch (error) {
    console.error('Error adding rating:', error);
    return NextResponse.json(
      { error: 'Failed to add rating' },
      { status: 500 }
    );
  }
}

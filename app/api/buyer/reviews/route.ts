import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product, IReview } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Fetch approved products with ratings and reviews
    const products = await Product.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('name sellerName images averageRating totalRatings reviews createdAt')
      .lean();

    const total = await Product.countDocuments({ status: 'approved' });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + products.length < total
      }
    });

  } catch (error) {
    console.error('Error fetching products for reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

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

    const { productId, rating, comment } = await request.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Product ID, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
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

    // Check if user already reviewed this product
    const existingReviewIndex = product.reviews?.findIndex(
      (review: IReview) => review.userId === session.user.email
    );

    const newReview = {
      userId: session.user.email,
      userName: session.user.name || 'Anonymous',
      rating,
      comment,
      createdAt: new Date()
    };

    if (existingReviewIndex !== undefined && existingReviewIndex !== -1) {
      // Update existing review
      product.reviews[existingReviewIndex] = newReview;
    } else {
      // Add new review
      product.reviews.push(newReview);
    }

    // Calculate new average rating and total ratings
    const totalRatings = product.reviews.length;
    const sumRatings = product.reviews.reduce((sum: number, review: IReview) => sum + review.rating, 0);
    product.averageRating = sumRatings / totalRatings;
    product.totalRatings = totalRatings;

    await product.save();

    return NextResponse.json({
      message: 'Review submitted successfully',
      averageRating: product.averageRating,
      totalRatings: product.totalRatings,
      review: newReview
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Product } from '@/models/Product';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopdotfun';

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');
    const sortBy = searchParams.get('sortBy') || 'totalRatings';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query for approved products with ratings
    const query: any = {
      status: 'approved',
      $or: [
        { totalRatings: { $gt: 0 } },
        { averageRating: { $gt: 0 } }
      ]
    };

    // Build sort options
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // If sorting by ratings, prioritize products with more ratings
    if (sortBy === 'totalRatings') {
      sortOptions.averageRating = -1; // Secondary sort by average rating
    } else if (sortBy === 'averageRating') {
      sortOptions.totalRatings = -1; // Secondary sort by total ratings
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit)
      .skip(skip)
      .select('name price discount stock shippingFee images category averageRating totalRatings sellerName sellerEmail crypto')
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

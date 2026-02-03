import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to get random categories
function getRandomCategories(allCategories: string[], count: number): string[] {
  const shuffled = shuffleArray(allCategories);
  return shuffled.slice(0, count);
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const categoryCount = parseInt(searchParams.get('categoryCount') || '5');
    const sessionId = searchParams.get('sessionId') || 'default';

    // Get all distinct categories from approved products
    const categories = await Product.distinct('category', { status: 'approved' });
    
    if (categories.length === 0) {
      return NextResponse.json({
        products: [],
        categories: [],
        usedCategories: []
      });
    }

    // Get random categories for this session
    const selectedCategories = getRandomCategories(categories, Math.min(categoryCount, categories.length));
    
    // Fetch products from selected categories
    const products = await Product.find({
      status: 'approved',
      category: { $in: selectedCategories },
      stock: { $gt: 0 } // Only show products in stock
    })
    .select('name category stock discount images sellerName price shippingFee averageRating totalRatings reviews crypto productCode')
    .lean();

    // Shuffle products to ensure randomness
    const shuffledProducts = shuffleArray(products);
    
    // Limit the final result
    const finalProducts = shuffledProducts.slice(0, limit);

    return NextResponse.json({
      products: finalProducts,
      categories: categories,
      usedCategories: selectedCategories,
      sessionId: sessionId
    });

  } catch (error) {
    console.error('Error fetching recommended products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommended products' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6'); // Default 6 products per category

    // Fetch all approved products
    const products = await Product.find({ 
      status: 'approved',
      stock: { $gt: 0 } // Only in-stock products
    })
    .select('name price discount stock shippingFee images category averageRating totalRatings sellerName sellerEmail crypto')
    .sort({ createdAt: -1 })
    .lean();

    // Group products by category
    const productsByCategory: { [key: string]: any[] } = {};
    
    products.forEach(product => {
      const category = product.category || 'Others';
      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      
      // Limit products per category
      if (productsByCategory[category].length < limit) {
        productsByCategory[category].push({
          _id: product._id,
          name: product.name,
          price: product.price,
          discount: product.discount || 0,
          stock: product.stock,
          shippingFee: product.shippingFee || 0,
          images: product.images || [],
          category: product.category,
          averageRating: product.averageRating || 0,
          totalRatings: product.totalRatings || 0,
          sellerName: product.sellerName,
          sellerEmail: product.sellerEmail,
          crypto: product.crypto || 'USDT'
        });
      }
    });

    // Convert to the expected format with category titles
    const categorySections = Object.entries(productsByCategory).map(([category, categoryProducts]) => ({
      title: category,
      products: categoryProducts.map(product => ({
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        oldPrice: product.discount > 0 ? Math.round(product.price / (1 - product.discount / 100)) : product.price,
        discount: product.discount,
        img: product.images[0]?.url || '',
        _id: product._id,
        stock: product.stock,
        shippingFee: product.shippingFee,
        category: product.category,
        averageRating: product.averageRating,
        totalRatings: product.totalRatings,
        sellerName: product.sellerName,
        sellerEmail: product.sellerEmail,
        crypto: product.crypto,
        images: product.images
      }))
    }));

    return NextResponse.json({
      success: true,
      data: categorySections
    });

  } catch (error) {
    console.error('Error fetching category products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category products' },
      { status: 500 }
    );
  }
}

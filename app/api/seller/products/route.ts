import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { clientPromise } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    console.log('\n=== API Route: Starting product creation ===');
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.error('❌ Unauthorized - No session or email');
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    console.log('🔌 Connecting to database...');
    const client = await clientPromise;
    console.log('✅ Database connection established');

    const db = client.db();
    console.log('📊 Using database:', db.databaseName);

    // List all collections for debugging
    try {
      const allCollections = await db.listCollections().toArray();
      console.log('📂 Existing collections:', allCollections.map(c => c.name));
    } catch (error) {
      console.error('❌ Error listing collections:', error);
    }

    // Check if products collection exists, create if it doesn't
    let productsCollection;
    try {
      const collections = await db.listCollections({ name: 'products' }).toArray();
      if (collections.length === 0) {
        console.log('🆕 Products collection does not exist, creating...');
        await db.createCollection('products');
        console.log('✅ Products collection created successfully');
      }
      productsCollection = db.collection('products');
    } catch (error) {
      console.error('❌ Error setting up products collection:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to set up products collection: ${errorMessage}`);
    }

    const data = await request.json();
    console.log('📥 Received product data:', JSON.stringify({
      ...data,
      images: data.images ? `[${data.images.length} images]` : 'No images'
    }, null, 2));

    // Validate required fields
    if (!data.name || !data.price || !data.category || !data.images?.length) {
      console.error('❌ Missing required fields:', {
        name: !!data.name,
        price: !!data.price,
        category: !!data.category,
        hasImages: data.images?.length > 0
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create product document
    const product = {
      ...data,
      sellerEmail: session.user.email,
      sellerName: session.user.name, // Add seller name from session
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('💾 Attempting to save product to database...');
    try {
      const result = await productsCollection.insertOne(product);
      console.log('✅ Product saved successfully:', {
        insertedId: result.insertedId,
        acknowledged: result.acknowledged
      });

      // Verify the document was saved
      const savedProduct = await productsCollection.findOne({ _id: result.insertedId });
      if (savedProduct) {
        console.log('🔍 Retrieved saved product from database:', {
          _id: savedProduct._id,
          name: savedProduct.name,
          sellerEmail: savedProduct.sellerEmail,
          status: savedProduct.status
        });
      } else {
        console.error('❌ Failed to retrieve saved product after insertion');
      }

      return NextResponse.json({
        success: true,
        productId: result.insertedId,
      });
    } catch (dbError) {
      const error = dbError as Error & { code?: string | number; codeName?: string };
      console.error('❌ Database error during product save:', {
        error: error.message,
        code: error.code,
        codeName: error.codeName
      });
      throw error;
    }
  } catch (error) {
    const err = error as Error & { name?: string; stack?: string };
    console.error('❌ Error in product creation:', {
      error: err.message,
      name: err.name,
      stack: err.stack
    });
    return NextResponse.json(
      { error: `Failed to create product: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(); // uses DB from connection string
    // const db = client.db(dbName);

    // Debug: Log database connection info
    console.log('Connected to database:', db.databaseName);
    console.log('MongoDB URI:', process.env.MONGODB_URI);

    // Get query parameters
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Debug logging
    console.log('Session user email:', session.user.email);
    console.log('Query params:', { status, search, page, limit });

    // Get products collection
    const productsCollection = db.collection('products');

    // Build the base query to find products for the current seller
    interface ProductQuery {
      sellerEmail: string;
      status?: string;
      $or?: Array<{
        [key: string]: { $regex: string; $options: string };
      }>;
    }

    const query: ProductQuery = {
      sellerEmail: session.user.email
    };


    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Get products with pagination
    const products = await db
      .collection('products')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Debug: Check if any products exist for any seller
    console.log('Found products for query:', products.length);
    if (products.length === 0) {
      const allProducts = await db.collection('products').find({}).toArray();
      console.log('Total products in database:', allProducts.length);
      if (allProducts.length > 0) {
        console.log('Sample product:', JSON.stringify({
          _id: allProducts[0]._id,
          name: allProducts[0].name,
          sellerEmail: allProducts[0].sellerEmail || 'No sellerEmail field',
          status: allProducts[0].status
        }, null, 2));
      }
    }

    // Get total count for pagination
    const total = await db.collection('products').countDocuments(query);

    return NextResponse.json({
      success: true,
      data: products.map(product => ({
        ...product,
        _id: product._id.toString(),
        price: product.price.toString(),
        discount: product.discount?.toString() || '0',
        stock: product.stock?.toString() || '0',
      })),
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

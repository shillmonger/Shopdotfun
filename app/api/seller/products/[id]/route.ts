import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clientPromise } from '@/lib/db';
import { ObjectId } from 'mongodb';

// Define the RouteContext type for params
type RouteContext = {
  params: {
    id: string;
  };
};

// Define interfaces for data structures
interface ProductImage {
  url: string;
  thumbnailUrl?: string;
  publicId: string;
}

interface CloudinaryUploadResult {
  secure_url: string;
  thumbnail_url?: string;
  publicId: string;
}

interface ProductUpdateData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  shippingFee: number;
  processingTime: string;
  crypto: string;
  discount: number;
  images: ProductImage[];
  updatedAt: Date;
}

// Helper function to handle MongoDB ObjectId validation
const isValidObjectId = (id: string) => {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
};

// GET: Fetch a single product by ID
export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to DB
    const client = await clientPromise;
    const db = client.db();

    // Find the product
    const product = await db.collection('products').findOne({
      _id: new ObjectId(id),
      sellerEmail: session.user.email // Ensure the product belongs to the logged-in seller
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found or access denied' },
        { status: 404 }
      );
    }

    // Convert _id to string for JSON serialization
    const { _id, ...productData } = product;
    
    return NextResponse.json({
      success: true,
      data: {
        _id: _id.toString(),
        ...productData
      }
    });

  } catch (error) {
    console.error('❌ Fetch product error:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching product' },
      { status: 500 }
    );
  }
}

// PUT: Update a product
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name')?.toString().trim();
    const description = formData.get('description')?.toString() || '';
    const price = parseFloat(formData.get('price')?.toString() || '0');
    const category = formData.get('category')?.toString();
    const stock = parseInt(formData.get('stock')?.toString() || '1', 10);
    const shippingFee = parseFloat(formData.get('shippingFee')?.toString() || '0');
    const processingTime = formData.get('processingTime')?.toString() || '1-2 Days';
    const crypto = formData.get('crypto')?.toString() || 'USDT';
    const discount = parseFloat(formData.get('discount')?.toString() || '0');
    
    // Get removed image public IDs
    const removedImages = formData.getAll('removedImages') as string[];
    
    // Get new image files
    const imageFiles = formData.getAll('images')
      .filter((file): file is File => file instanceof File && file.size > 0);

    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name, price, or category' },
        { status: 400 }
      );
    }

    // Connect to DB
    const client = await clientPromise;
    const db = client.db();

    // Check if product exists and belongs to the seller
    const existingProduct = await db.collection('products').findOne({
      _id: new ObjectId(id),
      sellerEmail: session.user.email
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found or access denied' },
        { status: 404 }
      );
    }

    // Handle image uploads if there are new images
    let uploadedImages: CloudinaryUploadResult[] = [];
    if (imageFiles.length > 0) {
      const { uploadToCloudinary } = await import('@/lib/cloudinary');
      const uploadPromises = imageFiles.map(file => uploadToCloudinary(file));
      uploadedImages = await Promise.all(uploadPromises) as CloudinaryUploadResult[];
    }

    // Filter out removed images
    let updatedImages: ProductImage[] = existingProduct.images || [];
    if (removedImages.length > 0) {
      updatedImages = updatedImages.filter(
        (img: ProductImage) => !removedImages.includes(img.publicId)
      );
    }

    // Add new images
    if (uploadedImages.length > 0) {
      uploadedImages.forEach((img: CloudinaryUploadResult) => {
        updatedImages.push({
          url: img.secure_url,
          thumbnailUrl: img.thumbnail_url,
          publicId: img.publicId
        });
      });
    }

    // Update the product with proper typing
    const updateData: Partial<ProductUpdateData> = {
      name: name as string,
      description,
      price,
      category: category as string,
      stock,
      shippingFee,
      processingTime,
      crypto,
      discount,
      images: updatedImages,
      updatedAt: new Date()
    };

    await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
    });

  } catch (error) {
    console.error('❌ Update product error:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating product' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to DB
    const client = await clientPromise;
    const db = client.db();

    // Delete the product
    const result = await db.collection('products').deleteOne({
      _id: new ObjectId(id),
      sellerEmail: session.user.email
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
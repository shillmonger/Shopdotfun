// app/general-dashboard/seller-dashboard/add-product/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import CommissionModel from '@/models/Commission';

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { 
      success: false, 
      error: 'You must be logged in to add a product' 
    };
  }

  try {
    // Extract form data
    const name = formData.get('name')?.toString().trim();
    const description = formData.get('description')?.toString() || '';
    const price = parseFloat(formData.get('price')?.toString() || '0');
    const category = formData.get('category')?.toString();
    const stock = parseInt(formData.get('stock')?.toString() || '1', 10);
    const shippingFee = parseFloat(formData.get('shippingFee')?.toString() || '0');
    const processingTime = formData.get('processingTime')?.toString() || '1-2 Days';
    const crypto = formData.get('crypto')?.toString() || 'USDT';
    const discount = parseFloat(formData.get('discount')?.toString() || '0');

    // Validate required fields
    if (!name || !price || !category) {
      return { 
        success: false, 
        error: 'Missing required fields: name, price, or category' 
      };
    }

    // Get image files
    const imageFiles = formData.getAll('images')
      .filter((file): file is File => file instanceof File && file.size > 0);

    if (imageFiles.length < 2) {
      return { 
        success: false, 
        error: 'Please upload at least 2 images' 
      };
    }

    // Upload images to Cloudinary
    const uploadPromises = imageFiles.map(file => uploadToCloudinary(file));
    const uploadedImages = await Promise.all(uploadPromises);

    // Connect to database
    await connectDB();

    // Calculate commission for this product
    const commissionResult = await CommissionModel.calculateCommission(price);
    const sellerEarnings = price - commissionResult.fee;

    // Create new product
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      shippingFee,
      processingTime,
      crypto,
      discount,
      images: uploadedImages.map(img => ({
        url: img.secure_url,
        thumbnailUrl: img.thumbnail_url,
        publicId: img.publicId
      })),
      sellerEmail: session.user.email,
      sellerName: session.user.name, // Add seller's name from session
      status: 'pending',
      // Add commission data
      commissionFee: commissionResult.fee,
      commissionTier: commissionResult.tier ? {
        id: commissionResult.tier.id,
        min: commissionResult.tier.min,
        max: commissionResult.tier.max,
        type: commissionResult.tier.type,
        value: commissionResult.tier.value
      } : undefined,
      sellerEarnings: sellerEarnings,
    });

    await newProduct.save();

    revalidatePath('/general-dashboard/seller-dashboard');
    return { 
      success: true,
      productId: newProduct._id.toString()
    };

  } catch (error) {
    console.error('Error creating product:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create product' 
    };
  }
}
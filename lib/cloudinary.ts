// lib/cloudinary.ts
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Configure Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Missing Cloudinary environment variables');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  secure_url: string;
  thumbnail_url: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `Unsupported file type. Allowed types: ${ALLOWED_TYPES.join(', ')}` 
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
    };
  }
  
  return { valid: true };
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  try {
    console.log('Starting upload for file:', file.name, 'Size:', file.size, 'bytes');
    
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'shopdotfun/products',
          resource_type: 'auto',
          chunk_size: 6 * 1024 * 1024,
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new Error(error.message || 'Upload failed'));
          }
          if (!result) {
            return reject(new Error('No response from Cloudinary'));
          }
          resolve(result);
        }
      );
      
      uploadStream.on('error', (error: Error) => {
        console.error('Upload stream error:', error);
        reject(error);
      });
      
      uploadStream.end(buffer);
    });

    if (!result.secure_url) {
      throw new Error('Failed to get secure URL from Cloudinary');
    }

    const thumbnailUrl = cloudinary.url(result.public_id, {
      width: 300,
      height: 300,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format || '',
      width: result.width || 0,
      height: result.height || 0,
      bytes: result.bytes || 0,
      secure_url: result.secure_url,
      thumbnail_url: thumbnailUrl
    };
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw error;
  }
}

export async function uploadProfileImage(file: File): Promise<CloudinaryUploadResult> {
  try {
    console.log('Starting profile image upload for file:', file.name, 'Size:', file.size, 'bytes');
    
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'shopdotfun/profiles',
          resource_type: 'auto',
          chunk_size: 6 * 1024 * 1024,
          quality: 'auto:good',
          fetch_format: 'auto',
          width: 500,
          height: 500,
          crop: 'fill',
          gravity: 'face'
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error('Cloudinary profile upload error:', error);
            return reject(new Error(error.message || 'Profile upload failed'));
          }
          if (!result) {
            return reject(new Error('No response from Cloudinary'));
          }
          resolve(result);
        }
      );
      
      uploadStream.on('error', (error: Error) => {
        console.error('Profile upload stream error:', error);
        reject(error);
      });
      
      uploadStream.end(buffer);
    });

    if (!result.secure_url) {
      throw new Error('Failed to get secure URL from Cloudinary');
    }

    const thumbnailUrl = cloudinary.url(result.public_id, {
      width: 150,
      height: 150,
      crop: 'fill',
      quality: 'auto:good',
      fetch_format: 'auto',
      gravity: 'face'
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format || '',
      width: result.width || 0,
      height: result.height || 0,
      bytes: result.bytes || 0,
      secure_url: result.secure_url,
      thumbnail_url: thumbnailUrl
    };
  } catch (error) {
    console.error('Error in uploadProfileImage:', error);
    throw error;
  }
}
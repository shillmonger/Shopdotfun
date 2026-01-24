// models/Product.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discount: number;
  crypto: string;
  category: string;
  stock: number;
  shippingFee: number;
  processingTime: string;
  images: Array<{
    url: string;
    thumbnailUrl: string;
    publicId: string;
  }>;
  seller: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    crypto: { type: String, required: true, default: 'USDT' },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 1 },
    shippingFee: { type: Number, default: 0, min: 0 },
    processingTime: { type: String, required: true },
    images: [{
      url: { type: String, required: true },
      thumbnailUrl: { type: String, required: true },
      publicId: { type: String, required: true }
    }],
    seller: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create text index for search
ProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text' 
});

export const Product = mongoose.models.Product || 
  mongoose.model<IProduct>('Product', ProductSchema);
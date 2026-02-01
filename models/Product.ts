// models/Product.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IReview {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

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
  sellerEmail: string;
  sellerName: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  productCode?: string;
  // Commission fields
  commissionFee?: number;
  commissionTier?: {
    id: string;
    min: number;
    max: number | null;
    type: "percent" | "flat";
    value: number;
  };
  sellerEarnings?: number;
  // Rating and Review fields
  averageRating?: number;
  totalRatings?: number;
  reviews?: IReview[];
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
    sellerEmail: { type: String, required: true, index: true },
    sellerName: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    rejectionReason: { type: String },
    productCode: { type: String, unique: true, sparse: true },
    // Commission fields
    commissionFee: { type: Number, min: 0 },
    commissionTier: {
      id: { type: String },
      min: { type: Number },
      max: { type: Number, default: null },
      type: { type: String, enum: ['percent', 'flat'] },
      value: { type: Number, min: 0 }
    },
    sellerEarnings: { type: Number, min: 0 },
    // Rating and Review fields
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0, min: 0 },
    reviews: [{
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }]
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
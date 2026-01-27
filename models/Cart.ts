// models/Cart.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  productId: string;
  productName: string;
  sellerName: string;
  price: number;
  discount: number;
  quantity: number;
  stock: number;
  shippingFee: number;
  image: string;
  addedAt: Date;
}

export interface ICart extends Document {
  buyerEmail: string;
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  sellerName: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  quantity: { type: Number, required: true, min: 1 },
  stock: { type: Number, required: true, min: 0 },
  shippingFee: { type: Number, required: true, min: 0, default: 0 },
  image: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

const CartSchema = new Schema<ICart>(
  {
    buyerEmail: { type: String, required: true, index: true },
    items: [CartItemSchema],
    totalAmount: { type: Number, default: 0, min: 0 }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound index for buyerEmail to ensure one cart per buyer
CartSchema.index({ buyerEmail: 1 }, { unique: true });

// Pre-save middleware to calculate total amount
CartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    const itemPrice = item.discount > 0 
      ? item.price * (1 - item.discount / 100) 
      : item.price;
    return total + (itemPrice * item.quantity);
  }, 0);
  next();
});

export const Cart = mongoose.models.Cart || 
  mongoose.model<ICart>('Cart', CartSchema);

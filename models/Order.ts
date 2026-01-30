// models/Order.ts
import { ObjectId } from 'mongodb';
import { clientPromise } from '@/lib/db';

export interface IOrder {
  _id?: ObjectId;
  
  // Order Information
  orderId: string; // Unique order ID for tracking (e.g., ORD-99281)
  buyerInfo: {
    username: string;
    email: string;
    phoneNumber: string;
    shippingAddress: {
      fullName: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      country: string;
      isDefault: boolean;
    };
  };
  
  // Product Information (single product per order for individual seller tracking)
  productInfo: {
    productCode: string;
    name: string;
    price: number;
    discount: number;
    quantity: number;
    images: Array<{
      url: string;
      thumbnailUrl: string;
      publicId: string;
    }>;
    description: string;
    stock: number;
    shippingFee: number;
    processingTime: string;
  };
  
  // Seller Information
  sellerInfo: {
    sellerName: string;
    sellerEmail: string;
    phoneNumber: string;
    country: string;
  };
  
  // Order Status
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  
  // Payment Information
  paymentInfo: {
    amount: number;
    cryptoMethodUsed: string;
    cryptoAmount: string;
    cryptoAddress: string;
    paymentId: string; // Reference to the original payment
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const dbName = 'shop_dot_fun';

class OrderModel {
  static async create(orderData: Omit<IOrder, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      
      console.log('Connected to database, inserting into collection: orders');
      
      const now = new Date();
      const orderWithTimestamps = {
        ...orderData,
        createdAt: now,
        updatedAt: now,
      };

      console.log('Order data to insert:', JSON.stringify(orderWithTimestamps, null, 2));

      const result = await db.collection('orders').insertOne(orderWithTimestamps);
      console.log('Insert result:', result);
      
      const createdOrder = { ...orderWithTimestamps, _id: result.insertedId };
      console.log('Order created with ID:', createdOrder._id);
      
      return createdOrder;
    } catch (error) {
      console.error('OrderModel.create error:', error);
      throw error;
    }
  }

  static async find(query: any = {}, options: any = {}) {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    return await db.collection('orders').find(query, options).toArray();
  }

  static async findBySellerEmail(sellerEmail: string) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      
      return await db.collection('orders')
        .find({ 'sellerInfo.sellerEmail': sellerEmail })
        .sort({ createdAt: -1 })
        .toArray();
    } catch (error) {
      console.error('OrderModel.findBySellerEmail error:', error);
      throw error;
    }
  }

  static async findByBuyerEmail(buyerEmail: string) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      
      return await db.collection('orders')
        .find({ 'buyerInfo.email': buyerEmail })
        .sort({ createdAt: -1 })
        .toArray();
    } catch (error) {
      console.error('OrderModel.findByBuyerEmail error:', error);
      throw error;
    }
  }

  static async updateStatus(orderId: string, status: IOrder['status']) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      
      const result = await db.collection('orders').findOneAndUpdate(
        { orderId: orderId },
        { 
          $set: { 
            status: status,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      
      return result;
    } catch (error) {
      console.error('OrderModel.updateStatus error:', error);
      throw error;
    }
  }

  static async findById(orderId: string) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      
      return await db.collection('orders').findOne({ orderId: orderId });
    } catch (error) {
      console.error('OrderModel.findById error:', error);
      throw error;
    }
  }

  static async countDocuments(query: any = {}) {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    return await db.collection('orders').countDocuments(query);
  }
}

export default OrderModel;

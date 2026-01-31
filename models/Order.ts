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
  status: {
    shipping: 'pending' | 'shipped' | 'received';      // pending | shipped | received
    buyerAction: 'none' | 'received' | 'delayed' | 'damaged';      // none | received | delayed | damaged
    payment: 'pending' | 'paid';       // pending | paid
    adminAction: 'none' | 'reviewed' | 'refunded' | 'other'       // none | reviewed | refunded | other
  };
  
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
      
      // Ensure status object has all required fields with defaults
      const defaultStatus = {
        shipping: 'pending' as const,
        buyerAction: 'none' as const,
        payment: 'pending' as const,
        adminAction: 'none' as const
      };
      
      const orderWithTimestamps = {
        ...orderData,
        status: orderData.status || defaultStatus,
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
    
    let cursor = db.collection('orders').find(query, options);
    
    // Add sorting if specified in options
    if (options.sort) {
      cursor = cursor.sort(options.sort);
    }
    
    return await cursor.toArray();
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

  static async updateStatus(orderId: string, statusUpdate: Partial<IOrder['status']>) {
    try {
      const client = await clientPromise;
      const db = client.db('shop_dot_fun');
      
      // Build the update object dynamically based on provided status fields
      const statusUpdateFields: any = {};
      Object.keys(statusUpdate).forEach(key => {
        statusUpdateFields[`status.${key}`] = statusUpdate[key as keyof IOrder['status']];
      });
      
      const result = await db.collection('orders').findOneAndUpdate(
        { orderId: orderId },
        { 
          $set: { 
            ...statusUpdateFields,
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

  static async findRecentOrders(query: any = {}, options: { limit?: number; skip?: number; sort?: any } = {}) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      
      const {
        limit = 10,
        skip = 0,
        sort = { createdAt: -1 }
      } = options;
      
      let cursor = db.collection('orders').find(query);
      cursor = cursor.sort(sort).skip(skip).limit(limit);
      
      return await cursor.toArray();
    } catch (error) {
      console.error('OrderModel.findRecentOrders error:', error);
      throw error;
    }
  }
}

export default OrderModel;

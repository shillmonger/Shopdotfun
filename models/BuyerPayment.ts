// models/BuyerPayment.ts
import { ObjectId } from 'mongodb';
import { clientPromise } from '@/lib/db';

export interface IBuyerPayment {
  _id?: ObjectId;
  // Buyer Information
  buyerInfo: {
    orderTotal: number;
    amountToPay: number;
    username: string;
    email: string;
    phoneNumber: string;
    addresses: Array<{
      fullName: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      country: string;
      isDefault: boolean;
    }>;
    country: string;
    cryptoMethodUsed: string;
    timePaid: Date;
  };

  // Products Information (includes seller info in each product)
  productsInfo: Array<{
    productCode: string;
    name: string;
    price: number;
    images: Array<{
      url: string;
      thumbnailUrl: string;
      publicId: string;
    }>;
    description: string;
    stock: number;
    shippingFee: number;
    processingTime: string;
    sellerInfo: {
      sellerName: string;
      sellerEmail: string;
    };
  }>;

  // Payment Status
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  
  // Additional payment details
  cryptoAmount: string;
  cryptoAddress: string;
  transactionId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const dbName = 'shop_dot_fun';

class BuyerPaymentModel {
  static async create(paymentData: Omit<IBuyerPayment, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      
      console.log('Connected to database, inserting into collection: buyerPayments');
      
      const now = new Date();
      const paymentWithTimestamps = {
        ...paymentData,
        createdAt: now,
        updatedAt: now,
      };

      console.log('Payment data to insert:', JSON.stringify(paymentWithTimestamps, null, 2));

      const result = await db.collection('buyerPayments').insertOne(paymentWithTimestamps);
      console.log('Insert result:', result);
      
      const createdPayment = { ...paymentWithTimestamps, _id: result.insertedId };
      console.log('Payment created with ID:', createdPayment._id);
      
      return createdPayment;
    } catch (error) {
      console.error('BuyerPaymentModel.create error:', error);
      throw error;
    }
  }

  static async find(query: any = {}, options: any = {}) {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    return await db.collection('buyerPayments').find(query, options).toArray();
  }

  static async countDocuments(query: any = {}) {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    return await db.collection('buyerPayments').countDocuments(query);
  }
}

export default BuyerPaymentModel;

// models/SellerNotification.ts
import { ObjectId } from 'mongodb';
import { clientPromise } from '@/lib/db';

export interface ISellerNotification {
  _id?: ObjectId;
  
  // Seller Information
  sellerEmail: string;
  sellerName: string;
  
  // Notification Content
  title: string;
  message: string;
  
  // Notification Type
  type: 'new_order' | 'order_update' | 'payment' | 'system';
  
  // Related Information
  relatedOrderId?: string;
  relatedOrderLink?: string;
  
  // Status
  read: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const dbName = 'shop_dot_fun';

class SellerNotificationModel {
  static async create(notificationData: Omit<ISellerNotification, '_id' | 'createdAt' | 'updatedAt' | 'read'>) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      
      console.log('Connected to database, inserting into collection: sellerNotifications');
      
      const now = new Date();
      const notificationWithTimestamps = {
        ...notificationData,
        read: false,
        createdAt: now,
        updatedAt: now,
      };

      console.log('Notification data to insert:', JSON.stringify(notificationWithTimestamps, null, 2));

      const result = await db.collection('sellerNotifications').insertOne(notificationWithTimestamps);
      console.log('Insert result:', result);
      
      const createdNotification = { ...notificationWithTimestamps, _id: result.insertedId };
      console.log('Notification created with ID:', createdNotification._id);
      
      return createdNotification;
    } catch (error) {
      console.error('SellerNotificationModel.create error:', error);
      throw error;
    }
  }

  static async findBySeller(sellerEmail: string) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      
      return await db.collection('sellerNotifications')
        .find({ sellerEmail: sellerEmail })
        .sort({ createdAt: -1 })
        .toArray();
    } catch (error) {
      console.error('SellerNotificationModel.findBySeller error:', error);
      throw error;
    }
  }

  static async markAsRead(notificationId: string) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      
      const result = await db.collection('sellerNotifications').findOneAndUpdate(
        { _id: new ObjectId(notificationId) },
        { 
          $set: { 
            read: true,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      
      return result;
    } catch (error) {
      console.error('SellerNotificationModel.markAsRead error:', error);
      throw error;
    }
  }

  static async markAllAsRead(sellerEmail: string) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      
      const result = await db.collection('sellerNotifications').updateMany(
        { sellerEmail: sellerEmail, read: false },
        { 
          $set: { 
            read: true,
            updatedAt: new Date()
          }
        }
      );
      
      return result;
    } catch (error) {
      console.error('SellerNotificationModel.markAllAsRead error:', error);
      throw error;
    }
  }

  static async getUnreadCount(sellerEmail: string) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      
      return await db.collection('sellerNotifications').countDocuments({ 
        sellerEmail: sellerEmail, 
        read: false 
      });
    } catch (error) {
      console.error('SellerNotificationModel.getUnreadCount error:', error);
      throw error;
    }
  }

  static async delete(notificationId: string) {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      
      const result = await db.collection('sellerNotifications').deleteOne({ 
        _id: new ObjectId(notificationId) 
      });
      
      return result;
    } catch (error) {
      console.error('SellerNotificationModel.delete error:', error);
      throw error;
    }
  }
}

export default SellerNotificationModel;

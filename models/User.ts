import { clientPromise } from '@/lib/db';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface UserBase {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  phone: string;
  country: string;
  roles: UserRole[];
  status: 'Active' | 'Suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  _id?: ObjectId;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Buyer extends UserBase {
  addresses?: Address[];
  paymentHistory?: Array<{
    paymentId: ObjectId;
    amountPaid: number;
    cryptoAmount: string;
    cryptoMethod: string;
    approvedAt: Date;
    orderTotal: number;
  }>;
  userBalance?: number;
}

export interface CryptoPayoutDetails {
  walletName: string;
  walletAddress: string;
  network: string;
  currency: string;
  isDefault: boolean;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Seller extends UserBase {
  businessName: string;
  businessAddress: string;
  cryptoPayoutDetails?: CryptoPayoutDetails[];
  userBalance?: number;
  paymentHistory?: Array<{
    paymentId: ObjectId;
    amountReceived: number;
    cryptoAmount: string;
    cryptoMethod: string;
    receivedAt: Date;
    orderTotal: number;
    orderId: string;
  }>;
}

export type User = Buyer | Seller;

const dbName = 'shop_dot_fun';

class UserModel {
  static async createUser(userData: Omit<Buyer, '_id' | 'createdAt' | 'updatedAt' | 'roles'> | Omit<Seller, '_id' | 'createdAt' | 'updatedAt' | 'roles'>, roles: UserRole[]) {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    
    const now = new Date();
    const userWithRoles = {
      ...userData,
      password: hashedPassword, // Store the hashed password
      roles,
      createdAt: now,
      updatedAt: now,
    };

    // Determine the collection based on user role
    const collectionName = roles.includes('seller') ? 'sellers' : 'buyers';
    const collection = db.collection(collectionName);
    
    // Check if email already exists in the target collection only
    const existingUser = await collection.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already in use for this account type');
    }

    const result = await collection.insertOne(userWithRoles);
    return { ...userWithRoles, _id: result.insertedId };
  }

  static async findUserByEmail(email: string, role?: UserRole) {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    // Search in the appropriate collection based on role
    if (role === 'buyer') {
      return await db.collection('buyers').findOne({ email });
    } else if (role === 'seller') {
      return await db.collection('sellers').findOne({ email });
    }
    
    // If no role specified, search in both collections
    const buyer = await db.collection('buyers').findOne({ email });
    if (buyer) return buyer;
    
    return await db.collection('sellers').findOne({ email });
  }

  static async findUserByEmailForAuth(email: string, selectedRole: UserRole) {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    // First try the expected collection
    const expectedCollection = selectedRole === 'buyer' ? 'buyers' : 'sellers';
    let user = await db.collection(expectedCollection).findOne({ email });
    
    if (user) {
      return user;
    }
    
    // If not found in expected collection, search the other collection
    // This allows admin users to authenticate regardless of stored collection
    const otherCollection = selectedRole === 'buyer' ? 'sellers' : 'buyers';
    user = await db.collection(otherCollection).findOne({ email });
    
    return user;
  }

  static async validateUser(email: string, password: string, role: UserRole) {
    const user = await this.findUserByEmailForAuth(email, role);
    if (!user) return null;
    
    // Check if user has the required role OR is admin (admin can authenticate as any role)
    if (!user.roles.includes(role) && !user.roles.includes('admin')) {
      return null;
    }
    
    // Check if user account is active
    if (user.status !== 'Active') {
      throw new Error('Account suspended');
    }
    
    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  // Add a role to an existing user
  static async addRole(userId: string, role: UserRole) {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    // First find the user in either collection
    const user = await db.collection('buyers').findOne({ _id: new ObjectId(userId) }) ||
                 await db.collection('sellers').findOne({ _id: new ObjectId(userId) });
    
    if (!user) return null;
    
    // Determine the collection based on the new role
    const collectionName = role === 'seller' ? 'sellers' : 'buyers';
    const collection = db.collection(collectionName);
    
    // If the user is being promoted to seller, we need to move them to the sellers collection
    if (role === 'seller' && !user.roles.includes('seller')) {
      // Remove from buyers collection if they were a buyer
      await db.collection('buyers').deleteOne({ _id: new ObjectId(userId) });
      
      // Add to sellers collection with updated roles
      const updatedUser = {
        ...user,
        roles: [...new Set([...user.roles, role])],
        updatedAt: new Date()
      };
      
      const result = await collection.insertOne(updatedUser);
      return { ...updatedUser, _id: result.insertedId };
    }
    
    // Otherwise, just update the roles in the current collection
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { 
        $addToSet: { roles: role },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    
    return result;
  }
  
  // Remove a role from a user
  static async removeRole(userId: string, role: UserRole) {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    // First find the user in either collection
    const user = await db.collection('buyers').findOne({ _id: new ObjectId(userId) }) ||
                 await db.collection('sellers').findOne({ _id: new ObjectId(userId) });
    
    if (!user) return null;
    
    // Determine the current collection
    const currentCollection = user.roles.includes('seller') ? 'sellers' : 'buyers';
    
    // If removing seller role and they have other roles, move to buyers collection
    if (role === 'seller' && user.roles.length > 1) {
      // Remove from sellers collection
      await db.collection('sellers').deleteOne({ _id: new ObjectId(userId) });
      
      // Add to buyers collection with updated roles
      const updatedRoles = user.roles.filter((r: UserRole) => r !== 'seller');
      const updatedUser = {
        ...user,
        roles: updatedRoles,
        updatedAt: new Date()
      };
      
      const result = await db.collection('buyers').insertOne(updatedUser);
      return { ...updatedUser, _id: result.insertedId };
    }
    
    // Otherwise, just update the roles in the current collection
    const update: any = {
      $pull: { roles: role },
      $set: { updatedAt: new Date() }
    };
    
    const collection = db.collection(currentCollection);
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      update,
      { returnDocument: 'after' }
    );
    
    return result;
  }
  
  // Get user by ID
  static async findById(userId: string) {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    // Check both collections
    const buyer = await db.collection('buyers').findOne({ _id: new ObjectId(userId) });
    if (buyer) return buyer;
    
    const seller = await db.collection('sellers').findOne({ _id: new ObjectId(userId) });
    return seller;
  }
  
  static async updateSellerProfile(email: string, updateData: Partial<Seller>) {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection('sellers');
    
    const now = new Date();
    const result = await collection.findOneAndUpdate(
      { email },
      { 
        $set: { 
          ...updateData,
          updatedAt: now 
        } 
      },
      { returnDocument: 'after' }
    );
    
    return result;
  }

  static async updateCryptoPayoutDetails(email: string, cryptoDetails: Omit<CryptoPayoutDetails, 'createdAt' | 'updatedAt'>) {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection<Seller>('sellers');
    
    const now = new Date();
    const cryptoWithTimestamps: CryptoPayoutDetails = {
      ...cryptoDetails,
      updatedAt: now,
      createdAt: now
    };
    
    // First, check if we're updating an existing wallet or adding a new one
    const existingSeller = await collection.findOne({ 
      email,
      'cryptoPayoutDetails.walletAddress': cryptoDetails.walletAddress 
    });
    
    let result;
    if (existingSeller && existingSeller.cryptoPayoutDetails?.some(wallet => 
      wallet.walletAddress === cryptoDetails.walletAddress)) {
      // Update existing wallet
      result = await collection.findOneAndUpdate(
        { 
          email,
          'cryptoPayoutDetails.walletAddress': cryptoDetails.walletAddress 
        },
        { 
          $set: { 
            'cryptoPayoutDetails.$': cryptoWithTimestamps,
            updatedAt: now
          } 
        },
        { returnDocument: 'after' }
      );
    } else {
      // Add new wallet or initialize the array if it doesn't exist
      const update: any = {
        $set: { updatedAt: now }
      };
      
      // Use $push with $each to add to array
      update.$push = {
        cryptoPayoutDetails: {
          $each: [cryptoWithTimestamps],
          $position: 0
        }
      };
      
      result = await collection.findOneAndUpdate(
        { email },
        update,
        { returnDocument: 'after' }
      );
    }
    
    return result;
  }

  static async addPaymentHistory(buyerEmail: string, paymentData: {
    paymentId: ObjectId;
    amountPaid: number;
    cryptoAmount: string;
    cryptoMethod: string;
    orderTotal: number;
  }) {
    try {
      const client = await clientPromise;
      const db = client.db('shop_dot_fun');
      
      const update: any = {
        $push: {
          paymentHistory: {
            ...paymentData,
            approvedAt: new Date()
          }
        },
        $set: { updatedAt: new Date() }
      };
      
      const result = await db.collection('buyers').findOneAndUpdate(
        { email: buyerEmail },
        update,
        { returnDocument: 'after' }
      );
      
      return result;
    } catch (error) {
      console.error('UserModel.addPaymentHistory error:', error);
      throw error;
    }
  }

  static async updateUserBalance(buyerEmail: string, amountToAdd: number) {
    try {
      const client = await clientPromise;
      const db = client.db('shop_dot_fun');
      
      const result = await db.collection('buyers').findOneAndUpdate(
        { email: buyerEmail },
        { 
          $inc: { userBalance: amountToAdd },
          $set: { updatedAt: new Date() }
        },
        { returnDocument: 'after' }
      );
      
      return result;
    } catch (error) {
      console.error('UserModel.updateUserBalance error:', error);
      throw error;
    }
  }

  static async updateSellerBalance(sellerEmail: string, amountToAdd: number) {
    try {
      const client = await clientPromise;
      const db = client.db('shop_dot_fun');
      
      const result = await db.collection('sellers').findOneAndUpdate(
        { email: sellerEmail },
        { 
          $inc: { userBalance: amountToAdd },
          $set: { updatedAt: new Date() }
        },
        { returnDocument: 'after' }
      );
      
      return result;
    } catch (error) {
      console.error('UserModel.updateSellerBalance error:', error);
      throw error;
    }
  }

  static async addSellerPaymentHistory(sellerEmail: string, paymentData: {
    paymentId: ObjectId;
    amountReceived: number;
    cryptoAmount: string;
    cryptoMethod: string;
    orderTotal: number;
    orderId: string;
  }) {
    try {
      const client = await clientPromise;
      const db = client.db('shop_dot_fun');
      
      const update: any = {
        $push: {
          paymentHistory: {
            ...paymentData,
            receivedAt: new Date()
          }
        },
        $set: { updatedAt: new Date() }
      };
      
      const result = await db.collection('sellers').findOneAndUpdate(
        { email: sellerEmail },
        update,
        { returnDocument: 'after' }
      );
      
      return result;
    } catch (error) {
      console.error('UserModel.addSellerPaymentHistory error:', error);
      throw error;
    }
  }

  static async addBuyerPaymentHistory(buyerEmail: string, paymentData: {
    paymentId: ObjectId;
    amountDeducted: number;
    cryptoAmount: string;
    cryptoMethod: string;
    orderTotal: number;
    orderId: string;
  }) {
    try {
      const client = await clientPromise;
      const db = client.db('shop_dot_fun');
      
      const update: any = {
        $push: {
          paymentHistory: {
            ...paymentData,
            approvedAt: new Date(),
            amountPaid: paymentData.amountDeducted
          }
        },
        $set: { updatedAt: new Date() }
      };
      
      const result = await db.collection('buyers').findOneAndUpdate(
        { email: buyerEmail },
        update,
        { returnDocument: 'after' }
      );
      
      return result;
    } catch (error) {
      console.error('UserModel.addBuyerPaymentHistory error:', error);
      throw error;
    }
  }
}

export default UserModel;
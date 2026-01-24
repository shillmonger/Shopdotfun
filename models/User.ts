import { clientPromise } from '@/lib/db';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export interface UserBase {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  phone: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
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
  role: 'buyer';
  addresses?: Address[];
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
  role: 'seller';
  businessName: string;
  businessAddress: string;
  cryptoPayoutDetails?: CryptoPayoutDetails[];
}

export type User = Buyer | Seller;

const dbName = 'shpdotfun';

class UserModel {
  static async createUser(userData: Omit<Buyer, '_id' | 'createdAt' | 'updatedAt' | 'role'> | Omit<Seller, '_id' | 'createdAt' | 'updatedAt' | 'role'>, role: 'buyer' | 'seller') {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    
    const now = new Date();
    const userWithRole = {
      ...userData,
      password: hashedPassword, // Store the hashed password
      role,
      createdAt: now,
      updatedAt: now,
    };

    const collection = db.collection(role === 'buyer' ? 'buyer-users' : 'seller-users');
    
    // Check if email already exists
    const existingUser = await collection.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const result = await collection.insertOne(userWithRole);
    return { ...userWithRole, _id: result.insertedId };
  }

  static async findUserByEmail(email: string, role: 'buyer' | 'seller') {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection(role === 'buyer' ? 'buyer-users' : 'seller-users');
    return await collection.findOne({ email });
  }

  static async validateUser(email: string, password: string, role: 'buyer' | 'seller') {
    const user = await this.findUserByEmail(email, role);
    if (!user) return null;
    
    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  static async updateSellerProfile(email: string, updateData: Partial<Seller>) {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection('seller-users');
    
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
    const collection = db.collection<Seller>('seller-users');
    
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
}

export default UserModel;

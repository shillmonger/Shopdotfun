import clientPromise from '@/lib/db';
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

export interface Buyer extends UserBase {
  role: 'buyer';
  // Add any buyer-specific fields here
}

export interface Seller extends UserBase {
  role: 'seller';
  businessName: string;
  businessAddress: string;
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
}

export default UserModel;

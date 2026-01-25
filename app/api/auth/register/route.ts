import { NextResponse } from 'next/server';
import UserModel from '@/models/User';

type UserRole = "buyer" | "seller";

type RegisterRequestBody = {
  name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  role: UserRole; // Default role during registration
  businessName?: string;
  businessAddress?: string;
}

export async function POST(req: Request) {
  try {
    const data: RegisterRequestBody = (await req.json()) as RegisterRequestBody;
    const { name, email, password, phone, country, role, businessName, businessAddress } = data;

    // Basic validation
    if (!name || !email || !password || !phone || !country || !role) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists with the same role
    const existingUser = await UserModel.findUserByEmail(email, role);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already in use for this account type' },
        { status: 400 }
      );
    }

    // Create user data object with common fields
    type UserData = {
      name: string;
      email: string;
      password: string;
      phone: string;
      country: string;
      businessName?: string;
      businessAddress?: string;
    };

    const userData: UserData = {
      name,
      email,
      password, // In a real app, you should hash the password
      phone,
      country,
    };

    // Add seller-specific fields if role is seller
    if (role === 'seller') {
      if (!businessName || !businessAddress) {
        return NextResponse.json(
          { message: 'Business name and address are required for seller registration' },
          { status: 400 }
        );
      }
      userData.businessName = businessName;
      userData.businessAddress = businessAddress;
    }

    // Create user with the specified role
    // For new registrations, we only assign one role initially
    const user = await UserModel.createUser(userData, [role]);

    return NextResponse.json(
      { message: 'User registered successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Registration failed' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import UserModel from '@/models/User';

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    // Check if user exists with this email and role
    const user = await UserModel.findUserByEmail(email, role as 'buyer' | 'seller');
    
    return NextResponse.json({ 
      exists: !!user,
      role: user?.role
    });

  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json(
      { error: 'Failed to check email' },
      { status: 500 }
    );
  }
}

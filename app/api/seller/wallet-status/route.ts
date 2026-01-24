import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserModel from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await UserModel.findUserByEmail(session.user.email, 'seller');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has any crypto payout details
    const hasWallets = user.cryptoPayoutDetails && user.cryptoPayoutDetails.length > 0;
    
    return NextResponse.json({ 
      isConnected: hasWallets,
      walletCount: user.cryptoPayoutDetails?.length || 0
    });
    
  } catch (error) {
    console.error('Error checking wallet status:', error);
    return NextResponse.json(
      { error: 'Failed to check wallet status' },
      { status: 500 }
    );
  }
}

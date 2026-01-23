import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import UserModel, { type CryptoPayoutDetails } from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await UserModel.findUserByEmail(session.user.email, 'seller');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      cryptoPayoutDetails: user.cryptoPayoutDetails || []
    });
  } catch (error) {
    console.error('Error fetching crypto payout details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crypto payout details' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.walletName || !data.walletAddress || !data.network || !data.currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const cryptoDetails: Omit<CryptoPayoutDetails, 'createdAt' | 'updatedAt'> = {
      walletName: data.walletName,
      walletAddress: data.walletAddress,
      network: data.network,
      currency: data.currency,
      isDefault: data.isDefault || false,
      verified: false // Initially not verified
    };

    const result = await UserModel.updateCryptoPayoutDetails(
      session.user.email,
      cryptoDetails
    );

    if (!result) {
      throw new Error('Failed to update crypto payout details');
    }

    return NextResponse.json({
      success: true,
      cryptoPayoutDetails: result.cryptoPayoutDetails || []
    });
  } catch (error) {
    console.error('Error updating crypto payout details:', error);
    return NextResponse.json(
      { error: 'Failed to update crypto payout details' },
      { status: 500 }
    );
  }
}

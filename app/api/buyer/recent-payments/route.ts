import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import BuyerPaymentModel from '@/models/BuyerPayment';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const buyerEmail = token.email;
    
    // Get the 2 most recent payments for this buyer
    const recentPayments = await BuyerPaymentModel.findByBuyerEmail(buyerEmail, 2);
    
    return NextResponse.json({
      success: true,
      recentPayments
    });
    
  } catch (error) {
    console.error('Error fetching recent payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent payments' },
      { status: 500 }
    );
  }
}

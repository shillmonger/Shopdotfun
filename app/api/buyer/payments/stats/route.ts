import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import BuyerPaymentModel from '@/models/BuyerPayment';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const baseQuery = { 'buyerInfo.email': session.user.email };

    // Get all payments for the user
    const allPayments = await BuyerPaymentModel.find(baseQuery);

    // Calculate statistics
    const stats = {
      totalApproved: allPayments
        .filter(payment => payment.status === 'confirmed')
        .reduce((sum, payment) => sum + payment.buyerInfo.amountToPay, 0),
      pendingCount: allPayments.filter(payment => payment.status === 'pending').length,
      rejectedCount: allPayments.filter(payment => payment.status === 'failed' || payment.status === 'cancelled').length,
      approvedCount: allPayments.filter(payment => payment.status === 'confirmed').length,
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

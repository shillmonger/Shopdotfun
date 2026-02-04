import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserModel from '@/models/User';
import CommissionService from '@/lib/commission';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const seller = await UserModel.findUserByEmail(session.user.email, 'seller');
    
    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    // Get all payment history (pending, requested, and paid)
    const allPayments = seller.paymentHistory || [];

    // Calculate commission for each payment
    const paymentsWithCommission = await Promise.all(
      allPayments.map(async (payment: any) => {
        try {
          const commissionCalculation = await CommissionService.calculateCommissionForAmount(payment.amountReceived);
          return {
            ...payment,
            commission: commissionCalculation
          };
        } catch (error) {
          console.error('Error calculating commission for payment:', payment.paymentId, error);
          // Return payment without commission if calculation fails
          return {
            ...payment,
            commission: {
              tier: { id: 'default', min: 0, max: null, type: 'percent' as const, value: 0 },
              commissionAmount: 0,
              settlementAmount: payment.amountReceived,
              originalAmount: payment.amountReceived
            }
          };
        }
      })
    );

    return NextResponse.json({ 
      success: true, 
      paymentHistory: paymentsWithCommission 
    });

  } catch (error) {
    console.error('Error fetching seller payment history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}

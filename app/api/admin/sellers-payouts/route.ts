import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { clientPromise } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import CommissionService from '@/lib/commission';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db('shop_dot_fun');
    
    const adminUser = await db.collection('buyers').findOne({ 
      email: session.user.email,
      roles: { $in: ['admin'] }
    }) || await db.collection('sellers').findOne({ 
      email: session.user.email,
      roles: { $in: ['admin'] }
    });

    if (!adminUser) {
      return new NextResponse('Forbidden - Admin access required', { status: 403 });
    }

    // Fetch all sellers
    const sellers = await db.collection('sellers')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Filter sellers with payment history items having status "requested"
    const sellersWithRequestedPayouts = await Promise.all(
      sellers.map(async (seller) => {
        const paymentHistory = seller.paymentHistory || [];
        const requestedPayments = paymentHistory.filter((payment: any) => 
          payment.payoutStatus === 'requested'
        );

        if (requestedPayments.length > 0) {
          // Calculate commission for each requested payment
          const paymentsWithCommission = await Promise.all(
            requestedPayments.map(async (payment: any) => {
              try {
                const commissionCalculation = await CommissionService.calculateCommissionForAmount(payment.amountReceived);
                return {
                  ...payment,
                  commission: commissionCalculation
                };
              } catch (error) {
                console.error('Error calculating commission for payment:', payment.paymentId, error);
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

          // Remove sensitive data
          const { password, ...sellerData } = seller;
          
          return {
            ...sellerData,
            requestedPayments: paymentsWithCommission
          };
        }
        return null;
      })
    );

    // Filter out null values
    const filteredSellers = sellersWithRequestedPayouts.filter(seller => seller !== null);
    
    return NextResponse.json(filteredSellers);
  } catch (error) {
    console.error('Error fetching sellers with requested payouts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

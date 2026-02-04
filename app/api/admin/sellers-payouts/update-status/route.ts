import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { clientPromise } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { sellerId, paymentId } = await request.json();

    if (!sellerId || !paymentId) {
      return NextResponse.json({ error: 'Seller ID and Payment ID are required' }, { status: 400 });
    }

    console.log('Request body:', { sellerId, paymentId });

    // Find the seller
    const sellerData = await db.collection('sellers').findOne({ 
      _id: new ObjectId(sellerId) 
    });
    
    console.log('Seller data found:', !!sellerData);
    console.log('Payment history length:', sellerData?.paymentHistory?.length || 0);
    
    if (!sellerData) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }
    
    console.log('Seller paymentHistory count:', sellerData.paymentHistory?.length || 0);
    
    // Find the payment in the paymentHistory array
    const paymentIndex = sellerData.paymentHistory?.findIndex((p: any) => 
      p.paymentId.toString() === paymentId
    );
    
    console.log('Found paymentIndex:', paymentIndex);
    
    if (paymentIndex === -1 || paymentIndex === undefined) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    
    // Calculate the final amount to deduct from user balance
    const payment = sellerData.paymentHistory[paymentIndex];
    const finalAmount = payment.amountReceived; // This is the net amount after commission

    // Update the specific payment status from 'requested' to 'paid' and deduct from userBalance
    const result = await db.collection('sellers').findOneAndUpdate(
      { 
        _id: new ObjectId(sellerId),
        'paymentHistory.paymentId': sellerData.paymentHistory[paymentIndex].paymentId
      },
      { 
        $set: { 
          [`paymentHistory.${paymentIndex}.payoutStatus`]: 'paid',
          updatedAt: new Date()
        },
        $inc: { 
          userBalance: -finalAmount // Deduct the final amount from user balance
        }
      },
      { returnDocument: 'after' }
    );

    console.log('Update result:', result);

    if (!result?.value) {
      return NextResponse.json({ error: 'Payment not found or already updated' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Payout status updated to paid and balance deducted',
      updatedPayment: result.value.paymentHistory[paymentIndex],
      previousBalance: result.value.userBalance + finalAmount,
      newBalance: result.value.userBalance,
      deductedAmount: finalAmount
    });

  } catch (error) {
    console.error('Error updating payout status:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        error: 'Failed to update payout status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

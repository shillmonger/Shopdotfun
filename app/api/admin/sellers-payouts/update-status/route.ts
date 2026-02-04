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

    // First get the seller to find the payment amount for balance calculation
    const sellerData = await db.collection('sellers').findOne({ 
      _id: new ObjectId(sellerId) 
    });
    
    if (!sellerData) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    // Find the payment to get the amount for balance deduction
    const payment = sellerData.paymentHistory?.find((p: any) => 
      p.paymentId.toString() === paymentId && p.payoutStatus === 'requested'
    );
    
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found or not in requested status' }, { status: 404 });
    }
    
    const finalAmount = payment.amountReceived; // This is the net amount after commission

    // Update the specific payment status from 'requested' to 'paid' and deduct from userBalance
    const result = await db.collection('sellers').updateOne(
      {
        _id: new ObjectId(sellerId),
        "paymentHistory.paymentId": new ObjectId(paymentId),
        "paymentHistory.payoutStatus": "requested"
      },
      {
        $set: {
          "paymentHistory.$.payoutStatus": "paid",
          updatedAt: new Date()
        },
        $inc: { 
          userBalance: -finalAmount // Deduct the final amount from user balance
        }
      }
    );

    console.log('Update result:', result);

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Payment not found or already updated' }, { status: 404 });
    }

    // Get the updated seller data for response
    const updatedSeller = await db.collection('sellers').findOne({
      _id: new ObjectId(sellerId)
    });

    const updatedPayment = updatedSeller?.paymentHistory?.find((p: any) => 
      p.paymentId.toString() === paymentId
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Payout status updated to paid and balance deducted',
      updatedPayment,
      previousBalance: updatedSeller!.userBalance + finalAmount,
      newBalance: updatedSeller!.userBalance,
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

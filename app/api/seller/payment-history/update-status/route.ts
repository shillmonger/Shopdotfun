import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserModel from '@/models/User';
import { ObjectId } from 'mongodb';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    console.log('Received paymentId:', paymentId, 'Type:', typeof paymentId);

    const seller = await UserModel.findUserByEmail(session.user.email, 'seller');
    
    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    // Update the specific payment history item status from 'pending' to 'requested'
    const client = await (await import('@/lib/db')).clientPromise;
    const db = client.db('shop_dot_fun');
    
    // Update the specific payment status using MongoDB's positional operator
    const result = await db.collection('sellers').updateOne(
      {
        email: session.user.email,
        "paymentHistory.paymentId": new ObjectId(paymentId),
        "paymentHistory.payoutStatus": "pending"
      },
      {
        $set: {
          "paymentHistory.$.payoutStatus": "requested",
          updatedAt: new Date()
        }
      }
    );

    console.log('Update result:', result);

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Payment not found or already updated' }, { status: 404 });
    }

    // Get the updated payment details for the response
    const updatedSeller = await db.collection('sellers').findOne({
      email: session.user.email,
      "paymentHistory.paymentId": new ObjectId(paymentId)
    });

    const updatedPayment = updatedSeller?.paymentHistory?.find((p: any) => 
      p.paymentId.toString() === paymentId
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Payout status updated to requested',
      updatedPayment
    });

  } catch (error) {
    console.error('Error updating payout status:', error);
    return NextResponse.json(
      { error: 'Failed to update payout status' },
      { status: 500 }
    );
  }
}

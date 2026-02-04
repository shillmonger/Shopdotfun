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
    
    // First find the seller to get the payment history
    const sellerData = await db.collection('sellers').findOne({ email: session.user.email });
    
    if (!sellerData) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }
    
    console.log('Seller paymentHistory count:', sellerData.paymentHistory?.length || 0);
    console.log('PaymentHistory IDs:', sellerData.paymentHistory?.map((p: any) => p.paymentId.toString()) || []);
    
    // Find the payment in the paymentHistory array
    const paymentIndex = sellerData.paymentHistory?.findIndex((p: any) => 
      p.paymentId.toString() === paymentId
    );
    
    console.log('Found paymentIndex:', paymentIndex);
    
    if (paymentIndex === -1 || paymentIndex === undefined) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    
    // Update the specific payment status using the actual ObjectId from the database
    const result = await db.collection('sellers').findOneAndUpdate(
      { 
        email: session.user.email,
        'paymentHistory.paymentId': sellerData.paymentHistory[paymentIndex].paymentId
      },
      { 
        $set: { 
          [`paymentHistory.${paymentIndex}.payoutStatus`]: 'requested',
          updatedAt: new Date()
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
      message: 'Payout status updated to requested',
      updatedPayment: result.value.paymentHistory[paymentIndex]
    });

  } catch (error) {
    console.error('Error updating payout status:', error);
    return NextResponse.json(
      { error: 'Failed to update payout status' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clientPromise } from '@/lib/db';
import { ObjectId } from 'mongodb';
import UserModel from '@/models/User';

// GET - Fetch all payments for admin approval
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query
    const query: any = {};
    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    const skip = (page - 1) * limit;

    const payments = await db.collection('buyerPayments')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('buyerPayments').countDocuments(query);

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update payment status (approve/reject)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { paymentId, status } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'Payment ID and status are required' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be approved or rejected' },
        { status: 400 }
      );
    }

    // Get the payment details
    const payment = await db.collection('buyerPayments').findOne({
      _id: new ObjectId(paymentId)
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status
    const updatedPayment = await db.collection('buyerPayments').findOneAndUpdate(
      { _id: new ObjectId(paymentId) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    // If approved, update buyer's payment history and balance
    if (status === 'approved') {
      const buyerEmail = payment.buyerInfo.email;
      const amountToPay = payment.buyerInfo.amountToPay;
      const cryptoAmount = payment.cryptoAmount;

      // Add to buyer's payment history using UserModel
      await UserModel.addPaymentHistory(buyerEmail, {
        paymentId: new ObjectId(paymentId),
        amountPaid: amountToPay,
        cryptoAmount: cryptoAmount,
        cryptoMethod: payment.buyerInfo.cryptoMethodUsed,
        orderTotal: payment.buyerInfo.orderTotal
      });

      // Update user balance by adding the amountPaid
      await UserModel.updateUserBalance(buyerEmail, amountToPay);
    }

    return NextResponse.json({
      message: `Payment ${status} successfully`,
      payment: updatedPayment
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

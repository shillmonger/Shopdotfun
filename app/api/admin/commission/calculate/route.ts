import { NextRequest, NextResponse } from 'next/server';
import CommissionModel from '@/models/Commission';

// POST calculate commission for a given amount
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    const result = await CommissionModel.calculateCommission(amount);
    
    return NextResponse.json({
      amount,
      fee: result.fee,
      earnings: Math.max(0, amount - result.fee),
      tier: result.tier
    });
  } catch (error) {
    console.error('Error calculating commission:', error);
    return NextResponse.json(
      { error: 'Failed to calculate commission' },
      { status: 500 }
    );
  }
}

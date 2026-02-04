import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import CommissionService, { CommissionSettings } from '@/lib/commission';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const commissionSettings = await CommissionService.getCommissionSettings();
    
    if (!commissionSettings) {
      return NextResponse.json({ error: 'Commission settings not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      commissionSettings 
    });

  } catch (error) {
    console.error('Error fetching commission settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commission settings' },
      { status: 500 }
    );
  }
}

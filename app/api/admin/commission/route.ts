import { NextRequest, NextResponse } from 'next/server';
import CommissionModel, { CommissionSettings } from '@/models/Commission';

// GET commission settings
export async function GET() {
  try {
    const settings = await CommissionModel.getCommissionSettings();
    
    if (!settings) {
      return NextResponse.json(
        { error: 'No commission settings found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching commission settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commission settings' },
      { status: 500 }
    );
  }
}

// POST/PUT commission settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tiers } = body;

    if (!tiers || !Array.isArray(tiers)) {
      return NextResponse.json(
        { error: 'Tiers array is required' },
        { status: 400 }
      );
    }

    // Validate tiers
    for (const tier of tiers) {
      if (
        typeof tier.min !== 'number' ||
        tier.min < 0 ||
        typeof tier.value !== 'number' ||
        tier.value < 0 ||
        !['percent', 'flat'].includes(tier.type) ||
        (tier.max !== null && typeof tier.max !== 'number')
      ) {
        return NextResponse.json(
          { error: 'Invalid tier data' },
          { status: 400 }
        );
      }
    }

    const settings = await CommissionModel.saveCommissionSettings(tiers);
    return NextResponse.json({ 
      message: 'Commission settings saved successfully',
      settings 
    });
  } catch (error) {
    console.error('Error saving commission settings:', error);
    return NextResponse.json(
      { error: 'Failed to save commission settings' },
      { status: 500 }
    );
  }
}

// PUT commission settings (alias for POST)
export async function PUT(request: NextRequest) {
  return POST(request);
}

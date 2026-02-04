import { clientPromise } from '@/lib/db';

export interface CommissionTier {
  id: string;
  min: number;
  max: number | null;
  type: 'percent' | 'flat';
  value: number;
}

export interface CommissionSettings {
  _id: string;
  tiers: CommissionTier[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommissionCalculation {
  tier: CommissionTier;
  commissionAmount: number;
  settlementAmount: number;
  originalAmount: number;
}

export class CommissionService {
  private static readonly DB_NAME = 'shop_dot_fun';

  static async getCommissionSettings(): Promise<CommissionSettings | null> {
    try {
      const client = await clientPromise;
      const db = client.db(this.DB_NAME);
      
      const settings = await db.collection('commissionSettings').findOne({});
      return settings as CommissionSettings | null;
    } catch (error) {
      console.error('Error fetching commission settings:', error);
      throw error;
    }
  }

  static calculateCommission(amount: number, tiers: CommissionTier[]): CommissionCalculation {
    // Find the applicable tier
    const applicableTier = tiers.find(tier => {
      if (tier.max === null) {
        return amount >= tier.min;
      }
      return amount >= tier.min && amount < tier.max;
    });

    if (!applicableTier) {
      // Default to no commission if no tier found
      return {
        tier: {
          id: 'default',
          min: 0,
          max: null,
          type: 'percent',
          value: 0
        },
        commissionAmount: 0,
        settlementAmount: amount,
        originalAmount: amount
      };
    }

    let commissionAmount = 0;
    
    if (applicableTier.type === 'percent') {
      commissionAmount = (amount * applicableTier.value) / 100;
    } else {
      commissionAmount = applicableTier.value;
    }

    const settlementAmount = amount - commissionAmount;

    return {
      tier: applicableTier,
      commissionAmount,
      settlementAmount,
      originalAmount: amount
    };
  }

  static async calculateCommissionForAmount(amount: number): Promise<CommissionCalculation> {
    const settings = await this.getCommissionSettings();
    
    if (!settings || !settings.tiers.length) {
      throw new Error('Commission settings not found');
    }

    return this.calculateCommission(amount, settings.tiers);
  }
}

export default CommissionService;

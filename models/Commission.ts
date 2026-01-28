import { clientPromise } from '@/lib/db';
import { ObjectId } from 'mongodb';

export interface CommissionTier {
  id: string;
  min: number;
  max: number | null;
  type: "percent" | "flat";
  value: number;
}

export interface CommissionSettings {
  _id?: ObjectId;
  tiers: CommissionTier[];
  createdAt: Date;
  updatedAt: Date;
}

const dbName = 'shop_dot_fun';

class CommissionModel {
  static async saveCommissionSettings(tiers: CommissionTier[]): Promise<CommissionSettings> {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection<CommissionSettings>('commissionSettings');
    
    const now = new Date();
    const settings: CommissionSettings = {
      tiers,
      createdAt: now,
      updatedAt: now,
    };

    // Remove existing settings (we only want one active configuration)
    await collection.deleteMany({});
    
    // Insert new settings
    const result = await collection.insertOne(settings);
    return { ...settings, _id: result.insertedId };
  }

  static async getCommissionSettings(): Promise<CommissionSettings | null> {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection<CommissionSettings>('commissionSettings');
    
    // Get the most recent settings (should only be one document)
    const settings = await collection.findOne({}, { sort: { updatedAt: -1 } });
    return settings;
  }

  static async calculateCommission(amount: number): Promise<{ fee: number; tier: CommissionTier | null }> {
    const settings = await this.getCommissionSettings();
    
    if (!settings || !settings.tiers.length) {
      return { fee: 0, tier: null };
    }

    // Find the matching tier
    const activeTier = settings.tiers.find(
      (t) => amount >= t.min && (t.max === null || amount < t.max),
    );

    if (!activeTier) {
      return { fee: 0, tier: null };
    }

    const fee = activeTier.type === "percent"
      ? (amount * activeTier.value) / 100
      : activeTier.value;

    return { fee, tier: activeTier };
  }
}

export default CommissionModel;

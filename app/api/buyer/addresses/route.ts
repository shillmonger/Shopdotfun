import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/db';
import { ObjectId, UpdateFilter, Document } from 'mongodb';
import { authOptions } from '@/lib/auth';
import { Address } from '@/models/User';

const dbName = 'shpdotfun';

interface UserAddress extends Omit<Address, 'createdAt' | 'updatedAt'> {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
}

interface UserDocument extends Document {
  email: string;
  addresses: UserAddress[];
  updatedAt: Date;
}

interface AddressInput
  extends Omit<Address, 'createdAt' | 'updatedAt' | 'isDefault'> {}

interface UpdateAddressInput
  extends Partial<Omit<Address, 'createdAt' | 'updatedAt' | 'isDefault'>> {
  addressId: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const user = await db
      .collection<UserDocument>('buyer-users')
      .findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ addresses: user.addresses || [] });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressData: AddressInput = await request.json();
    const now = new Date();

    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection<UserDocument>('buyer-users');

    const user = await collection.findOne({ email: session.user.email });

    const addressToAdd: UserAddress = {
      ...addressData,
      _id: new ObjectId(),
      isDefault: !user?.addresses?.length, // first address becomes default
      createdAt: now,
      updatedAt: now,
    };

    const update: UpdateFilter<UserDocument> = {
      $set: { updatedAt: now },
      $push: { addresses: addressToAdd },
    };

    await collection.updateOne(
      { email: session.user.email },
      update,
    );

    return NextResponse.json(
      {
        message: 'Address added successfully',
        address: addressToAdd,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { addressId, ...updateData }: UpdateAddressInput =
      await request.json();

    if (!addressId) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const now = new Date();

    const update: UpdateFilter<UserDocument> = {
      $set: {
        'addresses.$.updatedAt': now,
        'addresses.$.fullName': updateData.fullName,
        'addresses.$.phone': updateData.phone,
        'addresses.$.street': updateData.street,
        'addresses.$.city': updateData.city,
        'addresses.$.state': updateData.state,
        'addresses.$.country': updateData.country,
        updatedAt: now,
      },
    };

    const result = await db.collection<UserDocument>('buyer-users').updateOne(
      {
        email: session.user.email,
        'addresses._id': new ObjectId(addressId),
      },
      update,
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Address not found or not owned by user' },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: 'Address updated successfully' });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { addressId } = await request.json();

    if (!addressId) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection<UserDocument>('buyer-users');
    const now = new Date();

    // Check if the address we're deleting is the default one
    const userBefore = await collection.findOne({
      email: session.user.email,
      'addresses._id': new ObjectId(addressId),
    });

    if (!userBefore) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 },
      );
    }

    const isDeletingDefault = userBefore.addresses.some(
      (addr) => addr._id.toString() === addressId && addr.isDefault,
    );

    // 1. Remove the address
    await collection.updateOne(
      { email: session.user.email },
      {
        $pull: { addresses: { _id: new ObjectId(addressId) } },
        $set: { updatedAt: now },
      },
    );

    // 2. If we deleted the default → make the first remaining one default
    if (isDeletingDefault) {
      const userAfter = await collection.findOne({
        email: session.user.email,
      });

      if (userAfter && userAfter.addresses.length > 0) {
        await collection.updateOne(
          {
            email: session.user.email,
            'addresses._id': userAfter.addresses[0]._id,
          },
          {
            $set: {
              'addresses.$.isDefault': true,
              'addresses.$.updatedAt': now,
            },
          },
        );
      }
    }

    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
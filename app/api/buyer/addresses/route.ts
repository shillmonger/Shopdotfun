import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/db';
import { ObjectId, type UpdateFilter, type Document } from 'mongodb';
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const user = await db.collection<UserDocument>('buyer-users').findOne({ email: session.user.email });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return NextResponse.json({ addresses: user.addresses || [] });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const addressData: Omit<Address, 'createdAt' | 'updatedAt' | 'isDefault'> = await request.json();
    const now = new Date();
    
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection<UserDocument>('buyer-users');

    // First, get the user to check if we need to set this as default
    const user = await collection.findOne({ email: session.user.email });
    
    // Create the new address object
    const addressToAdd: UserAddress = {
      ...addressData,
      _id: new ObjectId(),
      isDefault: !user?.addresses?.length, // true if first address, false otherwise
      createdAt: now,
      updatedAt: now
    };
    
    // FIX: Using 'as any' to bypass the nested $push type compatibility error
    const updateOperation = {
      $set: { updatedAt: now },
      $push: {
        addresses: {
          $each: [addressToAdd]
        }
      }
    } as any as UpdateFilter<UserDocument>;
    
    await collection.updateOne(
      { email: session.user.email },
      updateOperation
    );

    return NextResponse.json({ 
      message: 'Address added successfully', 
      address: addressToAdd 
    });
  } catch (error) {
    console.error('Error adding address:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { addressId, ...updateData } = await request.json();
    
    if (!addressId) {
      return new NextResponse(JSON.stringify({ error: 'Address ID is required' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const now = new Date();

    const result = await db.collection<UserDocument>('buyer-users').updateOne(
      { 
        email: session.user.email,
        'addresses._id': new ObjectId(addressId)
      },
      {
        $set: {
          'addresses.$.updatedAt': now,
          'addresses.$.fullName': updateData.fullName,
          'addresses.$.phone': updateData.phone,
          'addresses.$.street': updateData.street,
          'addresses.$.city': updateData.city,
          'addresses.$.state': updateData.state,
          'addresses.$.country': updateData.country,
          updatedAt: now
        }
      }
    );

    if (result.matchedCount === 0) {
      return new NextResponse(JSON.stringify({ error: 'Address not found' }), { status: 404 });
    }

    return NextResponse.json({ message: 'Address updated successfully' });
  } catch (error) {
    console.error('Error updating address:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { addressId } = await request.json();
    
    if (!addressId) {
      return new NextResponse(JSON.stringify({ error: 'Address ID is required' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection<UserDocument>('buyer-users');
    const now = new Date();

    // Find the user and check if the address being deleted is the default one
    const user = await collection.findOne({
      email: session.user.email,
      addresses: {
        $elemMatch: {
          _id: new ObjectId(addressId),
          isDefault: true
        }
      }
    });

    // Remove the address
    await collection.updateOne(
      { email: session.user.email },
      {
        $pull: { addresses: { _id: new ObjectId(addressId) } } as any,
        $set: { updatedAt: now }
      }
    );

    // If we deleted the default address, nominate a new one
    if (user) {
      const updatedUser = await collection.findOne({ email: session.user.email });
      
      if (updatedUser && updatedUser.addresses && updatedUser.addresses.length > 0) {
        await collection.updateOne(
          { 
            email: session.user.email,
            'addresses._id': updatedUser.addresses[0]._id
          },
          {
            $set: {
              'addresses.$.isDefault': true,
              'addresses.$.updatedAt': now
            }
          }
        );
      }
    }

    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
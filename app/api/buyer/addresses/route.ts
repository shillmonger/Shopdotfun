import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/lib/auth';
import { Address } from '@/models/User';

const dbName = 'shpdotfun';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const user = await db.collection('buyer-users').findOne({ email: session.user.email });

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
    
    const newAddress: Address = {
      ...addressData,
      isDefault: false, // New addresses are not default by default
      createdAt: now,
      updatedAt: now
    };

    const client = await clientPromise;
    const db = client.db(dbName);

    // First, get the user to check if we need to set this as default
    const user = await db.collection('buyer-users').findOne({ email: session.user.email });
    
    // Prepare the update operation
    const updateOperation: any = {
      $push: {},
      $set: { updatedAt: now }
    };
    
    // If this is the first address, make it default
    if (!user?.addresses || user.addresses.length === 0) {
      newAddress.isDefault = true;
    }
    
    // Add the new address with a new ObjectId
    updateOperation.$push = {
      addresses: {
        _id: new ObjectId(),
        ...newAddress,
        createdAt: now,
        updatedAt: now
      }
    };
    
    await db.collection('buyer-users').updateOne(
      { email: session.user.email },
      updateOperation
    );

    return NextResponse.json({ message: 'Address added successfully', address: newAddress });
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

    // Update the specific address
    const result = await db.collection('buyer-users').updateOne(
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
    const now = new Date();

    // First check if the address is default
    const user = await db.collection('buyer-users').findOne({
      email: session.user.email,
      addresses: {
        $elemMatch: {
          _id: new ObjectId(addressId),
          isDefault: true
        }
      }
    });

    // First, remove the address using a two-step process to avoid type issues
    await db.collection('buyer-users').updateOne(
      { email: session.user.email },
      [
        {
          $set: {
            addresses: {
              $filter: {
                input: '$addresses',
                as: 'address',
                cond: { $ne: ['$$address._id', new ObjectId(addressId)] }
              }
            },
            updatedAt: now
          }
        }
      ]
    );

    // If the deleted address was default, set another address as default if available
    if (user) {
      const updatedUser = await db.collection('buyer-users').findOne({ 
        email: session.user.email,
        addresses: { $exists: true, $not: { $size: 0 } }
      });
      
      if (updatedUser && updatedUser.addresses && updatedUser.addresses.length > 0) {
        await db.collection('buyer-users').updateOne(
          { 
            email: session.user.email,
            'addresses._id': new ObjectId(updatedUser.addresses[0]._id)
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
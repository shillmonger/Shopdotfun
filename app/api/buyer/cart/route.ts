import { NextRequest, NextResponse } from 'next/server';
import { Cart } from '@/models/Cart';
import UserModel from '@/models/User';
import { clientPromise } from '@/lib/db';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper function to get buyer email from NextAuth session
async function getBuyerEmail(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Session data:', JSON.stringify(session, null, 2));
    
    if (!session?.user?.email) {
      console.log('No session or email found');
      return null;
    }

    // Check if user has buyer role
    if (!session.user.roles?.includes('buyer')) {
      console.log('User does not have buyer role. Roles:', session.user.roles);
      return null;
    }

    console.log('Buyer email found:', session.user.email);
    return session.user.email;
  } catch (error) {
    console.error('Error getting buyer email from session:', error);
    return null;
  }
}

// GET /api/buyer/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    
    const buyerEmail = await getBuyerEmail();
    
    if (!buyerEmail) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify user exists in buyers collection
    const user = await UserModel.findUserByEmail(buyerEmail, 'buyer');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const cart = await Cart.findOne({ buyerEmail });
    
    if (!cart) {
      return NextResponse.json({ items: [], totalAmount: 0 });
    }

    return NextResponse.json({
      items: cart.items,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/buyer/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    
    const body = await request.json();
    const {
      productId,
      productName,
      sellerName,
      price,
      discount,
      stock,
      shippingFee,
      image,
      quantity = 1
    } = body;

    const buyerEmail = await getBuyerEmail();
    
    if (!buyerEmail) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify user exists in buyers collection
    const user = await UserModel.findUserByEmail(buyerEmail, 'buyer');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!productId || !productName || !sellerName || !price || !stock || !image || shippingFee === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find existing cart or create new one
    let cart = await Cart.findOne({ buyerEmail });
    
    if (!cart) {
      cart = new Cart({
        buyerEmail,
        items: [],
        totalAmount: 0
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId === productId
    );

    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      const existingItem = cart.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > stock) {
        return NextResponse.json(
          { error: 'Not enough stock available' },
          { status: 400 }
        );
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      if (quantity > stock) {
        return NextResponse.json(
          { error: 'Not enough stock available' },
          { status: 400 }
        );
      }

      cart.items.push({
        productId,
        productName,
        sellerName,
        price,
        discount,
        quantity,
        stock,
        shippingFee,
        image,
        addedAt: new Date()
      });
    }

    await cart.save();

    return NextResponse.json({
      message: 'Item added to cart successfully',
      items: cart.items,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// PUT /api/buyer/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    
    const body = await request.json();
    const { productId, quantity } = body;

    const buyerEmail = await getBuyerEmail();
    
    if (!buyerEmail) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify user exists in buyers collection
    const user = await UserModel.findUserByEmail(buyerEmail, 'buyer');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ buyerEmail });
    
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity > cart.items[itemIndex].stock) {
      return NextResponse.json(
        { error: 'Not enough stock available' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    return NextResponse.json({
      message: 'Cart updated successfully',
      items: cart.items,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/buyer/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const buyerEmail = await getBuyerEmail();
    
    if (!buyerEmail) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify user exists in buyers collection
    const user = await UserModel.findUserByEmail(buyerEmail, 'buyer');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ buyerEmail });
    
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    return NextResponse.json({
      message: 'Item removed from cart successfully',
      items: cart.items,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}

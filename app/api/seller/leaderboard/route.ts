import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clientPromise } from '@/lib/db';
import { ObjectId } from 'mongodb';

interface SellerLeaderboardEntry {
  id: string;
  name: string;
  businessName: string;
  country: string;
  totalSales: number;
  totalProducts: number;
  totalSalesPercent: number;
  totalProductsPercent: number;
  rank: number;
  joined: string;
  profileImage: string;
  email: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('shop_dot_fun');

    // Get all sellers with status "Active"
    const sellers = await db.collection('sellers')
      .find({ 
        status: 'Active',
        roles: { $in: ['seller'] }
      })
      .project({
        _id: 1,
        name: 1,
        email: 1,
        businessName: 1,
        country: 1,
        profileImage: 1,
        createdAt: 1
      })
      .toArray();

    if (!sellers || sellers.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Get total sales for each seller from paid orders
    const sellerEmails = sellers.map(seller => seller.email);
    
    const paidOrders = await db.collection('orders')
      .find({
        'sellerInfo.sellerEmail': { $in: sellerEmails },
        'status.payment': 'paid'
      })
      .project({
        'sellerInfo.sellerEmail': 1,
        'productInfo.price': 1
      })
      .toArray();

    // Calculate total sales per seller
    const salesBySeller: Record<string, number> = {};
    paidOrders.forEach(order => {
      const sellerEmail = order.sellerInfo?.sellerEmail;
      const price = order.productInfo?.price || 0;
      
      if (sellerEmail) {
        salesBySeller[sellerEmail] = (salesBySeller[sellerEmail] || 0) + price;
      }
    });

    // Get total products count for each seller
    const products = await db.collection('products')
      .find({
        sellerEmail: { $in: sellerEmails },
        status: 'approved'
      })
      .project({
        sellerEmail: 1
      })
      .toArray();

    const productsBySeller: Record<string, number> = {};
    products.forEach(product => {
      const sellerEmail = product.sellerEmail;
      if (sellerEmail) {
        productsBySeller[sellerEmail] = (productsBySeller[sellerEmail] || 0) + 1;
      }
    });

    // Calculate totals for percentage calculations
    const totalProductsAll = Object.values(productsBySeller).reduce((sum, count) => sum + count, 0);
    const totalSalesAll = Object.values(salesBySeller).reduce((sum, sales) => sum + sales, 0);

    // Build leaderboard entries
    const leaderboardEntries: SellerLeaderboardEntry[] = sellers.map(seller => {
      const totalSales = salesBySeller[seller.email] || 0;
      const totalProducts = productsBySeller[seller.email] || 0;
      
      // Calculate percentages
      const totalSalesPercent = totalSalesAll > 0 ? (totalSales / totalSalesAll) * 100 : 0;
      const totalProductsPercent = totalProductsAll > 0 ? (totalProducts / totalProductsAll) * 100 : 0;
      
      // Format joined date
      const joinedDate = new Date(seller.createdAt);
      const joined = joinedDate.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });

      // Use profile image or fallback
      const profileImage = seller.profileImage || 'https://github.com/shadcn.png';

      return {
        id: seller._id.toString(),
        name: seller.name,
        businessName: seller.businessName || 'No Business Name',
        country: seller.country || 'Unknown',
        totalSales,
        totalProducts,
        totalSalesPercent: Math.round(totalSalesPercent * 10) / 10, // Round to 1 decimal
        totalProductsPercent: Math.round(totalProductsPercent * 10) / 10, // Round to 1 decimal
        rank: 0, // Will be set after sorting
        joined,
        profileImage,
        email: seller.email
      };
    });

    // Sort by total products (descending), then by total sales (descending) and assign ranks
    leaderboardEntries.sort((a, b) => {
      if (b.totalProducts !== a.totalProducts) {
        return b.totalProducts - a.totalProducts; // Primary: Total Products
      }
      return b.totalSales - a.totalSales; // Secondary: Total Sales
    });
    
    leaderboardEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return NextResponse.json({
      success: true,
      data: leaderboardEntries
    });

  } catch (error) {
    console.error('Error fetching seller leaderboard:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch leaderboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

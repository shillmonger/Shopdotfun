import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OrderModel from '@/models/Order';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30';

    // Calculate date range based on timeRange
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90':
        startDate.setDate(now.getDate() - 90);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Fetch orders for the current seller within the time range
    const orders = await OrderModel.find({
      'sellerInfo.sellerEmail': session.user.email,
      'createdAt': { $gte: startDate }
    });

    // Calculate basic statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      // Only include paid orders in revenue
      if (order.status.payment === 'paid' && order.status.adminAction !== 'refunded') {
        return sum + (order.paymentInfo.amount || 0);
      }
      return sum;
    }, 0);

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate previous period for comparison
    const periodLength = now.getTime() - startDate.getTime();
    const previousStartDate = new Date(startDate.getTime() - periodLength);
    const previousEndDate = startDate;

    const previousOrders = await OrderModel.find({
      'sellerInfo.sellerEmail': session.user.email,
      'createdAt': { 
        $gte: previousStartDate,
        $lt: previousEndDate
      }
    });

    const previousRevenue = previousOrders.reduce((sum, order) => {
      if (order.status.payment === 'paid' && order.status.adminAction !== 'refunded') {
        return sum + (order.paymentInfo.amount || 0);
      }
      return sum;
    }, 0);

    const previousOrderCount = previousOrders.length;

    // Calculate trends
    const revenueTrend = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
      : '0.0';
    
    const ordersTrend = previousOrderCount > 0
      ? ((totalOrders - previousOrderCount) / previousOrderCount * 100).toFixed(1)
      : '0.0';

    // Calculate order status breakdown
    const statusBreakdown = {
      pending: orders.filter(o => o.status.shipping === 'pending').length,
      shipped: orders.filter(o => o.status.shipping === 'shipped').length,
      received: orders.filter(o => o.status.shipping === 'received').length,
      refunded: orders.filter(o => o.status.adminAction === 'refunded').length,
    };

    // Calculate top performing products
    const productSales = new Map();
    orders.forEach(order => {
      if (order.status.payment === 'paid' && order.status.adminAction !== 'refunded') {
        const productName = order.productInfo.name;
        const productCode = order.productInfo.productCode;
        const revenue = order.paymentInfo.amount || 0;
        const quantity = order.productInfo.quantity || 1;
        
        if (productSales.has(productName)) {
          const existing = productSales.get(productName);
          existing.sales += quantity;
          existing.revenue += revenue;
        } else {
          productSales.set(productName, {
            name: productName,
            productCode,
            sales: quantity,
            revenue: revenue
          });
        }
      }
    });

    // Sort products by revenue and get top 4
    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)
      .map(product => ({
        ...product,
        revenue: `$${product.revenue.toFixed(2)}`,
        growth: Math.floor(Math.random() * 30) - 10 // Mock growth for now
      }));

    // Monthly revenue data for chart (last 12 months)
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= monthDate && orderDate < nextMonthDate;
      });

      const monthRevenue = monthOrders.reduce((sum, order) => {
        if (order.status.payment === 'paid' && order.status.adminAction !== 'refunded') {
          return sum + (order.paymentInfo.amount || 0);
        }
        return sum;
      }, 0);

      monthlyData.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthRevenue,
        orders: monthOrders.length
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: [
          {
            label: "Total Revenue",
            value: `$${totalRevenue.toFixed(2)}`,
            trend: `${parseFloat(revenueTrend) >= 0 ? '+' : ''}${revenueTrend}%`,
            isUp: parseFloat(revenueTrend) >= 0
          },
          {
            label: "Total Orders",
            value: totalOrders.toString(),
            trend: `${parseFloat(ordersTrend) >= 0 ? '+' : ''}${ordersTrend}%`,
            isUp: parseFloat(ordersTrend) >= 0
          },
          {
            label: "Avg. Order Value",
            value: `$${avgOrderValue.toFixed(2)}`,
            trend: "-2.1%", // Mock trend for now
            isUp: false
          },
          {
            label: "Conversion Rate",
            value: "3.2%", // Mock conversion rate
            trend: "+0.4%",
            isUp: true
          }
        ],
        bestSellers: topProducts.length > 0 ? topProducts : [
          { name: "No sales yet", sales: 0, revenue: "$0.00", growth: 0 }
        ],
        monthlyData,
        statusBreakdown,
        totalRefunded: orders.filter(o => o.status.adminAction === 'refunded').length,
        totalRefundedAmount: orders
          .filter(o => o.status.adminAction === 'refunded')
          .reduce((sum, order) => sum + (order.paymentInfo.amount || 0), 0)
      }
    });

  } catch (error) {
    console.error('Error fetching seller analytics:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

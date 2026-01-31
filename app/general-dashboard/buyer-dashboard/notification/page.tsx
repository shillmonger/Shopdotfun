"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Package, 
  ArrowRight, 
  Inbox,
  TrendingUp,
  ShieldAlert,
  Lightbulb,
  Zap,
  ChevronRight,
  Calendar,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Info,
  Clock,
  AlertTriangle,
  CreditCard,
  Truck,
  Eye,
  DollarSign
} from "lucide-react";
import Link from "next/link";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";
import { useAuth } from "@/hooks/useAuth";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order_received" | "order_delayed" | "order_damaged" | "payment_made" | "payment_pending" | "payment_approved" | "payment_rejected" | "seller_paid";
  status: string;
  date: string;
  isRead: boolean;
  relatedOrderId?: string;
  relatedPaymentId?: string;
  amount?: number;
  productName?: string;
}

interface Order {
  _id: string;
  orderId: string;
  productInfo: {
    name: string;
    price: number;
    images: any[];
  };
  status: {
    shipping: string;
    payment: string;
    buyerAction: string;
    adminAction: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Buyer {
  _id: string;
  email: string;
  paymentHistory: Array<{
    paymentId: any;
    amountPaid: number;
    cryptoMethod: string;
    orderTotal: number;
    approvedAt: string;
  }>;
}

interface BuyerPayment {
  _id: string;
  status: string;
  productsInfo: Array<{
    name: string;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch('/api/buyer/orders');
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  const result = await response.json();
  return result.orders || [];
};

const fetchBuyerData = async (): Promise<Buyer> => {
  const response = await fetch('/api/buyer/profile');
  if (!response.ok) {
    throw new Error('Failed to fetch buyer data');
  }
  const result = await response.json();
  return result;
};

const fetchBuyerPayments = async (): Promise<BuyerPayment[]> => {
  const response = await fetch('/api/buyer/payments');
  if (!response.ok) {
    throw new Error('Failed to fetch buyer payments');
  }
  const result = await response.json();
  return result.payments || [];
};

const convertOrderToNotification = (order: Order): Notification[] => {
  const notifications: Notification[] = [];
  const date = new Date(order.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Order status notifications
  if (order.status.shipping === 'received') {
    notifications.push({
      id: `order-${order._id}-received`,
      title: 'Order Received',
      message: `Your order "${order.productInfo.name}" has been received and is being processed.`,
      type: 'order_received',
      status: 'received',
      date,
      isRead: false,
      relatedOrderId: order.orderId,
      productName: order.productInfo.name
    });
  }

  if (order.status.shipping === 'delayed') {
    notifications.push({
      id: `order-${order._id}-delayed`,
      title: 'Order Delayed',
      message: `Your order "${order.productInfo.name}" has been delayed. We apologize for the inconvenience.`,
      type: 'order_delayed',
      status: 'delayed',
      date,
      isRead: false,
      relatedOrderId: order.orderId,
      productName: order.productInfo.name
    });
  }

  if (order.status.shipping === 'damaged') {
    notifications.push({
      id: `order-${order._id}-damaged`,
      title: 'Order Damaged',
      message: `Your order "${order.productInfo.name}" was damaged during shipping. We're working on a solution.`,
      type: 'order_damaged',
      status: 'damaged',
      date,
      isRead: false,
      relatedOrderId: order.orderId,
      productName: order.productInfo.name
    });
  }

  return notifications;
};

const convertPaymentHistoryToNotification = (buyer: Buyer): Notification[] => {
  const notifications: Notification[] = [];

  buyer.paymentHistory?.forEach((payment, index) => {
    const date = new Date(payment.approvedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    notifications.push({
      id: `payment-history-${payment.paymentId}`,
      title: 'Payment Completed',
      message: `You have successfully paid $${payment.amountPaid} for your order.`,
      type: 'payment_made',
      status: 'completed',
      date,
      isRead: false,
      relatedPaymentId: payment.paymentId?.$oid || payment.paymentId,
      amount: payment.amountPaid
    });
  });

  return notifications;
};

const convertBuyerPaymentToNotification = (payment: BuyerPayment): Notification[] => {
  const notifications: Notification[] = [];
  const date = new Date(payment.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const productNames = payment.productsInfo.map(p => p.name).join(', ');

  if (payment.status === 'pending') {
    notifications.push({
      id: `buyer-payment-${payment._id}-pending`,
      title: 'Payment Pending',
      message: `Your payment for "${productNames}" is pending confirmation.`,
      type: 'payment_pending',
      status: 'pending',
      date,
      isRead: false,
      relatedPaymentId: payment._id
    });
  }

  if (payment.status === 'approved') {
    notifications.push({
      id: `buyer-payment-${payment._id}-approved`,
      title: 'Payment Approved',
      message: `Your payment for "${productNames}" has been approved.`,
      type: 'payment_approved',
      status: 'approved',
      date,
      isRead: false,
      relatedPaymentId: payment._id
    });
  }

  if (payment.status === 'rejected') {
    notifications.push({
      id: `buyer-payment-${payment._id}-rejected`,
      title: 'Payment Rejected',
      message: `Your payment for "${productNames}" was rejected. Please try again.`,
      type: 'payment_rejected',
      status: 'rejected',
      date,
      isRead: false,
      relatedPaymentId: payment._id
    });
  }

  return notifications;
};

export default function BuyerNotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotificationsData = async () => {
      try {
        const [ordersData, buyerData, buyerPaymentsData] = await Promise.all([
          fetchOrders(),
          fetchBuyerData(),
          fetchBuyerPayments()
        ]);
        
        // Convert all data to notifications
        const orderNotifications = ordersData.flatMap(convertOrderToNotification);
        const paymentHistoryNotifications = convertPaymentHistoryToNotification(buyerData);
        const buyerPaymentNotifications = buyerPaymentsData.flatMap(convertBuyerPaymentToNotification);
        
        // Combine and sort all notifications by date (most recent first)
        const allNotifications = [...orderNotifications, ...paymentHistoryNotifications, ...buyerPaymentNotifications].sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
        
        setNotifications(allNotifications);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchNotificationsData();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Calculate notification statistics
  const orderReceivedCount = notifications.filter(n => n.type === "order_received").length;
  const paymentMadeCount = notifications.filter(n => n.type === "payment_made").length;
  const paymentPendingCount = notifications.filter(n => n.type === "payment_pending").length;
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalCount = notifications.length;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
                Notifi<span className="text-primary not-italic">cations</span>
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Buyer Status: <span className="text-green-500">Active</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* LEFT COLUMN: NOTIFICATIONS */}
              <div className="lg:col-span-8 space-y-4">
                {loading ? (
                  <div className="py-16 bg-card border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-10 h-10 mb-3 animate-spin opacity-50" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Loading notifications...</p>
                  </div>
                ) : error ? (
                  <div className="py-16 bg-card border-2 border-dashed border-red-500/30 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                    <AlertCircle className="w-10 h-10 mb-3 text-red-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Error loading notifications</p>
                    <p className="text-[9px] text-muted-foreground">{error}</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-16 bg-card border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                    <Inbox className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Zero notifications</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`group relative bg-card border transition-all duration-200 rounded-2xl p-5 md:p-6 cursor-pointer hover:border-primary/50 ${
                        notif.isRead 
                          ? "border-border opacity-75" 
                          : "border-primary/60 shadow-md"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="shrink-0">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${ 
                            notif.type === "order_received" 
                              ? "bg-blue-500/10 border-blue-500/30" 
                              : notif.type === "order_delayed"
                              ? "bg-orange-500/10 border-orange-500/30"
                              : notif.type === "order_damaged"
                              ? "bg-red-500/10 border-red-500/30"
                              : notif.type === "payment_made"
                              ? "bg-green-500/10 border-green-500/30"
                              : notif.type === "payment_pending"
                              ? "bg-yellow-500/10 border-yellow-500/30"
                              : notif.type === "payment_approved"
                              ? "bg-green-500/10 border-green-500/30"
                              : notif.type === "payment_rejected"
                              ? "bg-red-500/10 border-red-500/30"
                              : "bg-gray-500/10 border-gray-500/30"
                          }`}>
                            {notif.type === "order_received" ? (
                              <Package className="w-7 h-7 text-blue-500" />
                            ) : notif.type === "order_delayed" ? (
                              <Clock className="w-7 h-7 text-orange-500" />
                            ) : notif.type === "order_damaged" ? (
                              <AlertTriangle className="w-7 h-7 text-red-500" />
                            ) : notif.type === "payment_made" ? (
                              <DollarSign className="w-7 h-7 text-green-500" />
                            ) : notif.type === "payment_pending" ? (
                              <Clock className="w-7 h-7 text-yellow-500" />
                            ) : notif.type === "payment_approved" ? (
                              <CheckCircle2 className="w-7 h-7 text-green-500" />
                            ) : notif.type === "payment_rejected" ? (
                              <XCircle className="w-7 h-7 text-red-500" />
                            ) : (
                              <Info className="w-7 h-7 text-gray-500" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {notif.type === "order_received" ? (
                                <Package className="w-4 h-4 text-primary" />
                              ) : notif.type === "order_delayed" ? (
                                <Clock className="w-4 h-4 text-orange-500" />
                              ) : notif.type === "order_damaged" ? (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                              ) : notif.type === "payment_made" ? (
                                <DollarSign className="w-4 h-4 text-green-500" />
                              ) : notif.type === "payment_pending" ? (
                                <Clock className="w-4 h-4 text-yellow-500" />
                              ) : notif.type === "payment_approved" ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : notif.type === "payment_rejected" ? (
                                <XCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <Info className="w-4 h-4 text-primary" />
                              )}
                              <h3 className="text-base font-black uppercase italic tracking-tight">
                                {notif.title}
                              </h3>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                              {notif.date}
                            </span>
                          </div>

                          <div className="bg-muted/40 border-primary/60 p-3 rounded-lg">
                            <p className="text-[11px] font-medium leading-relaxed text-foreground/90">
                              {notif.message}
                            </p>
                            {notif.amount && (
                              <p className="text-[10px] font-bold text-green-600 mt-1">
                                Amount: ${notif.amount}
                              </p>
                            )}
                          </div>

                          {notif.relatedOrderId && (
                            <Link 
                              href={`/general-dashboard/buyer-dashboard/orders`}
                              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-primary hover:underline"
                            >
                              View Order <ChevronRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* RIGHT COLUMN: ANALYTICS & TIPS */}
              <div className="lg:col-span-4 space-y-5">
                
                {/* Status Card */}
                <div className={`p-6 rounded-[2.5rem] shadow-lg relative overflow-hidden ${
                  totalCount === 0 
                    ? "bg-muted border border-border"
                    : unreadCount > 0
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                }`}>
                  <TrendingUp className={`absolute -right-6 -bottom-6 w-28 h-28 ${
                    totalCount === 0 ? "opacity-10" : "opacity-20"
                  }`} />
                  <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-85">Notification Summary</h4>
                  <div className="text-5xl font-black italic tracking-tight mb-2">{unreadCount}</div>
                  <p className="text-[10px] font-bold uppercase leading-relaxed opacity-90">
                    {totalCount === 0 
                      ? "No notifications yet. Check back later!"
                      : unreadCount === 0
                      ? "All caught up! You've read all notifications."
                      : unreadCount === 1
                      ? "You have 1 unread notification to review."
                      : `You have ${unreadCount} unread notifications to review.`
                    }
                  </p>
                  <div className="mt-3 text-[9px] font-bold uppercase opacity-75">
                    {orderReceivedCount} received • {paymentMadeCount} paid • {paymentPendingCount} pending
                  </div>
                </div>

                {/* Quick Help Card */}
                <div className="bg-muted/30 border border-border p-6 rounded-[2.5rem] space-y-4">
                  <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center border border-border">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest italic">Pro Tip</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">
                    Track your orders in real-time and get instant updates on payment confirmations and shipping status.
                  </p>
                  <button className="w-full py-3.5 bg-foreground text-background border border-border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" /> View Orders
                  </button>
                </div>

              </div>
            </div>

          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}
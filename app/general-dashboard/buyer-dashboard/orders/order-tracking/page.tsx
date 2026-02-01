"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  Circle,
  Loader2,
  User,
  Phone,
  Mail,
  Globe,
  CreditCard,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

interface Order {
  _id?: any;
  orderId: string;
  buyerInfo: {
    username: string;
    email: string;
    phoneNumber: string;
    shippingAddress: {
      fullName: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      country: string;
      isDefault: boolean;
    };
  };
  productInfo: {
    productCode: string;
    name: string;
    price: number;
    discount: number;
    quantity: number;
    images: Array<{
      url: string;
      thumbnailUrl: string;
      publicId: string;
      _id?: any;
    }>;
    description: string;
    stock: number;
    shippingFee: number;
    processingTime: string;
  };
  sellerInfo: {
    sellerName: string;
    sellerEmail: string;
    phoneNumber: string;
    country: string;
  };
  status: {
    shipping: string;
    buyerAction: string;
    payment: string;
    adminAction: string;
  };
  paymentInfo: {
    amount: number;
    cryptoMethodUsed: string;
    cryptoAmount: string;
    cryptoAddress: string;
    paymentId: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default function OrderTrackingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order ID not provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/buyer/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Order not found');
        }
        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Generate timeline based on order status
  const generateTimeline = (orderStatus: Order['status']) => {
    const timeline = [
      { 
        title: "Payment Confirmed", 
        date: order?.createdAt ? new Date(order.createdAt).toLocaleString() : '',
        icon: ShieldCheck, 
        completed: true // Always active - don't rely on API
      },
      { 
        title: "Order Placed", 
        date: order?.createdAt ? new Date(order.createdAt).toLocaleString() : '',
        icon: Package, 
        completed: true // Order is placed once it exists
      },
      { 
        title: "Seller Shipped", 
        date: order?.updatedAt && orderStatus.shipping !== 'pending' ? new Date(order.updatedAt).toLocaleString() : 'Pending',
        icon: Truck, 
        completed: ['shipped', 'received'].includes(orderStatus.shipping)
      },
      { 
        title: "Product Delivered", 
        date: order?.updatedAt && orderStatus.shipping === 'received' ? new Date(order.updatedAt).toLocaleString() : 'Pending',
        icon: CheckCircle2, 
        completed: orderStatus.shipping === 'received'
      },
      { 
        title: "Seller Paid", 
        date: order?.updatedAt && orderStatus.buyerAction === 'received' ? new Date(order.updatedAt).toLocaleString() : 'Pending',
        icon: DollarSign, 
        completed: orderStatus.buyerAction === 'received'
      }
    ];

    return timeline;
  };

  const handleConfirmDelivery = async () => {
    if (!order) return;
    
    try {
      const response = await fetch('/api/buyer/orders/update-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          orderId: order.orderId, 
          updates: { buyerAction: 'received' } 
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        toast.error(result.error || 'Failed to confirm delivery');
        return;
      }

      setHasConfirmed(true);
      toast.success("Delivery Confirmed!", {
        description: "Seller payout has been triggered successfully.",
      });

      // Update local order state
      setOrder(prev => prev ? {
        ...prev,
        status: {
          ...prev.status,
          buyerAction: 'received',
          shipping: 'received'
        },
        updatedAt: new Date()
      } : null);
    } catch (error) {
      console.error('Error confirming delivery:', error);
      toast.error('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm font-medium">Loading order details...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">
                Order Not Found
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {error || 'The order you are looking for does not exist.'}
              </p>
              <Link 
                href="/general-dashboard/buyer-dashboard/orders"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const timeline = generateTimeline(order.status);
  const totalAmount = order.productInfo.price + order.productInfo.shippingFee;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <Link href="/general-dashboard/buyer-dashboard/orders" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4">
                <ChevronLeft className="w-3 h-3" /> Back to Orders
              </Link>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                Track Order
              </h1>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
                ID: <span className="text-foreground">{order.orderId}</span> • Status: <span className="text-primary">{order.status.shipping}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* A. Order Timeline */}
              <div className="lg:col-span-7">
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-10 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Progress Timeline
                  </h3>
                  
                  <div className="space-y-0">
                    {timeline.map((step, idx) => (
                      <div key={idx} className="relative flex gap-6 pb-10 last:pb-0">
                        {/* Line Connector */}
                        {idx !== timeline.length - 1 && (
                          <div className={`absolute left-[11px] top-6 w-[2px] h-full ${step.completed ? "bg-primary" : "bg-border"}`} />
                        )}
                        
                        {/* Icon Node */}
                        <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-background ${step.completed ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                          {step.completed ? <step.icon className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                        </div>

                        {/* Content */}
                        <div className="-mt-1">
                          <p className={`text-sm font-black uppercase italic tracking-tighter ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.title}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground mt-1">
                            {step.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* B. Order Details */}
              <div className="lg:col-span-5 space-y-6">
                {/* Product Info */}
                <div className="bg-card border border-border rounded-3xl p-6">
                  <h3 className="text-xs font-black uppercase tracking-widest mb-6">Product Details</h3>
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-border">
                      <img 
                        src={order.productInfo.images[0]?.url || '/placeholder.png'} 
                        alt={order.productInfo.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-sm uppercase italic tracking-tight">{order.productInfo.name}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">{order.productInfo.productCode}</p>
                      <p className="text-lg font-black mt-2">${totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="bg-card border border-border rounded-3xl p-6">
                  <h3 className="text-xs font-black uppercase tracking-widest mb-6">Seller Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Seller</p>
                        <p className="text-sm font-black">{order.sellerInfo.sellerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Email</p>
                        <p className="text-sm font-black">{order.sellerInfo.sellerEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Country</p>
                        <p className="text-sm font-black">{order.sellerInfo.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Confirmation */}
                {order.status.shipping === 'shipped' && order.status.buyerAction !== 'received' && (
                  <div className="bg-foreground text-background rounded-3xl p-6 border-2 border-foreground shadow-2xl">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4">Confirm Delivery</h3>
                    <p className="text-[10px] font-medium leading-relaxed mb-6 opacity-70">
                      Only confirm if you have physically received the items and are satisfied with the quality. Confirmation releases funds to the seller.
                    </p>
                    <button 
                      onClick={handleConfirmDelivery}
                      className="w-full bg-background text-foreground py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                    >
                      I&apos;ve Received the Order
                    </button>
                  </div>
                )}

                {order.status.buyerAction === 'received' && (
                  <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-6">
                    <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest">
                      <CheckCircle2 className="w-5 h-5" /> Transaction Finalized
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}
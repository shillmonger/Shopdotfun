"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Package,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface BuyerPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    orderTotal: number;
    amountToPay: number;
    cryptoMethodUsed: string;
    cryptoAmount: string;
    cryptoAddress: string;
    checkoutData: any;
  };
}

export default function BuyerPaymentModal({
  isOpen,
  onClose,
  orderData,
}: BuyerPaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState<any>(null);

  // Fetch buyer information when modal opens
  useEffect(() => {
    if (isOpen && !buyerInfo) {
      fetchBuyerInfo();
    }
  }, [isOpen]);

  const fetchBuyerInfo = async () => {
    try {
      const response = await fetch("/api/buyer/profile");
      if (response.ok) {
        const data = await response.json();
        setBuyerInfo(data.user);
      }
    } catch (error) {
      console.error("Error fetching buyer info:", error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/buyer/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        toast.success("Payment recorded successfully!", {
          description: "Your payment has been saved with pending status.",
          icon: <CheckCircle2 className="text-green-500" />,
        });

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
        }, 2000);
      } else {
        toast.error("Failed to record payment", {
          description: result.error || "Please try again later.",
          icon: <AlertCircle className="text-red-500" />,
        });
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Network error", {
        description: "Please check your connection and try again.",
        icon: <AlertCircle className="text-red-500" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  Confirm Payment
                </h2>
                <p className="text-sm text-muted-foreground">
                  Save your payment details for processing
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-xl transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Payment Recorded!
              </h3>
              <p className="text-muted-foreground">
                Your payment has been saved with pending status.
              </p>
            </div>
          ) : (
            <>
              {/* Payment Summary */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-bold uppercase tracking-tighter mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Payment Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Order Total</span>
                    <span className="font-bold">${orderData.orderTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount to Pay</span>
                    <span className="font-bold">${orderData.amountToPay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Crypto Amount</span>
                    <span className="font-bold">
                      {orderData.cryptoAmount} {orderData.cryptoMethodUsed.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Method</span>
                    <span className="font-bold uppercase">
                      {orderData.cryptoMethodUsed}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-bold uppercase tracking-tighter mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Your Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{buyerInfo?.email || 'Loading...'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{buyerInfo?.phone || 'Loading...'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{buyerInfo?.country || 'Loading...'}</span>
                  </div>
                </div>
              </div>

              {/* Products Count */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-bold uppercase tracking-tighter mb-2">
                  Order Items
                </h3>
                <p className="text-sm text-muted-foreground">
                  {orderData.checkoutData.cartItems?.length || 0} product(s) in this order
                </p>
              </div>

              {/* Security Notice */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Secure Payment Processing</p>
                    <p className="text-muted-foreground">
                      Your payment will be verified and processed within 30 minutes. 
                      You will receive a confirmation once the payment is confirmed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-4 border border-border rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-primary-foreground px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Payment
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

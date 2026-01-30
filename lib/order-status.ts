// Order status utilities for mapping status values to human-readable labels and colors

export type OrderStatus = {
  shipping: 'pending' | 'shipped' | 'received';
  buyerAction: 'none' | 'received' | 'delayed' | 'damaged';
  payment: 'pending' | 'paid';
  adminAction: 'none' | 'reviewed' | 'refunded';
};

// Shipping status mappings
export const SHIPPING_STATUS = {
  pending: { label: 'Order Processing', color: 'yellow' },
  shipped: { label: 'Shipped', color: 'blue' },
  received: { label: 'Delivered', color: 'green' }
} as const;

// Buyer action mappings
export const BUYER_ACTION_STATUS = {
  none: { label: 'None', color: 'gray', hide: true },
  received: { label: 'Confirmed Received', color: 'green', hide: false },
  delayed: { label: 'Delivery Delayed', color: 'orange', hide: false },
  damaged: { label: 'Product Damaged', color: 'red', hide: false }
} as const;

// Payment status mappings
export const PAYMENT_STATUS = {
  pending: { label: 'Awaiting Payment', color: 'yellow' },
  paid: { label: 'Paid', color: 'green' }
} as const;

// Admin action mappings
export const ADMIN_ACTION_STATUS = {
  none: { label: 'None', color: 'gray' },
  reviewed: { label: 'Reviewed', color: 'blue' },
  refunded: { label: 'Refunded', color: 'red' }
} as const;

// Color variants for badges
export const COLOR_VARIANTS = {
  yellow: 'bg-yellow-500 text-white',
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  orange: 'bg-orange-500 text-white',
  red: 'bg-red-500 text-white',
  gray: 'bg-gray-500 text-white'
} as const;

// Get human-readable label for shipping status
export function getShippingStatusLabel(status: OrderStatus['shipping']): string {
  return SHIPPING_STATUS[status].label;
}

// Get human-readable label for buyer action
export function getBuyerActionLabel(status: OrderStatus['buyerAction']): string {
  return BUYER_ACTION_STATUS[status].label;
}

// Get human-readable label for payment status
export function getPaymentStatusLabel(status: OrderStatus['payment']): string {
  return PAYMENT_STATUS[status].label;
}

// Get human-readable label for admin action
export function getAdminActionLabel(status: OrderStatus['adminAction']): string {
  return ADMIN_ACTION_STATUS[status].label;
}

// Get color class for shipping status
export function getShippingStatusColor(status: OrderStatus['shipping']): string {
  return COLOR_VARIANTS[SHIPPING_STATUS[status].color];
}

// Get color class for buyer action
export function getBuyerActionColor(status: OrderStatus['buyerAction']): string {
  return COLOR_VARIANTS[BUYER_ACTION_STATUS[status].color];
}

// Get color class for payment status
export function getPaymentStatusColor(status: OrderStatus['payment']): string {
  return COLOR_VARIANTS[PAYMENT_STATUS[status].color];
}

// Get color class for admin action
export function getAdminActionColor(status: OrderStatus['adminAction']): string {
  return COLOR_VARIANTS[ADMIN_ACTION_STATUS[status].color];
}

// Check if buyer action should be hidden
export function shouldHideBuyerAction(status: OrderStatus['buyerAction']): boolean {
  return status === 'none';
}

// Check if order has issues (delayed or damaged)
export function hasOrderIssues(status: OrderStatus): boolean {
  return status.buyerAction === 'delayed' || status.buyerAction === 'damaged';
}

// Check if payment can be released (received + received + pending)
export function canReleasePayment(status: OrderStatus): boolean {
  return status.shipping === 'received' && 
         status.buyerAction === 'received' && 
         status.payment === 'pending';
}

// Check if seller can mark as shipped
export function canMarkAsShipped(status: OrderStatus): boolean {
  return status.shipping === 'pending';
}

// Check if buyer can take action (shipped orders)
export function canBuyerAct(status: OrderStatus): boolean {
  return status.shipping === 'shipped';
}

// Validate status updates based on user role
export function validateStatusUpdate(
  currentStatus: OrderStatus,
  updates: Partial<OrderStatus>,
  role: 'buyer' | 'seller' | 'admin'
): { valid: boolean; error?: string } {
  // Buyers can only update buyerAction and shipping (when confirming receipt)
  if (role === 'buyer') {
    const allowedKeys = ['buyerAction'];
    if (updates.buyerAction === 'received' && updates.shipping === 'received') {
      // Allow both updates when confirming receipt
    } else if (updates.shipping && !updates.buyerAction) {
      return { valid: false, error: 'Buyers cannot update shipping status directly' };
    }
    
    for (const key of Object.keys(updates)) {
      if (!allowedKeys.includes(key) && !(key === 'shipping' && updates.buyerAction === 'received')) {
        return { valid: false, error: `Buyers cannot update ${key}` };
      }
    }
  }
  
  // Sellers can only update shipping status
  if (role === 'seller') {
    const allowedKeys = ['shipping'];
    for (const key of Object.keys(updates)) {
      if (!allowedKeys.includes(key)) {
        return { valid: false, error: `Sellers cannot update ${key}` };
      }
    }
    
    // Sellers can only mark as shipped from pending
    if (updates.shipping && currentStatus.shipping !== 'pending') {
      return { valid: false, error: 'Can only mark pending orders as shipped' };
    }
  }
  
  // Admins can update payment and adminAction
  if (role === 'admin') {
    const allowedKeys = ['payment', 'adminAction'];
    for (const key of Object.keys(updates)) {
      if (!allowedKeys.includes(key)) {
        return { valid: false, error: `Admins cannot update ${key}` };
      }
    }
  }
  
  return { valid: true };
}

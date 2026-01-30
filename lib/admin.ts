export const adminApi = {
  // Fetch all products
  async getAllProducts() {
    const res = await fetch('/api/admin/products');
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    return res.json();
  },

  // Update product status (approve/reject)
  async updateProductStatus(productId: string, status: 'approved' | 'rejected', reason?: string) {
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, rejectionReason: reason }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update product status');
    }

    return res.json();
  },

  // Fetch all payments for admin approval
  async getAllPayments(status?: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const res = await fetch(`/api/admin/payments?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch payments');
    }
    return res.json();
  },

  // Delete a product
  async deleteProduct(productId: string) {
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to delete product');
    }

    return res.json();
  },

  // Update payment status (approve/reject)
  async updatePaymentStatus(paymentId: string, status: 'approved' | 'rejected') {
    const res = await fetch('/api/admin/payments', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentId, status }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update payment status');
    }

    return res.json();
  },
};

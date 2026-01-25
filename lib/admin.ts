export const adminApi = {
  // Fetch all pending products
  async getPendingProducts() {
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
};

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MapPin, Plus, Trash2, Edit, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Address } from '@/models/User';
import AddressForm from './AddressForm';

interface AddressBookProps {
  userId: string;
}

export default function AddressBook({ userId }: AddressBookProps) {
  const [addresses, setAddresses] = useState<Array<Address & { _id: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address> & { _id?: string } | null>(null);

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/buyer/addresses');
      if (!response.ok) throw new Error('Failed to fetch addresses');
      const data = await response.json();
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  // Handle save address
  const handleSaveAddress = async (addressData: Address) => {
    try {
      const method = currentAddress?._id ? 'PUT' : 'POST';
      const url = '/api/buyer/addresses';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentAddress?._id 
          ? { addressId: currentAddress._id, ...addressData }
          : addressData
        ),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save address');
      }

      await fetchAddresses();
      toast.success(`Address ${currentAddress?._id ? 'updated' : 'saved'} successfully`);
      setCurrentAddress(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save address');
    }
  };

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // Handle delete address
  const handleDeleteAddress = async (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;
    
    try {
      const response = await fetch('/api/buyer/addresses', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressId: addressToDelete }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete address');
      }

      await fetchAddresses();
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete address');
    } finally {
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    }
  };

  // Handle set default address
  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch('/api/buyer/addresses/default', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to set default address');
      }

      await fetchAddresses();
      toast.success('Default address updated');
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to set default address');
    }
  };

  // Start editing an address
  const startEditing = (address: Address & { _id: string }) => {
    setCurrentAddress(address);
    setIsEditing(true);
  };

  // Start adding a new address
  const startAdding = () => {
    setCurrentAddress({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      country: 'Nigeria',
      isDefault: false,
    });
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setCurrentAddress(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive cursor-pointer text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 italic">
            <MapPin className="w-4 h-4 text-primary" /> Shipping Addresses
          </h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mt-1">
            Manage your delivery addresses
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={startAdding}
            className="bg-primary text-primary-foreground cursor-pointer px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h4 className="text-sm font-bold mb-4">
            {currentAddress?._id ? 'Edit Address' : 'Add New Address'}
          </h4>
          <AddressForm
            initialData={currentAddress || undefined}
            onSave={handleSaveAddress}
            onCancel={cancelEditing}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-8 bg-muted/30 rounded-2xl">
              <p className="text-muted-foreground text-sm">No addresses found</p>
              <button
                onClick={startAdding}
                className="mt-4 text-primary font-medium text-sm hover:underline"
              >
                Add your first address
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`p-4 rounded-xl border ${
                    address.isDefault ? 'border-primary/50 bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold">{address.fullName}</h4>
                        {address.isDefault && (
                          <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-1">{address.street}</p>
                      <p className="text-sm">
                        {address.city}, {address.state}
                      </p>
                      <p className="text-sm">{address.country}</p>
                      <p className="text-sm mt-2 font-medium">{address.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(address)}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Edit address"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {!address.isDefault && (
                        <>
                          <button
                            onClick={() => handleSetDefault(address._id)}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Set as default"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="p-2 text-destructive/70 hover:text-destructive transition-colors"
                            aria-label="Delete address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
            <div className="grid md:grid-cols-2 gap-6">
  {addresses.map((address) => (
    <div
      key={address._id}
      className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all ${
        address.isDefault 
          ? 'border-primary bg-primary/[0.03] ring-1 ring-primary/20' 
          : 'border-border bg-card'
      }`}
    >
      {/* Top Section: Header & Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-lg tracking-tight text-foreground">
              {address.fullName}
            </h4>
            {/* {address.isDefault && (
              <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                Default
              </span>
            )} */}
          </div>
          
          <div className="text-sm text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground/80">{address.street}</p>
            <p>{address.city}, {address.state}, {address.country}</p>
          </div>
        </div>

        {/* Action Buttons: Fixed Position */}
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          <button
            onClick={() => startEditing(address)}
            className="p-2 rounded-md hover:bg-background cursor-pointer hover:text-primary transition-colors text-muted-foreground"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          {!address.isDefault && (
            <>
              <button
                onClick={() => handleSetDefault(address._id)}
                className="p-2 rounded-md hover:bg-background cursor-pointer hover:text-primary transition-colors text-muted-foreground"
                title="Make Default"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteAddress(address._id)}
                className="p-2 rounded-md hover:bg-destructive/10 cursor-pointer hover:text-destructive transition-colors text-destructive/70"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Section: Contact Info */}
      <div className="pt-4 border-t border-border/50 flex justify-between items-center">
        <p className="text-sm font-semibold text-muted-foreground">
          <span className="text-[10px] uppercase opacity-50 mr-2">Phone</span>
          {address.phone}
        </p>
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

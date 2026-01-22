'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, MapPin, User, Phone, Home, Globe, RefreshCcw } from 'lucide-react';
import { Address } from '@/models/User';

interface AddressFormProps {
  initialData?: Partial<Address> & { _id?: string };
  onSave?: (address: Address) => void | Promise<void>; // Added Promise support
  onCancel?: () => void;
  isSaving?: boolean;
}

export default function AddressForm({ 
  initialData, 
  onSave, 
  onCancel,
  isSaving: isSavingProp = false // Rename for internal use
}: AddressFormProps) {
  // Local loading state for immediate UI feedback
  const [isLocalSaving, setIsLocalSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Address> & { _id?: string }>({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'Nigeria',
    isDefault: false,
    ...initialData
  });

  // Combine prop and local state to determine if we are "loading"
  const isLoading = isSavingProp || isLocalSaving;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.country) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const addressData: Address = {
      fullName: formData.fullName || '',
      phone: formData.phone || '',
      street: formData.street || '',
      city: formData.city || '',
      state: formData.state || '',
      country: formData.country || 'Nigeria',
      isDefault: formData.isDefault || false,
      createdAt: formData.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    try {
      setIsLocalSaving(true); // Start loading animation
      if (onSave) {
        // We await this so the "Saving..." stays until the parent finishes
        await onSave(addressData); 
      }
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error("An error occurred while saving.");
    } finally {
      setIsLocalSaving(false); // Stop loading animation
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName || ''}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full bg-muted/50 border border-border rounded-xl pl-12 pr-4 py-3.5 text-xs font-bold outline-none focus:ring-2 ring-primary/20 transition-all"
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="+234 801 234 5678"
              className="w-full bg-muted/50 border border-border rounded-xl pl-12 pr-4 py-3.5 text-xs font-bold outline-none focus:ring-2 ring-primary/20 transition-all"
              required
            />
          </div>
        </div>

        {/* Street Address */}
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="street" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Street Address *
          </label>
          <div className="relative">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
            <input
              id="street"
              name="street"
              type="text"
              value={formData.street || ''}
              onChange={handleChange}
              placeholder="12 Allen Avenue, House/Flat Number"
              className="w-full bg-muted/50 border border-border rounded-xl pl-12 pr-4 py-3.5 text-xs font-bold outline-none focus:ring-2 ring-primary/20 transition-all"
              required
            />
          </div>
        </div>

        {/* City / Town */}
        <div className="space-y-2">
          <label htmlFor="city" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            City / Town *
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city || ''}
            onChange={handleChange}
            placeholder="Ikeja"
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-xs font-bold outline-none focus:ring-2 ring-primary/20 transition-all"
            required
          />
        </div>

        {/* State / Region */}
        <div className="space-y-2">
          <label htmlFor="state" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            State / Region *
          </label>
          <input
            id="state"
            name="state"
            type="text"
            value={formData.state || ''}
            onChange={handleChange}
            placeholder="Lagos State"
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-xs font-bold outline-none focus:ring-2 ring-primary/20 transition-all"
            required
          />
        </div>

        {/* Country */}
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="country" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Country *
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
            <input
              id="country"
              name="country"
              type="text"
              value={formData.country || 'Nigeria'}
              onChange={handleChange}
              className="w-full bg-muted/50 border border-border rounded-xl pl-12 pr-4 py-3.5 text-xs font-bold outline-none focus:ring-2 ring-primary/20 transition-all"
              required
            />
          </div>
        </div>

        {/* Set as Default */}
        <div className="md:col-span-2 flex items-center space-x-2 pt-2">
          <input
            id="isDefault"
            name="isDefault"
            type="checkbox"
            checked={formData.isDefault || false}
            onChange={handleChange}
              required
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isDefault" className="text-xs font-bold text-muted-foreground">
            Set as default shipping address
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-foreground cursor-pointer text-background px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {initialData?._id ? 'UPDATING...' : 'SAVING...'}
            </>
          ) : (
            <>
              <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              {initialData?._id ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}
            </>
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-muted/50 cursor-pointer text-foreground px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-border transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CANCEL
          </button>
        )}
      </div>
      
      <p className="text-center text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-4 opacity-50">
        * Required fields
      </p>
    </form>
  );
}
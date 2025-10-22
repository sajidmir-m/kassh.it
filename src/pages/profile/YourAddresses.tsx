import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Plus, Edit, Trash2, Home, Building, Star } from 'lucide-react';
import { toast } from 'sonner';

const YourAddresses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    full_address: '',
    city: 'Srinagar',
    state: 'Jammu and Kashmir',
    pincode: '',
    phone: '',
    is_default: false
  });

  const { data: addresses } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const queryClient = useQueryClient();

  const addAddress = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase
        .from('addresses')
        .insert([{ ...payload, user_id: user?.id }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
      toast.success('Address added successfully!');
      setIsAdding(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error('Failed to add address: ' + error.message);
    },
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, ...payload }: any) => {
      const { error } = await supabase
        .from('addresses')
        .update(payload)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
      toast.success('Address updated successfully!');
      setEditingId(null);
      resetForm();
    },
    onError: (error: any) => {
      toast.error('Failed to update address: ' + error.message);
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
      toast.success('Address deleted successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to delete address: ' + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      label: '',
      full_address: '',
      city: 'Srinagar',
      state: 'Jammu and Kashmir',
      pincode: '',
      phone: '',
      is_default: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAddress.mutate({ id: editingId, ...formData });
    } else {
      addAddress.mutate(formData);
    }
  };

  const handleEdit = (address: any) => {
    setFormData({
      label: address.label,
      full_address: address.full_address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      is_default: address.is_default
    });
    setEditingId(address.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const getAddressIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'home': return <Home className="h-5 w-5" />;
      case 'office': return <Building className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Addresses</h1>
            <p className="text-gray-600 mt-2">Manage your delivery addresses</p>
          </div>

          {/* Add New Address Button */}
          <div className="mb-6">
            <Button
              onClick={() => {
                setIsAdding(true);
                setEditingId(null);
                resetForm();
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Address
            </Button>
          </div>

          {/* Add/Edit Address Form */}
          {isAdding && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingId ? 'Edit Address' : 'Add New Address'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Label</label>
                      <Input
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        placeholder="Home, Office, etc."
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Phone</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91..."
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Full Address</label>
                      <Input
                        value={formData.full_address}
                        onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                        placeholder="Street, Area, Landmark"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">City</label>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">State</label>
                      <Input
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Pincode</label>
                      <Input
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="190001"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={formData.is_default}
                      onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="is_default" className="text-sm text-gray-700">
                      Set as default address
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={addAddress.isPending || updateAddress.isPending}
                    >
                      {editingId ? 'Update Address' : 'Add Address'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Addresses List */}
          <div className="space-y-4">
            {addresses && addresses.length > 0 ? (
              addresses.map((address: any) => (
                <Card key={address.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getAddressIcon(address.label)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{address.label}</h3>
                            {address.is_default && (
                              <div className="flex items-center gap-1 text-yellow-600">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="text-xs font-medium">Default</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 mb-2">{address.full_address}</p>
                          <p className="text-gray-600 text-sm">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-gray-600 text-sm">Phone: {address.phone}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(address)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAddress.mutate(address.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
                  <p className="text-gray-600 mb-6">
                    Add your first delivery address to get started.
                  </p>
                  <Button onClick={() => setIsAdding(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourAddresses;

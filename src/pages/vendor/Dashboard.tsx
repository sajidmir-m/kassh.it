import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, TrendingUp, PlusCircle, Upload, Check, Truck, Download, MapPin, X, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getCurrentPosition } from '@/lib/utils';

const VendorDashboard = () => {
  const { userRoles, user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"><span className="text-sm text-muted-foreground">Loading…</span></div>
    );
  }

  if (!userRoles.includes('vendor')) {
    navigate('/vendor/auth');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <a href="/vendor/auth" className="text-sm text-primary underline">Go to vendor login</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Vendor Dashboard</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-8 w-8 text-primary" />
                <CardTitle>Shop Location</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <VendorLocationCard userId={user?.id ?? null} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-8 w-8 text-primary" />
                  <CardTitle>My Products</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <VendorProductsList userId={user?.id ?? null} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PlusCircle className="h-8 w-8 text-primary" />
                <CardTitle>Add New Product</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <AddProductForm userId={user?.id ?? null} />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2"><TrendingUp className="h-8 w-8 text-primary" /><CardTitle>Stats</CardTitle></div>
            </CardHeader>
            <CardContent><p className="text-3xl font-bold">₹0</p></CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2"><Truck className="h-8 w-8 text-primary" /><CardTitle>Orders</CardTitle></div>
            </CardHeader>
            <CardContent>
              <VendorOrders userId={user?.id ?? null} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;

const VendorLocationCard = ({ userId }: { userId: string | null }) => {
  const queryClient = useQueryClient();
  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendor-location', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('vendors')
        .select('id, latitude, longitude')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data as { id: string; latitude: number | null; longitude: number | null } | null;
    },
  });

  const setLocation = useMutation({
    mutationFn: async () => {
      if (!vendor?.id) throw new Error('Vendor profile not found');
      const pos = await getCurrentPosition();
      if (!pos) throw new Error('Unable to get current location');
      const { error } = await (supabase as any)
        .from('vendors')
        .update({ latitude: pos.lat, longitude: pos.lon })
        .eq('id', vendor.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Shop location updated');
      queryClient.invalidateQueries({ queryKey: ['vendor-location', userId] });
      queryClient.invalidateQueries({ queryKey: ['vendor-orders', vendor?.id] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to set location'),
  });

  if (!userId) return <p className="text-sm text-muted-foreground">Sign in to manage location.</p>;
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!vendor) return <p className="text-sm text-muted-foreground">No vendor profile found.</p>;

  const hasLocation = vendor.latitude != null && vendor.longitude != null;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm">
        <div className="font-medium">Status: {hasLocation ? 'Location set' : 'Not set'}</div>
        {hasLocation ? (
          <div className="text-xs text-muted-foreground">Lat: {vendor.latitude} • Lon: {vendor.longitude}</div>
        ) : (
          <div className="text-xs text-destructive">Vendor location is required for assignment</div>
        )}
      </div>
      <Button size="sm" onClick={() => setLocation.mutate()} disabled={setLocation.isPending || hasLocation} title={hasLocation ? 'Location already set' : ''}>
        {hasLocation ? 'Location Set' : 'Use Current Location'}
      </Button>
    </div>
  );
}

const AddProductForm = ({ userId }: { userId: string | null }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [unit, setUnit] = useState('piece');
  const [stock, setStock] = useState('0');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as Array<{ id: string; name: string }>;
    },
  });

  const { data: vendor } = useQuery({
    queryKey: ['vendor-profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data as { id: string } | null;
    },
  });

  const createProduct = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Not authenticated');
      if (!vendor?.id) throw new Error('Vendor profile not found');
      if (!categoryId) throw new Error('Select a category');
      if (!name || !price) throw new Error('Name and price are required');

      let imageUrl: string | null = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const path = `${vendor.id}/${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage
          .from('product-images')
          .upload(path, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });
        if (uploadErr) throw uploadErr;
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        imageUrl = data.publicUrl;
      }

      const { error } = await (supabase as any).rpc('create_product', {
        p_category_id: categoryId || null,
        p_name: name.trim(),
        p_description: description.trim() || null,
        p_price: Number(price),
        p_stock: Number(stock || '0'),
        p_unit: unit.trim() || null,
        p_image_url: imageUrl,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Product submitted for approval');
      setName('');
      setPrice('');
      setCategoryId('');
      setUnit('piece');
      setStock('0');
      setDescription('');
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
    },
    onError: (err: any) => toast.error(err?.message || 'Failed to add product'),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct.mutate();
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tomatoes" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Price</label>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" step="0.01" placeholder="100" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Unit</label>
          <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="piece / kg / pack" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Stock</label>
          <Input value={stock} onChange={(e) => setStock(e.target.value)} type="number" min="0" step="1" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Image</label>
          <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product" />
      </div>
      <Button type="submit" disabled={createProduct.isPending}>
        <Upload className="h-4 w-4 mr-2" /> {createProduct.isPending ? 'Saving…' : 'Submit for Approval'}
      </Button>
    </form>
  );
};

const VendorOrders = ({ userId }: { userId: string | null }) => {
  const { data: vendor } = useQuery({
    queryKey: ['vendor-location', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('vendors')
        .select('id, latitude, longitude')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data as { id: string; latitude: number | null; longitude: number | null } | null;
    },
  });

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['vendor-orders', vendor?.id],
    enabled: !!vendor?.id,
    queryFn: async () => {
      console.log('Fetching vendor orders...');
      
      // First get basic orders
      const { data: basicOrders, error: basicError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('Basic orders query result:', { data: basicOrders, error: basicError });
      
      if (basicError) {
        console.error('Basic orders query error:', basicError);
        throw basicError;
      }
      
      if (!basicOrders || basicOrders.length === 0) {
        console.log('No orders found');
        return [];
      }
      
      // Filter orders that contain products from this vendor
      const ordersWithVendorProducts = await Promise.all(
        basicOrders.map(async (order) => {
          // Get order items with vendor info
          const { data: orderItems } = await supabase
            .from('order_items')
            .select(`
              id, 
              product_id, 
              quantity, 
              snapshot_name, 
              snapshot_price, 
              products(vendor_id)
            `)
            .eq('order_id', order.id);
          
          // Check if any order items belong to this vendor
          const hasVendorProducts = orderItems?.some((oi: any) => oi.products?.vendor_id === vendor!.id);
          
          if (hasVendorProducts) {
            // Get user profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id, full_name, phone')
              .eq('id', order.user_id)
              .single();
            
            if (profileError) {
              console.error('Profile query error for order', order.id, ':', profileError);
            }
            
            // Get address
            const { data: address, error: addressError } = await supabase
              .from('addresses')
              .select('id, label, full_address, city, state, pincode, phone')
              .eq('id', order.address_id)
              .single();
            
            if (addressError) {
              console.error('Address query error for order', order.id, ':', addressError);
            }
            
            console.log('Order', order.id, 'profile:', profile, 'address:', address);
            
            return {
              ...order,
              profiles: profile,
              addresses: address,
              order_items: orderItems || []
            };
          }
          
          return null;
        })
      );
      
      // Filter out null results and cancelled orders
      const filtered = ordersWithVendorProducts.filter(order => order !== null && order.delivery_status !== 'cancelled');
      
      console.log('Vendor orders with details:', filtered);
      return filtered as Array<{
        id: string;
        created_at: string;
        delivery_status: string | null;
        final_amount: number;
        user_id: string;
        address_id: string;
        profiles: { id: string; full_name: string; phone: string | null } | null;
        addresses: { id: string; label: string; full_address: string; city: string; state: string; pincode: string; phone: string | null } | null;
        order_items: Array<{ id: string; product_id: string | null; quantity: number; snapshot_name: string; snapshot_price: number; products: { vendor_id: string } | null }>;
      }>;
    },
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    if (!vendor?.id) return;
    const channel = supabase
      .channel(`orders-vendor-${vendor.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        queryClient.invalidateQueries({ queryKey: ['vendor-orders', vendor.id] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_requests' }, () => {
        queryClient.invalidateQueries({ queryKey: ['vendor-orders', vendor.id] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [vendor?.id, queryClient]);
  const [hiddenOrderIds, setHiddenOrderIds] = useState<string[]>([]);
  const assignNearest = useMutation({
    mutationFn: async (orderId: string) => {
      const { error: rpcErr } = await (supabase as any).rpc('assign_nearest_partner', { p_order_id: orderId });
      if (rpcErr) throw rpcErr;
      // Reflect status on orders table for UI consistency
      const { error: orderErr } = await supabase
        .from('orders')
        .update({ delivery_status: 'assigned' as any })
        .eq('id', orderId);
      if (orderErr) throw orderErr;
      return { ok: true } as const;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-orders', vendor?.id] });
      toast.success('Assigned to nearest delivery partner');
    },
    onError: (err: any) => {
      console.error('Assign nearest error:', err);
      toast.error(err?.message || 'Failed to assign partner');
    },
  });

  const rejectOrder = useMutation({
    mutationFn: async (orderId: string) => {
      // Update delivery_status to 'rejected_by_vendor' (no delete)
      const { error } = await supabase
        .from('orders')
        .update({ delivery_status: 'rejected_by_vendor' })
        .eq('id', orderId);
      if (error) throw error;
      await (supabase as any)
        .from('delivery_requests')
        .delete()
        .eq('order_id', orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-orders', vendor?.id] });
      toast.success('Order rejected successfully.');
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to reject order'),
  });

  const deleteOrder = useMutation({
    mutationFn: async (orderId: string) => {
      // Always set cancelled for user, remove any delivery requests
      await supabase
        .from('orders')
        .update({ delivery_status: 'cancelled' as any })
        .eq('id', orderId);
      await (supabase as any)
        .from('delivery_requests')
        .delete()
        .eq('order_id', orderId);
      // Then, permanently remove order for both parties
      setTimeout(async () => {
        await supabase.from('orders').delete().eq('id', orderId);
      }, 750);
    },
    onSuccess: (_, orderId) => {
      toast.success('Order deleted successfully');
      setHiddenOrderIds((prev) => [...prev, orderId as string]);
      queryClient.invalidateQueries({ queryKey: ['vendor-orders', vendor?.id] });
    },
    onError: async (e: any, orderId) => {
      try {
        await supabase.from('orders').delete().eq('id', orderId as string);
        setHiddenOrderIds((prev) => [...prev, orderId as string]);
        toast.success('Order deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['vendor-orders', vendor?.id] });
      } catch (err: any) {
        toast.error(e?.message || 'Failed to delete order');
      }
    },
  });

  const testVendorAccess = useMutation({
    mutationFn: async () => {
      // Test profile access
      const { data: profileTest, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, phone')
        .limit(1);
      
      // Test address access
      const { data: addressTest, error: addressError } = await supabase
        .from('addresses')
        .select('id, label, full_address')
        .limit(1);
      
      return {
        profileTest: { data: profileTest, error: profileError },
        addressTest: { data: addressTest, error: addressError }
      };
    },
    onSuccess: (data) => {
      console.log('Vendor access test:', data);
      toast.success(`Profile access: ${data.profileTest.error ? 'FAILED' : 'SUCCESS'}, Address access: ${data.addressTest.error ? 'FAILED' : 'SUCCESS'}`);
    },
    onError: (error: any) => {
      console.error('Vendor access test error:', error);
      toast.error('Vendor access test failed');
    },
  });

  const downloadReceipt = (order: any) => {
    // Get vendor details
    const vendorDetails = {
      businessName: "Kassh.IT E-Commerce", // Your company name
      address: "123 Business Street, Tech City, TC 12345",
      phone: "+1 (555) 123-4567",
      email: "orders@kassh.it",
      website: "www.kassh.it"
    };

    // Create receipt HTML
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - Order ${order.id.slice(0, 8)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .receipt { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
          .company-name { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
          .company-details { color: #666; font-size: 14px; }
          .invoice-title { font-size: 24px; font-weight: bold; color: #333; margin: 20px 0; }
          .order-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .order-details, .customer-details { flex: 1; }
          .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
          .info-row { margin-bottom: 8px; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          .items-table th { background-color: #f8fafc; font-weight: bold; color: #374151; }
          .items-table tr:nth-child(even) { background-color: #f9fafb; }
          .total-section { margin-top: 30px; text-align: right; }
          .total-row { font-size: 18px; font-weight: bold; color: #2563eb; margin-top: 10px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .status-pending { background-color: #fef3c7; color: #92400e; }
          .status-assigned { background-color: #dbeafe; color: #1e40af; }
          .status-out_for_delivery { background-color: #e0e7ff; color: #5b21b6; }
          .status-delivered { background-color: #d1fae5; color: #065f46; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="company-name">${vendorDetails.businessName}</div>
            <div class="company-details">
              ${vendorDetails.address}<br>
              Phone: ${vendorDetails.phone} | Email: ${vendorDetails.email}<br>
              Website: ${vendorDetails.website}
            </div>
          </div>

          <div class="invoice-title">INVOICE</div>

          <div class="order-info">
            <div class="order-details">
              <div class="section-title">Order Information</div>
              <div class="info-row"><span class="label">Order ID:</span> <span class="value">#${order.id.slice(0, 8)}</span></div>
              <div class="info-row"><span class="label">Order Date:</span> <span class="value">${new Date(order.created_at).toLocaleDateString()}</span></div>
              <div class="info-row"><span class="label">Order Time:</span> <span class="value">${new Date(order.created_at).toLocaleTimeString()}</span></div>
              <div class="info-row"><span class="label">Status:</span> <span class="value status-badge status-${order.delivery_status || 'pending'}">${order.delivery_status || 'pending'}</span></div>
            </div>
            <div class="customer-details">
              <div class="section-title">Customer Information</div>
              <div class="info-row"><span class="label">Name:</span> <span class="value">${order.profiles?.full_name || 'N/A'}</span></div>
              <div class="info-row"><span class="label">Phone:</span> <span class="value">${order.profiles?.phone || 'N/A'}</span></div>
              <div class="info-row"><span class="label">Address:</span> <span class="value">${order.addresses?.label || 'N/A'}</span></div>
              <div class="info-row"><span class="label">Location:</span> <span class="value">${order.addresses?.full_address || 'N/A'}</span></div>
              <div class="info-row"><span class="label">City:</span> <span class="value">${order.addresses?.city || 'N/A'}, ${order.addresses?.state || 'N/A'} - ${order.addresses?.pincode || 'N/A'}</span></div>
            </div>
          </div>

          <div class="section-title">Order Items</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.order_items.map((item: any) => `
                <tr>
                  <td>${item.snapshot_name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.snapshot_price.toFixed(2)}</td>
                  <td>₹${(item.snapshot_price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">Total Amount: ₹${order.final_amount.toFixed(2)}</div>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>This is a computer-generated invoice. No signature required.</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and download the file
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id.slice(0, 8)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Receipt downloaded successfully!');
  };

  if (!vendor?.id) return <p className="text-sm text-muted-foreground">Vendor profile not found.</p>;
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!orders || orders.length === 0) return <p className="text-sm text-muted-foreground">No orders for your products yet.</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Orders with Your Products</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => testVendorAccess.mutate()}
          disabled={testVendorAccess.isPending}
        >
          Test Access
        </Button>
      </div>
      {orders.filter((o) => !hiddenOrderIds.includes(o.id)).map((o) => (
        <div key={o.id} className="p-4 border rounded-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold">Order #{o.id.slice(0, 8)}</div>
              <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div>
            </div>
            <div className="text-sm">Status: <span className="uppercase">{o.delivery_status || 'pending'}</span></div>
          </div>

          {/* Customer Info */}
          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <div>
              <h4 className="font-medium text-sm mb-1">Customer</h4>
              <p className="text-sm text-muted-foreground">
                {o.profiles?.full_name || 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                {o.profiles?.phone || 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Delivery Address</h4>
              <p className="text-sm text-muted-foreground">
                {o.addresses?.label || 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                {o.addresses?.full_address || 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                {o.addresses?.city}, {o.addresses?.state} - {o.addresses?.pincode}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-1 mb-3">
            <h4 className="font-medium text-sm mb-1">Order Items</h4>
            {o.order_items.map((oi) => (
              <div key={oi.id} className="flex justify-between text-sm">
                <span>{oi.snapshot_name} × {oi.quantity}</span>
                <span>₹{(oi.snapshot_price * oi.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="font-bold">Total: ₹{o.final_amount}</div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => downloadReceipt(o)}>
                <Download className="h-4 w-4 mr-1" /> Download Receipt
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => assignNearest.mutate(o.id)}
                disabled={assignNearest.isPending || vendor?.latitude == null || vendor?.longitude == null || ['assigned','picked_up','out_for_delivery','delivered'].includes(o.delivery_status)}
                title={vendor?.latitude == null || vendor?.longitude == null ? 'Set shop location first' : o.delivery_status === 'assigned' ? 'Already Assigned' : ''}
              >
                <Check className="h-4 w-4 mr-1" /> {['assigned','picked_up','out_for_delivery','delivered'].includes(o.delivery_status) ? 'Already Assigned' : assignNearest.isPending ? 'Assigning…' : 'Approve & Assign'}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => rejectOrder.mutate(o.id)} disabled={rejectOrder.isPending}>
                <X className="h-4 w-4 mr-1" /> Reject
              </Button>
              {(o.delivery_status === 'delivered' || o.delivery_status === 'cancelled' || o.delivery_status === 'rejected_by_vendor') && (
                <Button size="sm" variant="outline" onClick={() => deleteOrder.mutate(o.id)} disabled={deleteOrder.isPending}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const VendorProductsList = ({ userId }: { userId: string | null }) => {
  const { data: vendor } = useQuery({
    queryKey: ['vendor-profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data as { id: string } | null;
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['vendor-products', vendor?.id],
    enabled: !!vendor?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, stock, unit, is_approved, image_url')
        .eq('vendor_id', vendor!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Array<{ id: string; name: string; price: number; stock: number; unit: string | null; is_approved: boolean | null; image_url: string | null }>;
    },
  });

  if (!vendor?.id) return <p className="text-sm text-muted-foreground">Vendor profile not found.</p>;
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!products || products.length === 0) return <p className="text-sm text-muted-foreground">No products yet.</p>;

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {products.map((p) => (
        <div key={p.id} className="p-4 border rounded-md flex gap-3 items-center">
          <div className="w-16 h-16 bg-muted rounded overflow-hidden flex items-center justify-center">
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="object-cover w-full h-full" />
            ) : (
              <Package className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-semibold">
              {p.name}
              {p.is_approved ? (
                <span className="ml-2 text-xs text-green-600">Approved</span>
              ) : (
                <span className="ml-2 text-xs text-yellow-600">Pending</span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">₹{p.price} • Stock {p.stock}{p.unit ? ` ${p.unit}` : ''}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

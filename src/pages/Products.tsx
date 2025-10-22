import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, Search } from 'lucide-react';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Initialize category filter from URL query (?category=ID)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    if (categoryFromUrl) {
      setCategoryFilter(categoryFromUrl);
    } else {
      setCategoryFilter('all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });

  const { user } = useAuth();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', categoryFilter, search],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, vendors(business_name), categories(name)')
        .eq('is_approved', true)
        .eq('is_active', true);

      if (categoryFilter !== 'all') {
        query = query.eq('category_id', categoryFilter);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const addToCart = async (product: any) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (!product?.id || !product?.price) {
      toast.error('Product information is incomplete');
      return;
    }
    try {
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', String(product.id))
        .single();

      if (existingItem) {
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
        if (updateError) throw updateError;
        toast.success(`${product.name} quantity updated in cart!`);
        setQuantities((q) => ({ ...q, [String(product.id)]: (q[String(product.id)] || 0) + 1 }));
      } else {
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({ user_id: user.id, product_id: String(product.id), quantity: 1 });
        if (insertError) throw insertError;
        toast.success(`${product.name} added to cart!`);
        setQuantities((q) => ({ ...q, [String(product.id)]: (q[String(product.id)] || 0) + 1 }));
      }
    } catch (error: any) {
      toast.error(`Failed to add item to cart: ${error.message || 'Unknown error'}`);
    }
  };

  const decrementFromCart = async (product: any) => {
    if (!user) {
      toast.error('Please login to modify cart');
      return;
    }
    if (!product?.id) return;
    try {
      const current = quantities[String(product.id)] || 0;
      if (current <= 1) {
        const { data: existing } = await supabase
          .from('cart_items')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', String(product.id))
          .maybeSingle();
        if (existing) {
          await supabase.from('cart_items').delete().eq('id', existing.id);
        }
        setQuantities((q) => ({ ...q, [String(product.id)]: 0 }));
        toast.success(`${product.name} removed from cart`);
      } else {
        const { data: existing } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', user.id)
          .eq('product_id', String(product.id))
          .single();
        if (existing) {
          const newQuantity = (existing.quantity || 0) - 1;
          if (newQuantity <= 0) {
            await supabase.from('cart_items').delete().eq('id', existing.id);
          } else {
            await supabase
              .from('cart_items')
              .update({ quantity: newQuantity })
              .eq('id', existing.id);
          }
        }
        setQuantities((q) => ({ ...q, [String(product.id)]: Math.max(0, current - 1) }));
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to update cart');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Products</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              const params = new URLSearchParams(location.search);
              if (value === 'all') {
                params.delete('category');
              } else {
                params.set('category', value);
              }
              navigate({ pathname: '/products', search: params.toString() });
            }}
          >
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-4 place-items-center">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-[110px]">
                <div className="w-[110px] h-[110px] bg-muted rounded-lg animate-pulse" />
                <div className="mt-2 h-3 bg-muted rounded w-3/4 animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-2 sm:gap-3 md:gap-4 place-items-center">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="relative w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] md:w-[120px] md:h-[120px] rounded-xl overflow-hidden flex items-center justify-center transition-all duration-200 border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="h-5 w-5 text-green-700" />
                  )}
                  {/* minus button top-left when qty>0 */}
                  {quantities[String(product.id)] > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); decrementFromCart(product); }}
                      className="absolute left-1 top-1 w-7 h-7 sm:w-7 sm:h-7 md:w-6 md:h-6 rounded-full bg-white text-emerald-700 shadow border border-emerald-200/40 flex items-center justify-center text-sm z-10"
                      aria-label="Decrease quantity"
                      title="Remove one"
                    >
                      -
                    </button>
                  )}
                  {/* plus button top-right */}
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    className="absolute right-1 top-1 w-7 h-7 sm:w-7 sm:h-7 md:w-6 md:h-6 rounded-full bg-white text-emerald-700 shadow border border-emerald-200/40 flex items-center justify-center text-sm z-10"
                    aria-label="Add to cart"
                    title="Add to cart"
                  >
                    +
                  </button>
                  {/* quantity badge */}
                  {quantities[String(product.id)] > 0 && (
                    <div className="absolute bottom-1 right-1 translate-x-0 translate-y-0 px-2 h-6 rounded-full bg-white text-emerald-700 border border-emerald-200/40 shadow text-xs font-semibold flex items-center justify-center">
                      {quantities[String(product.id)]}
                    </div>
                  )}
                </div>
                <div className="mt-1 w-[100px] sm:w-[110px] md:w-[120px]">
                  <p className="text-[11px] text-green-900 line-clamp-1 text-center">{product.name}</p>
                  {/* price and live subtotal */}
                  <div className="mt-1 text-[10px] text-green-800 text-center">
                    ₹{product.price ?? '-'}{product.unit ? ` / ${product.unit}` : ''}
                    {quantities[String(product.id)] > 0 && product.price ? (
                      <span className="ml-1 text-emerald-700 font-semibold">
                        • ₹{(quantities[String(product.id)] * product.price).toFixed(0)}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <Link to={`/products/${product.id}`} className="text-[10px] text-emerald-700 underline">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="h-6 w-6 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

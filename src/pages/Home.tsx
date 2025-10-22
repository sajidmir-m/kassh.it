import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, TrendingUp, Shield, Truck, Search, User, MapPin, Plus, DollarSign, CreditCard, Zap, Smartphone, Wifi, Camera, Thermometer, Lock, Speaker, Router, Scale, Refrigerator, ChefHat, Wind, Droplets, Home as HomeIcon, BookOpen, Activity, Sparkles, TreePine, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

type Product = {
  id: string | number;
  name: string;
  description?: string;
  price?: number;
  unit?: string;
  image_url?: string;
  stock?: number;
  categories?: { name?: string };
  vendors?: { business_name?: string };
};

type Category = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
};

// TopNavbar removed; now provided globally

const DeliveryBadge: React.FC = () => {
  return (
    <motion.div
      initial={{ y: -6, opacity: 0 }}
      animate={{ y: [0, -6, 0], opacity: [1, 0.92, 1] }}
      transition={{ repeat: Infinity, duration: 3 }}
      className="inline-flex items-center gap-3 px-4 py-2 rounded-full border shadow"
      style={{
        background: 'linear-gradient(90deg, rgba(16,185,129,0.14), rgba(34,197,94,0.06))',
        borderColor: 'rgba(16,185,129,0.18)',
      }}
    >
      <span className="text-sm font-semibold text-emerald-300">10 Minutes</span>
      <span className="text-xs text-emerald-100/90">delivery in Srinagar</span>
    </motion.div>
  );
};

const HeroPromo: React.FC = () => {
  return (
    <div className="relative w-full rounded-xl overflow-hidden">
      {/* animated blue and purple blobs */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0.18, scale: 1 }}
        animate={{ x: [-30, 20, -10, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute -left-28 -top-20 w-96 h-96 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(59,130,246,0.24), rgba(59,130,246,0.04))' }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0.12 }}
        animate={{ x: [10, -30, 10, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        className="absolute right-0 -bottom-12 w-72 h-72 rounded-full blur-2xl"
        style={{ background: 'radial-gradient(circle at 70% 70%, rgba(147,51,234,0.18), rgba(59,130,246,0.03))' }}
      />

      <div className="relative z-10 bg-gradient-to-r from-blue-600/90 to-green-500/90 border border-blue-500/50 rounded-xl p-8 flex flex-col md:flex-row items-center gap-6 h-56">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-green-100 leading-tight line-clamp-1">Step Towards Technology</h3>
          </div>
          <p className="mt-2 text-green-100 max-w-xl text-lg line-clamp-2">
            Experience the future of shopping with <span className="font-semibold text-green-200">smart IoT devices</span> and <span className="font-semibold text-green-200">technology-driven groceries</span> delivered in just <span className="font-semibold text-green-200">10 minutes</span>!
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link to="/products">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg">
                <Smartphone className="w-5 h-5 mr-2" />
                Explore Now
              </Button>
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm text-green-200">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              <span>Smart Home</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span>Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              <span>Climate Control</span>
            </div>
          </div>
        </div>
        <div className="w-48 h-36 flex items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-blue-100 border border-green-200">
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&h=120&fit=crop&crop=center" 
              alt="Drone delivery technology" 
              className="w-32 h-20 object-cover rounded-lg mb-2"
            />
            <div className="text-green-600 font-bold text-sm">Drone Delivery</div>
            <div className="text-green-500 text-xs">Future Tech</div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Home: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch actual categories from database
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch actual products from database
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, vendors(business_name), categories(name)')
          .eq('is_approved', true)
          .eq('is_active', true)
          .limit(12);
        
        if (error) {
          console.error('Products query error:', error);
          return [];
        }
        return data || [];
      } catch (err) {
        console.error('Products fetch error:', err);
        return [];
      }
    },
  });

  // Add to cart functionality
  const addToCart = async (product: Product) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (!product.id || !product.price) {
      toast.error('Product information is incomplete');
      return;
    }

    try {
      // First check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', String(product.id))
        .single();

      if (existingItem) {
        // Update existing item quantity
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + 1
          })
          .eq('id', existingItem.id);

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }
        toast.success(`${product.name} quantity updated in cart!`);
        setQuantities((q) => ({ ...q, [String(product.id)]: (q[String(product.id)] || 0) + 1 }));
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: String(product.id),
            quantity: 1
          });

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
        toast.success(`${product.name} added to cart!`);
        setQuantities((q) => ({ ...q, [String(product.id)]: (q[String(product.id)] || 0) + 1 }));
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error(`Failed to add item to cart: ${error.message || 'Unknown error'}`);
    }
  };

  const decrementFromCart = async (product: Product) => {
    if (!user) {
      toast.error('Please login to modify cart');
      return;
    }
    if (!product.id) return;
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

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const q = searchText.trim().toLowerCase();
    return products.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const catMatch = p.categories?.name?.toLowerCase().includes(q);
      const categoryFilter = activeCategory === 'all' ? true : p.category_id === activeCategory;
      if (!q) return categoryFilter;
      return (nameMatch || catMatch) && categoryFilter;
    });
  }, [products, searchText, activeCategory]);

  // Select one product per category for the marquee
  const onePerCategoryProducts = useMemo(() => {
    if (!categories || !products) return [] as Product[];
    const seenCategoryIds = new Set<string>();
    const selected: Product[] = [];
    for (const category of categories) {
      const match = products.find((p: any) => String(p.category_id) === String(category.id));
      if (match && !seenCategoryIds.has(String(category.id))) {
        seenCategoryIds.add(String(category.id));
        selected.push(match as Product);
      }
    }
    return selected;
  }, [categories, products]);

  // Pause marquee on hover for better UX
  const [likingsPaused, setLikingsPaused] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-24 relative overflow-hidden">
      {/* Mountains Background - Full Page */}
      <div className="absolute inset-0 pointer-events-none hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/0" />
      </div>

      {/* Snow Falling Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      {/* TopNavbar removed; now provided globally */}

      <main className="container mx-auto px-6 relative z-20">
        {/* category strip */}
        <div className="flex gap-6 overflow-x-auto py-4 hide-scrollbar mb-6">
          <button
            onClick={() => { setActiveCategory('all'); navigate('/products'); }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all duration-200 ${activeCategory === 'all' ? 'bg-amber-200 text-black border border-amber-300' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            All
          </button>
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => { setActiveCategory(category.id); navigate(`/products?category=${category.id}`); }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all duration-200 ${activeCategory === category.id ? 'bg-amber-200 text-black border border-amber-300' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Welcome to Kassh.IT - Full Width Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-blue-600/90 to-green-500/90 border border-blue-500/50 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold text-green-100 mb-4 leading-tight">
                Welcome to <span className="text-green-200">KASSH.IT</span>
              </h2>
              <p className="text-xl lg:text-2xl text-green-100 mb-2 font-semibold">
                The 10 Minutes Delivery in Srinagar
              </p>
              <p className="text-lg text-green-100 mb-6 max-w-2xl">
                Your trusted partner for quality groceries, daily essentials, and smart IoT devices. 
                Experience lightning-fast delivery right to your doorstep in the beautiful city of Srinagar.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-green-200 font-medium">Online & Ready to serve</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-green-200" />
                  <span className="text-green-200 font-medium">Free delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-200" />
                  <span className="text-green-200 font-medium">100% Secure & Safe</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-48 h-36 flex items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-blue-100 border border-green-200">
                <img 
                  src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=120&fit=crop&crop=center" 
                  alt="Quick commerce delivery" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* promo & hero row */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-2">
            <HeroPromo />
          </div>

          <div className="lg:col-span-2">
            {/* Special Offers Card - Updated to match Step Towards Technology style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative w-full rounded-xl overflow-hidden"
            >
              <div className="relative z-10 bg-gradient-to-r from-yellow-600/90 to-pink-500/90 border border-yellow-500/50 rounded-xl p-8 flex flex-col md:flex-row items-center gap-6 h-56">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-yellow-100 leading-tight line-clamp-1">Special Offers</h3>
                  </div>
                  <p className="mt-2 text-yellow-100 max-w-xl text-lg line-clamp-2">
                    Get amazing discounts on <span className="font-semibold text-yellow-200">fresh vegetables</span> and <span className="font-semibold text-yellow-200">dairy products</span> with <span className="font-semibold text-yellow-200">limited time offers</span>!
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <Link to="/products">
                      <Button size="lg" className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white shadow-lg">
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        Shop Now
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-4 flex items-center gap-6 text-sm text-yellow-200">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-200">50% Off</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-200">Fresh Vegetables</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-200">30% Off Dairy</span>
                    </div>
                  </div>
                </div>
                <div className="w-48 h-36 flex items-center justify-center rounded-lg bg-gradient-to-br from-yellow-100 to-pink-100 border border-yellow-200">
                  <div className="text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1542838132-92c852004652?w=200&h=120&fit=crop&crop=center" 
                      alt="Special offers on groceries" 
                      className="w-32 h-20 object-cover rounded-lg mb-2"
                    />
                    <div className="text-yellow-600 font-bold text-sm">Special Offers</div>
                    <div className="text-yellow-500 text-xs">Limited Time</div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>

        {/* Your likings - full width marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8 rounded-2xl border shadow-xl"
          style={{
            background: 'linear-gradient(90deg, rgba(31,41,55,0.6), rgba(17,24,39,0.8), rgba(6,78,59,0.6))',
            borderColor: 'rgba(6,95,70,0.35)'
          }}
        >
          <div className="p-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-emerald-200">Your likings</h3>
            <Link to="/products" className="text-emerald-300 hover:text-emerald-200 text-sm underline">View All</Link>
          </div>
          {/* Keyframes for marquee */}
          <style>{`
            @keyframes likings-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          `}</style>
          <div
            className="relative overflow-hidden pb-4"
            onMouseEnter={() => setLikingsPaused(true)}
            onMouseLeave={() => setLikingsPaused(false)}
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)',
              maskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)'
            }}
          >
            <div
              className="flex gap-4 w-[200%]"
              style={{
                animation: 'likings-scroll 36s linear infinite',
                animationPlayState: likingsPaused ? 'paused' : 'running'
              }}
            >
              {/* track 1 */}
              <div className="flex gap-5 w-1/2">
                {onePerCategoryProducts.map((product: any) => (
                  <Link key={`liking-a-${product.id}`} to={`/products/${product.id}`} className="group">
                    <div className="relative w-[132px] h-[132px] bg-white/90 rounded-2xl overflow-hidden flex items-center justify-center border border-emerald-200/40 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-emerald-500" />
                      )}
                      {/* subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 via-transparent to-transparent pointer-events-none" />
                      {/* category badge */}
                      {product.categories?.name && (
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-700/80 text-emerald-50 border border-emerald-300/30">
                          {product.categories.name}
                        </div>
                      )}
                    </div>
                    <div className="mt-1 w-[132px]">
                      <p className="text-[12px] text-emerald-100 line-clamp-1 text-center">{product.name}</p>
                      <p className="text-[11px] text-emerald-200/90 text-center">₹{product.price ?? '-'}{product.unit ? ` / ${product.unit}` : ''}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {/* track 2 (duplicate for seamless loop) */}
              <div className="flex gap-5 w-1/2">
                {onePerCategoryProducts.map((product: any) => (
                  <Link key={`liking-b-${product.id}`} to={`/products/${product.id}`} className="group">
                    <div className="relative w-[132px] h-[132px] bg-white/90 rounded-2xl overflow-hidden flex items-center justify-center border border-emerald-200/40 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-emerald-500" />
                      )}
                      {/* subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 via-transparent to-transparent pointer-events-none" />
                      {/* category badge */}
                      {product.categories?.name && (
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-700/80 text-emerald-50 border border-emerald-300/30">
                          {product.categories.name}
                        </div>
                      )}
                    </div>
                    <div className="mt-1 w-[132px]">
                      <p className="text-[12px] text-emerald-100 line-clamp-1 text-center">{product.name}</p>
                      <p className="text-[11px] text-emerald-200/90 text-center">₹{product.price ?? '-'}{product.unit ? ` / ${product.unit}` : ''}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Products Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 p-6 rounded-xl bg-white border border-transparent"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-green-900">Trending Products</h3>
            <Link to="/products" className="text-emerald-300 hover:text-emerald-200 text-sm underline">
              View All
            </Link>
                </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-2 sm:gap-3 md:gap-4 place-items-center">
            {products?.slice(0, 6).map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className="relative w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] md:w-[120px] md:h-[120px] bg-stone-50 rounded-lg overflow-hidden flex items-center justify-center transition-all border border-transparent">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="h-5 w-5 text-green-700" />
                  )}
                  {/* minus button top-left when qty>0 */}
                  {quantities[String(product.id)] > 0 && (
                    <button
                      onClick={() => decrementFromCart(product)}
                      className="absolute left-1 top-1 w-7 h-7 sm:w-7 sm:h-7 md:w-6 md:h-6 rounded-full bg-white text-emerald-700 shadow border border-emerald-200/40 flex items-center justify-center text-sm"
                      aria-label="Decrease quantity"
                      title="Remove one"
                    >
                      -
                    </button>
                  )}
                  {/* plus button top-right */}
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute right-1 top-1 w-7 h-7 sm:w-7 sm:h-7 md:w-6 md:h-6 rounded-full bg-white text-emerald-700 shadow border border-emerald-200/40 flex items-center justify-center text-sm"
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
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-green-900">All Categories</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories && categories.length > 0 ? (
              categories.map((category, index) => {
                // Map category names to asset images
                const getCategoryImage = (categoryName: string) => {
                  const name = categoryName.toLowerCase();
                  
                  if (name.includes('dairy') || name.includes('milk')) return '/src/assets/dairy.jpeg';
                  if (name.includes('fruits') || name.includes('vegetables') || name.includes('veg')) return '/src/assets/fruits-and-veg.jpeg';
                  if (name.includes('grocery') || name.includes('food')) return '/src/assets/grocery.jpg';
                  if (name.includes('meat') || name.includes('chicken')) return '/src/assets/meat.jpg';
                  if (name.includes('dairy') || name.includes('milk')) return '/src/assets/dairy.jpeg';
                  if (name.includes('breakfast') || name.includes('cereal')) return '/src/assets/breakfast.jpg';
                  if (name.includes('snacks') || name.includes('chips')) return '/src/assets/chips.jpeg';
                  if (name.includes('biscuits') || name.includes('cookies')) return '/src/assets/buscuits.jpeg';
                  if (name.includes('chocolate') || name.includes('candy') || name.includes('sweets')) return '/src/assets/chocolate & candy.jpeg';
                  if (name.includes('ice cream') || name.includes('dessert')) return '/src/assets/ice-cream.jpeg';
                  if (name.includes('juice') || name.includes('drinks') || name.includes('beverage')) return '/src/assets/juicesandcolddrins.jpeg';
                  if (name.includes('tea') || name.includes('coffee')) return '/src/assets/tea-coffee.jpeg';
                  if (name.includes('dal') || name.includes('aata') || name.includes('flour')) return '/src/assets/dal-aata.jpeg';
                  if (name.includes('masala') || name.includes('spices')) return '/src/assets/masala.jpeg';
                  if (name.includes('soap') || name.includes('detergent') || name.includes('shampoo')) return '/src/assets/soapdetergent&shampo.jpeg';
                  if (name.includes('stationery') || name.includes('office')) return '/src/assets/stationery.jpeg';
                  if (name.includes('kids') || name.includes('baby') || name.includes('child')) return '/src/assets/kidscare.jpeg';
                  if (name.includes('feminine') || name.includes('hygiene')) return '/src/assets/feminine-hygiene.jpeg';
                  if (name.includes('home') || name.includes('essentials')) return '/src/assets/homeessentionals.jpeg';
                  if (name.includes('smart') || name.includes('iot')) return '/src/assets/smart-home.jpeg';
                  if (name.includes('tools') || name.includes('hardware')) return '/src/assets/smalltools.jpeg';
                  if (name.includes('packaged') || name.includes('processed')) return '/src/assets/packaged-food.jpg';
                  
                  // Default fallback
                  return null;
                };

                const categoryImage = getCategoryImage(category.name);
                
                const categoryIcons = {
                  'Smart Home': HomeIcon,
                  'Security': Camera,
                  'Climate': Thermometer,
                  'Lighting': Zap,
                  'Audio': Speaker,
                  'Network': Router,
                  'Kitchen': ChefHat,
                  'Health': Scale,
                  'Storage': Refrigerator,
                  'Water': Droplets,
                  'Air Quality': Wind,
                  'Access': Lock,
                  'Electronics': Smartphone,
                  'Grocery': ShoppingBag,
                  'Fashion': User,
                  'Books': BookOpen,
                  'Sports': Activity,
                  'Beauty': Sparkles,
                  'Home': HomeIcon,
                  'Garden': TreePine,
                  'Tools': Wrench
                };
                
                const iconMap = Object.entries(categoryIcons).find(([key]) => 
                  category.name.toLowerCase().includes(key.toLowerCase())
                );
                
                const IconComponent = iconMap ? iconMap[1] : ShoppingBag;
                const colorClasses = [
                  'from-yellow-500 to-orange-500',
                  'from-orange-500 to-red-500',
                  'from-red-500 to-pink-500',
                  'from-pink-500 to-purple-500',
                  'from-purple-500 to-indigo-500',
                  'from-indigo-500 to-blue-500',
                  'from-blue-500 to-cyan-500',
                  'from-cyan-500 to-teal-500',
                  'from-teal-500 to-green-500',
                  'from-green-500 to-emerald-500'
                ];
                
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/products?category=${category.id}`)}
                  >
                    <div className="text-center">
                      <div className={`w-[120px] h-[120px] bg-gradient-to-br ${colorClasses[index % colorClasses.length]} rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform overflow-hidden`}>
                        {categoryImage ? (
                          <img 
                            src={categoryImage} 
                            alt={category.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <IconComponent className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <p className="text-green-900 text-sm font-medium line-clamp-1 transition-colors">{category.name}</p>
                      <p className="text-green-800 text-xs mt-1">View Products</p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8">
                <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Found</h3>
                <p className="text-gray-400 mb-4">Categories will appear here when available</p>
                <Button 
                  onClick={() => navigate('/categories')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Browse All Categories
                </Button>
              </div>
            )}
          </div>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="relative z-20 bg-white border-t border-transparent">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-extrabold text-yellow-600 tracking-tight">Kassh<span className="text-gray-900">.IT</span></div>
              </div>
              <p className="text-yellow-800 text-sm leading-relaxed">
                Your trusted partner for quality groceries, daily essentials, and smart IoT devices. 
                Experience lightning-fast delivery right to your doorstep in Srinagar.
              </p>
              <div className="flex items-center gap-2 text-yellow-700 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Srinagar, Jammu & Kashmir</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-900">Follow Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-yellow-800 text-sm">Facebook</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-600/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </div>
                  <span className="text-yellow-800 text-sm">Instagram</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <span className="text-yellow-800 text-sm">YouTube</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-700/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <span className="text-yellow-800 text-sm">LinkedIn</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-900">Services</h3>
              <ul className="space-y-2">
                <li className="text-yellow-800 text-sm">10 Minutes Delivery</li>
                <li className="text-yellow-800 text-sm">Free Delivery on ₹500+</li>
                <li className="text-yellow-800 text-sm">24/7 Customer Support</li>
                <li className="text-yellow-800 text-sm">Secure Payment</li>
                <li className="text-yellow-800 text-sm">Quality Guarantee</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-900">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-yellow-800 text-sm">Email</p>
                    <p className="text-yellow-700 text-xs">info@kassit.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-yellow-800 text-sm">Phone</p>
                    <p className="text-yellow-700 text-xs">+91 49559 39393</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-yellow-800 text-sm">Fast Delivery</p>
                    <p className="text-yellow-700 text-xs">10 minutes in Srinagar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-yellow-200 mt-8 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-yellow-700 text-sm">
                © 2024 Kassh.IT. All rights reserved. Made with ❤️ for Srinagar.
              </p>
              <div className="flex items-center gap-4">
                <Link to="/privacy-policy" className="text-yellow-700 hover:text-yellow-800 text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms-conditions" className="text-yellow-700 hover:text-yellow-800 text-sm transition-colors">
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 
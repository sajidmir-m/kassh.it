import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, User, MapPin } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type ProductSuggestion = {
	id: string | number;
	name: string;
	price?: number;
	image_url?: string;
	categories?: { name?: string };
};

const TopNavbar: React.FC = () => {
	const [query, setQuery] = useState('');
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
	const navigate = useNavigate();
	const { user, signOut } = useAuth();

	const { data: searchResults } = useQuery({
		queryKey: ['search-suggestions', query],
		queryFn: async () => {
			if (query.trim().length < 2) return [] as ProductSuggestion[];
			const { data, error } = await supabase
				.from('products')
				.select('*, categories(name)')
				.eq('is_approved', true)
				.eq('is_active', true)
				.ilike('name', `%${query}%`)
				.limit(5);
			if (error) throw error;
			return (data || []) as ProductSuggestion[];
		},
		enabled: query.trim().length >= 2,
	});

	useEffect(() => {
		if (searchResults) {
			setSuggestions(searchResults);
			setShowSuggestions(query.trim().length >= 2 && searchResults.length > 0);
		}
	}, [searchResults, query]);

	const onSearch = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (query.trim()) {
			navigate(`/products?search=${encodeURIComponent(query)}`);
			setShowSuggestions(false);
		}
	};

	const handleSuggestionClick = (product: ProductSuggestion) => {
		navigate(`/products/${product.id}`);
		setQuery('');
		setShowSuggestions(false);
	};

	return (
		<motion.header
			initial={{ y: -30, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-transparent shadow-sm"
		>
			<div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
				<div className="flex items-center gap-2">
					<Link to="/" className="flex items-center gap-2">
						<div className="w-7 h-7 rounded-md bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">K</div>
						<div className="text-xl font-extrabold tracking-tight text-gray-900"><span className="text-amber-600">Kassh</span><span className="text-gray-900">.IT</span></div>
					</Link>
					<div className="hidden sm:flex flex-col text-[13px] ml-2">
						<div className="text-gray-700 font-medium">
							Welcome, <span className="font-semibold">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest'}</span>
						</div>
						<div className="text-gray-500 flex items-center gap-1">
							<MapPin className="w-3 h-3" /> Srinagar, J&K
						</div>
					</div>
				</div>

				<form onSubmit={onSearch} className="flex-1 max-w-xs sm:max-w-md md:max-w-2xl px-2 sm:px-6">
					<div className="relative">
						<Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onFocus={() => setShowSuggestions(query.trim().length >= 2 && suggestions.length > 0)}
							onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
							placeholder="Search for products, brands or categories"
							className="w-full rounded-full py-3 pl-9 pr-4 bg-white/80 border border-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
						/>

						{showSuggestions && suggestions.length > 0 && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="absolute top-full left-0 right-0 mt-2 bg-white/95 border border-transparent rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto p-1"
							>
								{suggestions.map((product) => (
									<div
										key={product.id}
										onClick={() => handleSuggestionClick(product)}
										className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg"
									>
										<div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
											{product.image_url ? (
												<img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
											) : (
												<ShoppingBag className="w-4 h-4 text-gray-400" />
											)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-gray-900 font-semibold truncate">{product.name}</p>
											<p className="text-gray-500 text-xs truncate">{product.categories?.name}</p>
										</div>
										<div className="text-emerald-700 text-sm font-semibold flex-shrink-0">₹{product.price}</div>
									</div>
								))}
							</motion.div>
						)}
					</div>
				</form>

				<div className="hidden xs:flex items-center gap-3 sm:gap-4">
					<Link to="/products" className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
						Products
					</Link>
					{user ? (
						<>
							<button
								onClick={() => (user ? navigate('/profile') : navigate('/auth'))}
								className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
							>
								<User className="w-5 h-5" /> Profile
							</button>
							<button
								onClick={signOut}
								className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
							>
								Logout
							</button>
						</>
					) : (
						<Link to="/auth" className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
							<User className="w-5 h-5" /> Login
						</Link>
					)}
					<Link to="/cart" className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
						<ShoppingBag className="w-5 h-5" /> Cart
					</Link>
				</div>

				{/* Mobile condensed actions */}
				<div className="flex xs:hidden items-center gap-3">
					<Link to="/products" className="text-sm text-gray-700">Products</Link>
					<Link to={user ? '/profile' : '/auth'} className="text-sm text-gray-700">{user ? 'Profile' : 'Login'}</Link>
					<Link to="/cart" className="text-sm text-gray-700">Cart</Link>
				</div>
			</div>
		</motion.header>
	);
};

export default TopNavbar;

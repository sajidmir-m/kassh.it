import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, ArrowRight, Apple, Carrot, Milk, Bread } from "lucide-react";

// Kassh.IT Grocery Store Intro Hero - single-file .tsx React component
// Uses Tailwind CSS and Framer Motion for animations.

const BrandLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 120 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <defs>
      <linearGradient id="g1" x1="0" x2="1">
        <stop offset="0%" stopColor="#16a34a" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <rect width="120" height="30" rx="6" fill="url(#g1)" opacity="0.06" />
    <text
      x="10"
      y="20"
      fontFamily="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue'"
      fontSize="12"
      fontWeight={700}
      fill="url(#g1)"
    >
      Kassh.
      <tspan fill="#0f172a">IT</tspan>
    </text>
  </svg>
);

const FloatingCard: React.FC<{ title: string; subtitle: string; delay?: number; icon: React.ReactNode; className?: string }> = ({
  title,
  subtitle,
  delay = 0,
  icon,
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={`relative backdrop-blur-sm bg-white border rounded-2xl p-4 w-56 shadow-lg ${className}`}
  >
    <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-emerald-400 to-pink-400" />
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-gray-100">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-900 tracking-tight">{title}</div>
        <div className="text-xs text-gray-600 mt-1 leading-relaxed">{subtitle}</div>
      </div>
    </div>
  </motion.div>
);

const Hero: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-gray-100 to-white text-gray-900">
      {/* Background animated blobs */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 overflow-hidden"
      >
        <motion.div
          className="absolute -left-20 -top-28 w-[42rem] h-[42rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "linear-gradient(135deg,#10b981,#34d399)" }}
          animate={{ x: [0, 60, -30, 0], y: [0, -40, 20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute right-0 -bottom-28 w-[36rem] h-[36rem] rounded-full opacity-15 blur-3xl"
          style={{ background: "linear-gradient(135deg,#bbf7d0,#ecfdf5)" }}
          animate={{ x: [0, -40, 30, 0], y: [0, 30, -20, 0], rotate: [0, -8, 8, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <div className="relative max-w-6xl w-full px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <BrandLogo className="w-36 h-auto" />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="flex items-center gap-2 text-xs text-gray-600"
              >
                <Sparkles className="w-4 h-4" />
                <span>Fresh groceries delivered daily</span>
              </motion.div>
            </div>

            <motion.h1
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
              className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900"
            >
              Fresh groceries —
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-green-600">
                delivered to your door.
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-gray-600 max-w-xl"
            >
              Kassh.IT brings you the freshest produce, quality groceries, and daily essentials
              with fast delivery and competitive prices. Shop smart, live better.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-3 items-center"
            >
              <a
                href="/home"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold bg-emerald-600 text-white shadow-lg hover:scale-[1.02] hover:bg-emerald-700 transition-transform"
              >
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/products"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                Browse Products
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              className="mt-6 text-xs text-gray-500"
            >
              <strong className="text-gray-800">Features:</strong> Fresh produce, Fast delivery,
              Best prices, Quality guarantee
            </motion.div>
          </div>

          {/* Right: Visual/Illustration + floating cards */}
          <div className="relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="w-full max-w-md p-8 rounded-3xl bg-white border border-emerald-100 shadow-2xl"
            >
              <div className="rounded-xl p-6 bg-emerald-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-emerald-800 font-semibold">Kassh.IT Grocery</div>
                    <div className="text-xs text-emerald-700/70 mt-1">Your shopping dashboard</div>
                  </div>
                  <div className="text-xs text-emerald-700/70">Fresh</div>
                </div>

                {/* Featured Product Image */}
                <div className="mt-4 relative">
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                      alt="Fresh Groceries" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent" />
                    <div className="absolute bottom-2 left-2 text-white text-xs font-semibold">Fresh Daily</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-white border border-emerald-100">
                    <div className="text-xs font-semibold text-emerald-800">Fruits</div>
                    <div className="text-sm text-emerald-700/80 mt-2">Fresh & organic</div>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-emerald-100">
                    <div className="text-xs font-semibold text-emerald-800">Vegetables</div>
                    <div className="text-sm text-emerald-700/80 mt-2">Daily delivery</div>
                  </div>

                  <div className="p-3 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                      <div className="text-xs font-semibold text-pink-800">Special Offers</div>
                    </div>
                    <div className="text-sm text-pink-700/80 mt-2 font-medium">🎉 20% off dairy products</div>
                    <div className="text-xs text-pink-600/70 mt-1">Limited time offer!</div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 items-center">
                  <button className="flex-1 rounded-full py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                    Shop Now
                  </button>
                  <button className="px-3 py-2 rounded-full text-sm border border-emerald-200 text-emerald-800 bg-white hover:bg-emerald-50 transition-colors">Cart</button>
                </div>
              </div>
            </motion.div>

            {/* Floating cards around the mock (large screens pinned to corners) */}
            <div className="hidden lg:block">
              {/* Top Left */}
              <div className="lg:absolute lg:top-0 lg:left-0 lg:-translate-x-6 lg:-translate-y-6">
                <FloatingCard
                  title="Fresh"
                  subtitle="Daily delivery"
                  delay={0.9}
                  icon={<Apple className="w-6 h-6 text-emerald-600" />}
                  className="border-emerald-200"
                />
              </div>

              {/* Top Right */}
              <div className="lg:absolute lg:top-0 lg:right-0 lg:translate-x-6 lg:-translate-y-6">
                <FloatingCard
                  title="Quality"
                  subtitle="Premium products"
                  delay={1.05}
                  icon={<Carrot className="w-6 h-6 text-pink-600" />}
                  className="border-pink-200"
                />
              </div>

              {/* Bottom Left */}
              <div className="lg:absolute lg:bottom-0 lg:left-0 lg:-translate-x-6 lg:translate-y-6">
                <FloatingCard
                  title="Fast"
                  subtitle="Quick delivery"
                  delay={1.2}
                  icon={<Milk className="w-6 h-6 text-emerald-600" />}
                  className="border-emerald-200"
                />
              </div>
            </div>

            {/* Mobile/Tablet layout for feature cards to avoid overlap */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:hidden">
              <FloatingCard
                title="Fresh"
                subtitle="Daily delivery"
                delay={0.1}
                icon={<Apple className="w-6 h-6 text-emerald-600" />}
                className="border-emerald-200 w-full"
              />
              <FloatingCard
                title="Quality"
                subtitle="Premium products"
                delay={0.2}
                icon={<Carrot className="w-6 h-6 text-pink-600" />}
                className="border-pink-200 w-full"
              />
              <FloatingCard
                title="Fast"
                subtitle="Quick delivery"
                delay={0.3}
                icon={<Milk className="w-6 h-6 text-emerald-600" />}
                className="border-emerald-200 w-full"
              />
            </div>
          </div>
        </div>

        {/* Footer / small CTA */}
        <div className="mt-16 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="text-sm text-slate-400"
          >
            Ready to shop? <a href="/home" className="underline">Start your order now</a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

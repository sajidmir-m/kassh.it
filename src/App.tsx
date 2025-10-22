import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { NamespaceBoundary } from "@/lib/NamespaceBoundary";
import TopNavbar from "@/components/TopNavbar";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import MyProfile from "./pages/profile/MyProfile";
import YourOrders from "./pages/profile/YourOrders";
import YourAddresses from "./pages/profile/YourAddresses";
import Policy from "./pages/profile/Policy";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/admin/Dashboard";
import VendorDashboard from "./pages/vendor/Dashboard";
import DeliveryDashboard from "./pages/delivery/Dashboard";
import DeliveryRegister from "./pages/delivery/Register";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NamespaceBoundary />
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/home" element={<><TopNavbar /><div className="pt-24"><Home /></div></>} />
            <Route path="/auth" element={<><TopNavbar /><div className="pt-24"><Auth /></div></>} />
            <Route path="/admin/auth" element={<><TopNavbar /><div className="pt-24"><Auth /></div></>} />
            <Route path="/vendor/auth" element={<><TopNavbar /><div className="pt-24"><Auth /></div></>} />
            <Route path="/products" element={<><TopNavbar /><div className="pt-24"><Products /></div></>} />
            <Route path="/products/:id" element={<><TopNavbar /><div className="pt-24"><ProductDetail /></div></>} />
            <Route path="/categories" element={<><TopNavbar /><div className="pt-24"><Categories /></div></>} />
            <Route path="/cart" element={<><TopNavbar /><div className="pt-24"><Cart /></div></>} />
            <Route path="/checkout" element={<><TopNavbar /><div className="pt-24"><Checkout /></div></>} />
            <Route path="/profile" element={<><TopNavbar /><div className="pt-24"><Profile /></div></>} />
            <Route path="/profile/my-profile" element={<><TopNavbar /><div className="pt-24"><MyProfile /></div></>} />
            <Route path="/profile/orders" element={<><TopNavbar /><div className="pt-24"><YourOrders /></div></>} />
            <Route path="/profile/addresses" element={<><TopNavbar /><div className="pt-24"><YourAddresses /></div></>} />
            <Route path="/profile/policy" element={<><TopNavbar /><div className="pt-24"><Policy /></div></>} />
            <Route path="/orders" element={<><TopNavbar /><div className="pt-24"><Orders /></div></>} />
            <Route path="/admin/*" element={<><TopNavbar /><div className="pt-24"><AdminDashboard /></div></>} />
            <Route path="/vendor/*" element={<><TopNavbar /><div className="pt-24"><VendorDashboard /></div></>} />
            <Route path="/delivery/*" element={<><TopNavbar /><div className="pt-24"><DeliveryDashboard /></div></>} />
            <Route path="/delivery/register" element={<><TopNavbar /><div className="pt-24"><DeliveryRegister /></div></>} />
            <Route path="/privacy-policy" element={<><TopNavbar /><div className="pt-24"><PrivacyPolicy /></div></>} />
            <Route path="/terms-conditions" element={<><TopNavbar /><div className="pt-24"><TermsConditions /></div></>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<><TopNavbar /><div className="pt-24"><NotFound /></div></>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Layout } from "@/components/Layout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Home } from "@/pages/Home";
import { Categories } from "@/pages/Categories";
import { Deals } from "@/pages/Deals";
import { Help } from "@/pages/Help";
import { ProductDetail } from "@/pages/ProductDetail";
import { SignUp } from "@/pages/SignUp";
import { Login } from "@/pages/Login";
import { Cart } from "@/pages/Cart";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Account } from "@/pages/Account";
import { Wishlist } from "@/pages/Wishlist";
import { Products } from "@/pages/Products";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { FAQ } from "@/pages/FAQ";
import { AddressBook } from "@/pages/AddressBook";
import { Cancellations } from "@/pages/Cancellations";
import { PaymentOptions } from "@/pages/PaymentOptions";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { ProductManagement } from "@/pages/admin/ProductManagement";
import { UserActivityPage } from "@/pages/admin/UserActivity";
import { AddProduct } from "@/pages/admin/AddProduct";
import { AddCategory } from "@/pages/admin/AddCategory";
import { Orders } from "@/pages/admin/Orders";
import { Users } from "@/pages/admin/Users";
import { Analytics } from "@/pages/admin/Analytics";
import { Settings } from "@/pages/admin/Settings";
import { AddUser } from "@/pages/admin/AddUser";
import { EditProduct } from "@/pages/admin/EditProduct";
import { ViewOrder } from "@/pages/admin/ViewOrder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Store Routes */}
            <Route path="/dashboard" element={
              <Layout>
                <Home />
              </Layout>
            } />
            <Route path="/categories" element={
              <Layout>
                <Categories />
              </Layout>
            } />
            <Route path="/deals" element={
              <Layout>
                <Deals />
              </Layout>
            } />
            <Route path="/help" element={
              <Layout>
                <Help />
              </Layout>
            } />
            <Route path="/product/:productId" element={
              <Layout>
                <ProductDetail />
              </Layout>
            } />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={
              <Layout>
                <Cart />
              </Layout>
            } />
            <Route path="/about" element={
              <Layout>
                <About />
              </Layout>
            } />
            <Route path="/contact" element={
              <Layout>
                <Contact />
              </Layout>
            } />
            <Route path="/account" element={
              <Layout>
                <Account />
              </Layout>
            } />
            <Route path="/wishlist" element={
              <Layout>
                <Wishlist />
              </Layout>
            } />
            <Route path="/products" element={
              <Layout>
                <Products />
              </Layout>
            } />
            <Route path="/privacy" element={
              <Layout>
                <Privacy />
              </Layout>
            } />
            <Route path="/terms" element={
              <Layout>
                <Terms />
              </Layout>
            } />
            <Route path="/faq" element={
              <Layout>
                <FAQ />
              </Layout>
            } />
            <Route path="/account/address" element={
              <Layout>
                <AddressBook />
              </Layout>
            } />
            <Route path="/account/cancellations" element={
              <Layout>
                <Cancellations />
              </Layout>
            } />
            <Route path="/account/payment" element={
              <Layout>
                <PaymentOptions />
              </Layout>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <Layout>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </Layout>
            } />
            <Route path="/admin/category/new" element={
              <Layout>
                <AdminLayout>
                  <AddCategory />
                </AdminLayout>
              </Layout>
            } />
            <Route path="/admin/products" element={
              <Layout>
                <AdminLayout>
                  <ProductManagement />
                </AdminLayout>
              </Layout>
            } />
            <Route path="/admin/products/new" element={
              <Layout>
                <AdminLayout>
                  <AddProduct />
                </AdminLayout>
              </Layout>
            } />

            <Route path="/admin/products/edit/:productId" element={
              <Layout>
                <AdminLayout>
                  <EditProduct />
                </AdminLayout>
              </Layout>
            } />
            <Route path="/admin/users/new" element={
              <Layout>
                <AdminLayout>
                  <AddUser />
                </AdminLayout>
              </Layout>
            } />
            <Route path="/admin/orders/:orderId" element={
              <Layout>
                <AdminLayout>
                  <ViewOrder />
                </AdminLayout>
              </Layout>
            } />
            <Route path="/admin/activities" element={
              <Layout>
                <AdminLayout>
                  <UserActivityPage />
                </AdminLayout>
              </Layout>
            } />
            <Route path="/admin/orders" element={
              <Layout>
                <AdminLayout>
                  <Orders />
                </AdminLayout>
              </Layout>
            } />
            <Route path="/admin/users" element={
              <Layout>
                <AdminLayout>
                  <Users />
                </AdminLayout>
              </Layout>
            } />
            <Route path="/admin/analytics" element={
              <Layout>
                <AdminLayout>
                  <Analytics />
                </AdminLayout>
              </Layout>
            } />
            <Route path="/admin/settings" element={
              <Layout>
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              </Layout>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={
              <Layout>
                <NotFound />
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

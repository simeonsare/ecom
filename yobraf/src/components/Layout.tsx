import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, ShoppingCart, Search, User, Heart, LogIn, LogOut, ShoppingBasket } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SignUp } from '@/pages/SignUp';

interface LayoutProps {
  children: React.ReactNode;
}

const token = localStorage.getItem("authToken") || "";

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const [cartCount, setCartCount] = useState<number>(0);
    useEffect(() => {
      fetch("/api/get_cart/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCartCount(data.count || 0);
        })
        .catch(console.error);
    }, [token]);


  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 text-sm">
        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50!{" "}
        <Link to="/deals" className="underline font-medium ml-2">ShopNow</Link>
      </div>
      
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link to="/" className="text-2xl font-bold">
            Exclusive
          </Link>
          
          {!isAdmin && (
            <nav className="flex-1 flex justify-center">
              <div className="hidden md:flex items-center gap-8">
                <Link to="/" className="hover:underline">Home</Link>
                <Link to="/contact" className="hover:underline">Contact</Link>
                <Link to="/about" className="hover:underline">About</Link>
              </div>
            </nav>
          )}

          <div className="flex items-center gap-4">
                {!isAdmin && !!token ? (
                  <>
                    {/* Search Input */}
                    <div className="relative">
                      <Input
                        placeholder="What are you looking for?"
                        className="w-60 pr-10"
                      />
                      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>

                    {/* Wishlist Button */}
                    <Button variant="ghost" size="icon" asChild>
                      <Link to="/myorders">
                        <ShoppingBasket className="h-5 w-5" />
                      </Link>
                    </Button>

                    {/* Cart Button with Badge */}
                    <Button variant="ghost" size="icon" className="relative" asChild>
                      <Link to="/cart">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      </Link>
                    </Button>

                    {/* Logout Button */}
                    <Button variant="ghost" size="icon" asChild>
                      <Link to="/logout">
                        <LogOut className="h-5 w-5" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  !isAdmin && (
                    <>
                      {/* Login Button */}
                      <Button variant="ghost" size="icon" asChild>
                        <Link to="/login" className="flex items-center gap-2">
                          <LogIn className="h-5 w-5" />
                          <span>Login |</span>
                        </Link>
                      </Button>

                      {/* Sign-up Button */}
                      <Button variant="ghost" size="icon" asChild>
                        <Link to="/sign-up">
                          <span>| Sign-up</span>
                        </Link>
                      </Button>
                    </>
                  )
                )}
              </div>

            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-black text-white mt-auto">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Exclusive</h3>
              <h4 className="font-medium mb-4">Subscribe</h4>
              <p className="text-sm text-gray-300 mb-4">Get 10% off your first order</p>
              <div className="flex">
                <Input
                  placeholder="Enter your email"
                  className="bg-transparent border-white text-white placeholder:text-gray-300"
                />
                <Button variant="ghost" size="icon" className="ml-2">
                  →
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Support</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>111 Bijoy sarani, Dhaka,<br />DH 1515, Bangladesh.</p>
                <p>exclusive@gmail.com</p>
                <p>+88015-88888-9999</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/account" className="hover:text-white">My Account</Link></li>
                <li><Link to="/login" className="hover:text-white">Login / Register</Link></li>
                <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
                <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
                <li><Link to="/" className="hover:text-white">Shop</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Quick Link</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms Of Use</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Download App</h3>
              <p className="text-xs text-gray-300 mb-4">Save $3 with App New User Only</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-800 p-2 rounded text-xs text-center">
                  QR Code
                </div>
                <div className="space-y-1">
                  <div className="bg-gray-800 p-1 rounded text-xs text-center">Google Play</div>
                  <div className="bg-gray-800 p-1 rounded text-xs text-center">App Store</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; Copyright Rimel 2022. All right reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
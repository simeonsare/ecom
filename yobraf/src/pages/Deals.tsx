import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/ProductGrid';
import { Product } from '@/types/product';
import { Zap, Clock, Flame, TrendingUp } from 'lucide-react';

export const Deals: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Mock countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [products, setproducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/getProducts/")
      .then(res => res.json())
      .then(data => setproducts(data))
      .catch(() => setproducts([]));
  }, []);

  const todaysDeals = products.filter(p => p.isTodaysDeals);
  const flashDeals = products.filter(p => p.discount && p.discount > 10);
  const dailyDeals = products.filter(p => p.discount && p.discount > 5).slice(0, 6);
  const weeklyDeals = products.filter(p => p.tags.includes('featured')).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-accent text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="h-8 w-8" />
            <h1 className="text-4xl md:text-6xl font-bold">Hot Deals</h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Limited time offers you can't miss!
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
              <div className="text-sm">Hours</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
              <div className="text-sm">Minutes</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
              <div className="text-sm">Seconds</div>
            </div>
          </div>
          <Badge className="bg-white/20 text-white text-lg px-4 py-2">
            <Clock className="h-4 w-4 mr-2" />
            Flash Sale Ends Soon!
          </Badge>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Today's Deals */}
        {todaysDeals.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-6 w-6 text-accent" />
              <h2 className="text-3xl font-bold">Today's Deals</h2>
              <Badge className="gradient-primary">Handpicked for You</Badge>
            </div>
            <ProductGrid products={todaysDeals} />
          </section>
        )}

        {/* Flash Deals */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-bold">Flash Deals</h2>
            <Badge className="gradient-accent animate-pulse">Up to 50% OFF</Badge>
          </div>
          <ProductGrid products={flashDeals} />
        </section>

        {/* Deal Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Deal Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="gradient-card hover:shadow-lg transition-normal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  Daily Deals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">New deals every day with up to 30% savings</p>
                <div className="space-y-2">
                  {dailyDeals.slice(0, 3).map(product => (
                    <div key={product.id} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1 mr-2">{product.name}</span>
                      <Badge variant="outline">{product.discount}% OFF</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card hover:shadow-lg transition-normal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-destructive" />
                  Hot Deals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Most popular items at unbeatable prices</p>
                <div className="space-y-2">
                  {flashDeals.slice(0, 3).map(product => (
                    <div key={product.id} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1 mr-2">{product.name}</span>
                      <Badge className="bg-destructive hover:bg-destructive">{product.discount}% OFF</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card hover:shadow-lg transition-normal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Weekly Special
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Curated weekly selections</p>
                <div className="space-y-2">
                  {weeklyDeals.slice(0, 3).map(product => (
                    <div key={product.id} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1 mr-2">{product.name}</span>
                      <Badge variant="outline">Featured</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Daily Deals */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Today's Best Deals</h2>
            <Button variant="outline">View All Deals</Button>
          </div>
          <ProductGrid products={dailyDeals} />
        </section>

        {/* Deal Newsletter */}
        <section className="mb-12">
          <Card className="gradient-primary text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Never Miss a Deal!</h3>
              <p className="text-white/90 mb-6">
                Subscribe to get notified about flash sales, exclusive offers, and daily deals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md text-foreground"
                />
                <Button variant="secondary">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};
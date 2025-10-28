import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Ship } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

const token = localStorage.getItem("authToken") || "";

export const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetch("/api/get_cart/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data: CartItem[]) => setCartItems(data.data))
      
    
      .catch(console.error);
  }, []);

  // Update quantity handler
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item handler
  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };


  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );
  const total = subtotal;

const handleOrderSubmit = async () => {
  // Ensure cartItems is an array of item objects
  const payload = {
    items: cartItems.map(item => ({
      product_id: item.product.id, // use the runtime product id from the cart item
      quantity: item.quantity,
      // add other relevant item details if needed
    })),
    total: total.toFixed(2),
    subtotal: subtotal.toFixed(2),
    ...userDetails,
  };

  const res = await fetch("/api/create_order/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    alert("✅ Order placed successfully! You will be contacted shortly via WhatsApp.");
    setShowCheckout(false);
  } else {
    alert("❌ Failed to create order. Please try again.");
  }
};


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span>Cart</span>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 font-medium py-4 border-b mb-6">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
          </div>

          <div className="space-y-4 mb-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-4 gap-4 items-center py-4 border rounded-lg px-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="font-medium">{item.product.name}</span>
                </div>

                <span>ksh {item.product.price}</span>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded w-20">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="flex-1 text-center text-sm">
                      {item.quantity.toString().padStart(2, "0")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <span className="font-medium">
                  ksh {parseFloat(item.product.price) * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to="/">Return To Shop</Link>
            </Button>
            <Button variant="outline">Update Cart</Button>
          </div>

          {/* Coupon */}
          <div className="flex gap-4 mt-8 max-w-md">
            <Input
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button className="bg-destructive hover:bg-destructive/90">
              Apply Coupon
            </Button>
          </div>
        </div>

        {/* Cart Total */}
        <div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-medium mb-6">Cart Total</h3>

            <div className="space-y-4">
              <div className="flex justify-between pb-2">
                <span>Subtotal:</span>
                <span>ksh {subtotal.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between pb-2">
                <span>Shipping:</span>
                <span>Free within nairobi</span>
              </div>

              <Separator />

              <div className="flex justify-between font-medium text-lg py-2">
                <span>Total:</span>
                <span>ksh {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Button
            className="w-full bg-destructive hover:bg-destructive/90 mt-6"
            onClick={() => setShowCheckout(true)}
          >
            Proceed to checkout
          </Button>

          {/* Checkout Modal */}
          <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Your Order</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label>Phone (for WhatsApp)</Label>
                  <Input
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                    placeholder="e.g. +2547XXXXXXXX"
                  />
                </div>
                <div>
                  <Label>Delivery Address</Label>
                  <Input
                    value={userDetails.address}
                    onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCheckout(false)}>
                  Cancel
                </Button>
                <Button onClick={handleOrderSubmit} className="bg-destructive hover:bg-destructive/90">
                  Confirm Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      </div>
    </div>
  );
};

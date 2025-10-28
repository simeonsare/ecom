import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Package, Truck, Clock, ShoppingBag } from "lucide-react";

// --- Interfaces based on the provided JSON structure ---
interface Product {
  id: number;
  name: string;
  price: string;
  image: string | null; // Image can be null in the response
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: string; // Price at the time of order
}

interface Order {
  id: number;
  order_number: string;
  total: string;
  created_at: string;
  status: string; // 'pending', 'processing', 'delivered', etc.
  items: OrderItem[];
}

const token = localStorage.getItem("authToken") || "";

export const Orderss = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- Utility Functions ---

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-700 bg-green-200/50";
      case "shipped":
      case "processing":
        return "text-blue-700 bg-blue-200/50";
      case "cancelled":
        return "text-red-700 bg-red-200/50";
      case "pending":
      default:
        return "text-yellow-700 bg-yellow-200/50";
    }
  };

  // --- Data Fetching ---

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/getOrders/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Failed to fetch orders`);
        }

        const data: Order[] = await res.json();

        // ✅ Sort newest to oldest
        const sortedOrders = data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );

        setOrders(sortedOrders);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setError(
          "Failed to load your past orders. Please try refreshing the page."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Your Order History</h1>
        <p className="text-lg">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Your Order History</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span>Orders</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Your Order History</h1>

      {orders.length === 0 ? (
        // --- Empty Orders View ---
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Orders Found</h2>
          <p className="text-muted-foreground mb-6">
            Time to place your first order and see it here!
          </p>
          <Button asChild className="bg-destructive hover:bg-destructive/90">
            <Link to="/">Shop Now</Link>
          </Button>
        </div>
      ) : (
        // --- Orders List View ---
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Order No.
                  </span>
                  <span className="font-semibold text-lg text-destructive">
                    {order.order_number}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Date Placed
                  </span>
                  <span className="text-sm">{formatDate(order.created_at)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="font-bold text-lg">
                    ksh {parseFloat(order.total).toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full text-center capitalize ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-end col-span-2 md:col-span-1">
                  <Button variant="outline" onClick={() => setSelectedOrder(order)}>
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Order Detail Modal --- */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Order Details: {selectedOrder?.order_number}
            </DialogTitle>
            <DialogDescription>
              Placed on{" "}
              {selectedOrder ? formatDate(selectedOrder.created_at) : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
            {/* Summary Box */}
            <div className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg border">
              <div className="flex flex-col items-start">
                <Truck className="h-5 w-5 text-destructive mb-1" />
                <span className="text-sm text-muted-foreground">Status</span>
                <span
                  className={`font-bold capitalize ${getStatusColor(
                    selectedOrder?.status || "pending"
                  )}`}
                >
                  {selectedOrder?.status}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <Clock className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-sm text-muted-foreground">
                  Order Total
                </span>
                <span className="font-bold text-lg">
                  ksh {parseFloat(selectedOrder?.total || "0").toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <Package className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-sm text-muted-foreground">
                  Number of Items
                </span>
                <span className="font-bold text-lg">
                  {selectedOrder?.items.length}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold border-b pb-2">
              Items Ordered
            </h3>
            <div className="space-y-4">
              {selectedOrder?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border rounded-lg p-3 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Price: ksh {parseFloat(item.product.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-md">
                      Subtotal: ksh{" "}
                      {(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      variant="link"
                      className="text-sm text-red-500 p-0 h-auto"
                      asChild
                    >
                      <Link to={`/product/${item.product.id}`}>Re-order</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

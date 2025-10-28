import { toast } from "@/components/ui/use-toast";

const token = localStorage.getItem('authToken');


export function handleAddToCart(productId: number, name: string ) {
  fetch(`http://localhost:8000/api/add_to_cart/`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                  },
                  credentials: "include", 
                  body: JSON.stringify({
                    product_id: productId, // make sure your backend expects this key
                    quantity: 1,
                  }),
                })
                  .then((res) => {
                    if (!res.ok) {
                      throw new Error("Failed to add to cart");
                    }
                    return res.json();
                  })
                  .then((data) => {
                    toast({
                      title: "Added to Cart",
                      description: `${name} has been added to your cart.`,
                    });
                  })
                  .catch((err) => {
                    console.error(err);
                    toast({
                      title: "Error",
                      description: "Could not add product to cart. Check if you're logged in and refresh the page.",
                      variant: "destructive",
                    });
                  });
                }

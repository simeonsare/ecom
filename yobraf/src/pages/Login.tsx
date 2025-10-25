import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", //  allow cookies
        body: JSON.stringify(formData),
      });

      if (!res.ok) {

        toast.error("Invalid credentials");
        throw new Error("Invalid credentials");
      }


      
// implement role based redirection     
  // Save user data in context or global store here     
      const data = await res.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("isAdmin", JSON.stringify(data.user.is_superuser));

      
      if (data.user.is_superuser=== false){
        navigate("/dashboard");
        window.location.reload();
      }
      else{

        navigate("/admin");
      }}
       catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-100 to-blue-200 items-center justify-center p-12">
        <div className="relative w-full max-w-md">
          <div className="aspect-square bg-white/10 rounded-3xl p-8 flex items-center justify-center backdrop-blur-sm">
            <div className="relative">
              <div className="w-64 h-64 bg-gradient-to-br from-pink-200 to-pink-400 rounded-3xl flex items-center justify-center text-8xl shadow-lg">
                📱
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-16 bg-gradient-to-br from-purple-300 to-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                🛍️
              </div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                🛒
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-left">
            <h1 className="text-4xl font-medium mb-4">Log in to Exclusive</h1>
            <p className="text-gray-600">Enter your details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Email or Phone Number"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 focus:border-gray-600 focus:ring-0"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 focus:border-gray-600 focus:ring-0"
              />
            </div>

            <div className="flex justify-between items-center">
              <Button type="submit" className="bg-destructive hover:bg-destructive/90 px-8">
                Log In
              </Button>
              <div>
                <Link to="/forgot-password" className="text-destructive hover:underline text-sm">
                Forget Password? 
              </Link> 
              
              <Link to="/sign-up" className="text-destructive hover:underline text-sm">
                 <br /> No account? Sign Up
              </Link>  
              </div>
                         
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};


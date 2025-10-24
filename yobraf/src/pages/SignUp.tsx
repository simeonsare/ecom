import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";



const token = localStorage.getItem("authToken");
console.log("Auth Token in SignUp:", token);

export const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting form data:", formData);
      console.log("Current cookies:", document.cookie);


      // Step 3: Send registration request with CSRF token
      const res = await fetch("/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // include cookies in request
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      toast.success("Account created successfully! Please log in.", {
        position: "top-center",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); // 2-second delay

      console.log("Sign up successful:", data);

    } catch (error) {
      console.error("Error during sign up:", error);
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
            <h1 className="text-4xl font-medium mb-4">Create an account</h1>
            <p className="text-gray-600">Enter your details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 focus:border-gray-600 focus:ring-0"
              />
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email or Phone Number"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 focus:border-gray-600 focus:ring-0"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 focus:border-gray-600 focus:ring-0"
              />
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-destructive hover:bg-destructive/90 h-12 rounded"
              >
                Create Account
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded border-gray-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </Button>
            </div>
          </form>

          <p className="text-center text-gray-600">
            Already have account?{" "}
            <Link to="/login" className="underline hover:no-underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

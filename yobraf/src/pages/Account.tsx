import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


export const Account = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const res = fetch("/api/profile/", {
      method: "GET",
      credentials: "include", // if using session auth
      headers: {
        "Content-Type": "application/json",
       ' Authorization': `Token ${localStorage.getItem("authToken")}`,
      }
    })
    .then(res => res.json())
      .then(data => {
        setProfileData(prev => ({
          ...prev,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
        }));
      })
      .catch(err => console.error("Failed to fetch profile:", err));
  }, []);


  const handleSave = () => {
    // Handle save profile
    console.log("Save profile:", profileData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb & Welcome */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span>My Account</span>
        </div>
        <div className="text-sm">
          Welcome! <span className="text-destructive">{profileData.firstName}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-4">Manage My Account</h3>
            <div className="space-y-2 text-sm">
              <Link to="/account" className="block text-destructive hover:underline">My Profile</Link>
              <Link to="/account/address" className="block text-muted-foreground hover:text-foreground">Address Book</Link>
              <Link to="/account/payment" className="block text-muted-foreground hover:text-foreground">My Payment Options</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">My Orders</h3>
            <div className="space-y-2 text-sm">
              <Link to="/account/returns" className="block text-muted-foreground hover:text-foreground">My Returns</Link>
              <Link to="/account/cancellations" className="block text-muted-foreground hover:text-foreground">My Cancellations</Link>
            </div>
          </div>

          <div>
            <Link to="/wishlist" className="font-bold text-muted-foreground hover:text-foreground">My Wishlist</Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-destructive mb-6">Edit Your Profile</h2>

              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Email & Address */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <Input
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                {/* Password Changes */}
                <div>
                  <h3 className="font-medium mb-4">Password Changes</h3>
                  <div className="space-y-4">
                    <Input
                      type="password"
                      placeholder="Current Password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                    />
                    <Input
                      type="password"
                      placeholder="New Password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                    />
                    <Input
                      type="password"
                      placeholder="Confirm New Password"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <Button variant="outline">Cancel</Button>
                  <Button 
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
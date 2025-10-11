import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Edit, Trash2, Home, Building, User } from 'lucide-react';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  title: string;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export const AddressBook: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      title: 'Home Address',
      firstName: 'John',
      lastName: 'Doe',
      street: '123 Main Street',
      street2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      title: 'Office Address',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Tech Corp Inc.',
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      isDefault: false
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    type: 'home',
    country: 'United States'
  });

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({ type: 'home', country: 'United States' });
    setIsDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setIsDialogOpen(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSaveAddress = () => {
    if (!formData.firstName || !formData.lastName || !formData.street || !formData.city || !formData.state || !formData.zipCode) {
      return;
    }

    const newAddress: Address = {
      id: editingAddress?.id || Date.now().toString(),
      type: formData.type as 'home' | 'work' | 'other',
      title: formData.title || `${formData.type} Address`,
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      company: formData.company,
      street: formData.street!,
      street2: formData.street2,
      city: formData.city!,
      state: formData.state!,
      zipCode: formData.zipCode!,
      country: formData.country!,
      phone: formData.phone,
      isDefault: formData.isDefault || false
    };

    if (editingAddress) {
      setAddresses(addresses.map(addr => addr.id === editingAddress.id ? newAddress : addr));
    } else {
      setAddresses([...addresses, newAddress]);
    }

    setIsDialogOpen(false);
    setFormData({ type: 'home', country: 'United States' });
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return Home;
      case 'work': return Building;
      default: return MapPin;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/account" className="hover:text-foreground">Account</Link>
          <span>/</span>
          <span>Address Book</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Address Book</h1>
              <p className="text-muted-foreground">Manage your shipping and billing addresses</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddAddress} className="gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Address Type</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as 'home' | 'work' | 'other'})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="title">Address Title</Label>
                      <Input
                        value={formData.title || ''}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g., Home, Office, Mom's House"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        value={formData.firstName || ''}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        value={formData.lastName || ''}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      value={formData.company || ''}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      value={formData.street || ''}
                      onChange={(e) => setFormData({...formData, street: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="street2">Apt, Suite, Unit (Optional)</Label>
                    <Input
                      value={formData.street2 || ''}
                      onChange={(e) => setFormData({...formData, street2: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        value={formData.city || ''}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        value={formData.state || ''}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        value={formData.zipCode || ''}
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={formData.isDefault || false}
                      onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="isDefault">Make this my default address</Label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSaveAddress} className="flex-1">
                      {editingAddress ? 'Update Address' : 'Save Address'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Addresses List */}
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No addresses saved</h3>
                  <p className="text-muted-foreground mb-6">Add your first address to get started</p>
                  <Button onClick={handleAddAddress} className="gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </CardContent>
              </Card>
            ) : (
              addresses.map((address) => {
                const IconComponent = getAddressIcon(address.type);
                
                return (
                  <Card key={address.id} className={address.isDefault ? 'border-primary' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{address.title}</CardTitle>
                          {address.isDefault && (
                            <Badge className="bg-primary/10 text-primary">Default</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-muted-foreground">
                        <p className="font-medium text-foreground">
                          {address.firstName} {address.lastName}
                        </p>
                        {address.company && <p>{address.company}</p>}
                        <p>{address.street}</p>
                        {address.street2 && <p>{address.street2}</p>}
                        <p>
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p>{address.country}</p>
                        {address.phone && <p>{address.phone}</p>}
                      </div>
                      
                      {!address.isDefault && (
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            Set as Default
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Back to Account */}
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link to="/account">
                <User className="h-4 w-4 mr-2" />
                Back to Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
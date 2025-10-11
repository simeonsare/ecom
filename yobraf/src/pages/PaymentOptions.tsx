import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, CreditCard, Edit, Trash2, User, Shield, Calendar } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal' | 'apple_pay' | 'google_pay';
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: string; // visa, mastercard, amex, etc.
  isDefault: boolean;
  nickname?: string;
}

export const PaymentOptions: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'credit',
      cardNumber: '**** **** **** 1234',
      cardholderName: 'John Doe',
      expiryMonth: '12',
      expiryYear: '2027',
      cardType: 'visa',
      isDefault: true,
      nickname: 'Personal Visa'
    },
    {
      id: '2',
      type: 'credit',
      cardNumber: '**** **** **** 5678',
      cardholderName: 'John Doe',
      expiryMonth: '08',
      expiryYear: '2026',
      cardType: 'mastercard',
      isDefault: false,
      nickname: 'Work Card'
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<Partial<PaymentMethod>>({
    type: 'credit'
  });

  const handleAddPaymentMethod = () => {
    setEditingMethod(null);
    setFormData({ type: 'credit' });
    setIsDialogOpen(true);
  };

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData(method);
    setIsDialogOpen(true);
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleSavePaymentMethod = () => {
    if (!formData.cardNumber || !formData.cardholderName || !formData.expiryMonth || !formData.expiryYear) {
      return;
    }

    const newMethod: PaymentMethod = {
      id: editingMethod?.id || Date.now().toString(),
      type: formData.type as 'credit' | 'debit',
      cardNumber: formData.cardNumber!,
      cardholderName: formData.cardholderName!,
      expiryMonth: formData.expiryMonth!,
      expiryYear: formData.expiryYear!,
      cardType: detectCardType(formData.cardNumber!),
      isDefault: formData.isDefault || false,
      nickname: formData.nickname
    };

    if (editingMethod) {
      setPaymentMethods(paymentMethods.map(method => method.id === editingMethod.id ? newMethod : method));
    } else {
      setPaymentMethods([...paymentMethods, newMethod]);
    }

    setIsDialogOpen(false);
    setFormData({ type: 'credit' });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const detectCardType = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    if (number.startsWith('6')) return 'discover';
    return 'unknown';
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const getCardIcon = (cardType: string) => {
    // In a real app, you'd use actual card brand icons
    switch (cardType) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      case 'discover':
        return '💳';
      default:
        return '💳';
    }
  };

  const getCardName = (cardType: string) => {
    switch (cardType) {
      case 'visa':
        return 'Visa';
      case 'mastercard':
        return 'Mastercard';
      case 'amex':
        return 'American Express';
      case 'discover':
        return 'Discover';
      default:
        return 'Credit Card';
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
          <span>Payment Options</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Options</h1>
              <p className="text-muted-foreground">Manage your payment methods and billing information</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddPaymentMethod} className="gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="type">Card Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as 'credit' | 'debit'})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="debit">Debit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="nickname">Card Nickname (Optional)</Label>
                    <Input
                      value={formData.nickname || ''}
                      onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                      placeholder="e.g., Personal Card, Work Card"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      value={formData.cardNumber || ''}
                      onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      value={formData.cardholderName || ''}
                      onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Month *</Label>
                      <Select value={formData.expiryMonth} onValueChange={(value) => setFormData({...formData, expiryMonth: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="expiryYear">Year *</Label>
                      <Select value={formData.expiryYear} onValueChange={(value) => setFormData({...formData, expiryYear: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        required
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
                    <Label htmlFor="isDefault">Make this my default payment method</Label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSavePaymentMethod} className="flex-1">
                      {editingMethod ? 'Update Payment Method' : 'Save Payment Method'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Security Notice */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Your payment information is secure</p>
                  <p className="text-sm text-muted-foreground">
                    We use industry-standard encryption to protect your financial data and never store complete card numbers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods List */}
          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No payment methods saved</h3>
                  <p className="text-muted-foreground mb-6">Add your first payment method to get started</p>
                  <Button onClick={handleAddPaymentMethod} className="gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
            ) : (
              paymentMethods.map((method) => (
                <Card key={method.id} className={method.isDefault ? 'border-primary' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getCardIcon(method.cardType)}</div>
                        <div>
                          <CardTitle className="text-lg">
                            {method.nickname || `${getCardName(method.cardType)} ${method.cardNumber.slice(-4)}`}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {getCardName(method.cardType)} ending in {method.cardNumber.slice(-4)}
                          </p>
                        </div>
                        {method.isDefault && (
                          <Badge className="bg-primary/10 text-primary">Default</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPaymentMethod(method)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePaymentMethod(method.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 text-muted-foreground">
                        <p className="font-medium text-foreground">{method.cardholderName}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Expires {method.expiryMonth}/{method.expiryYear}</span>
                          </div>
                          <span className="capitalize">{method.type} Card</span>
                        </div>
                      </div>
                      
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Alternative Payment Methods */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Alternative Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center hover:shadow-md transition-normal cursor-pointer">
                  <div className="text-2xl mb-2">💰</div>
                  <h3 className="font-semibold mb-1">PayPal</h3>
                  <p className="text-sm text-muted-foreground">Pay with your PayPal account</p>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-normal cursor-pointer">
                  <div className="text-2xl mb-2">🍎</div>
                  <h3 className="font-semibold mb-1">Apple Pay</h3>
                  <p className="text-sm text-muted-foreground">Touch ID or Face ID</p>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-normal cursor-pointer">
                  <div className="text-2xl mb-2">🏦</div>
                  <h3 className="font-semibold mb-1">Bank Transfer</h3>
                  <p className="text-sm text-muted-foreground">Direct bank transfer</p>
                </Card>
              </div>
            </CardContent>
          </Card>

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
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock,
  HelpCircle,
  ShoppingBag,
  Truck,
  CreditCard,
  RotateCcw
} from 'lucide-react';

const faqs = [
  {
    id: '1',
    question: 'How do I place an order via WhatsApp?',
    answer: 'Simply click the "Order Now" button on any product page. This will automatically open WhatsApp with a pre-filled message containing the product name and price. Send the message to complete your order.',
    category: 'ordering'
  },
  {
    id: '2',
    question: 'What payment methods do you accept?',
    answer: 'We accept various payment methods including cash on delivery, bank transfers, and mobile money payments. Payment details will be discussed when you contact us via WhatsApp.',
    category: 'payment'
  },
  {
    id: '3',
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 3-5 business days within the city. Express delivery (1-2 days) is available for an additional fee. Delivery times may vary based on your location.',
    category: 'shipping'
  },
  {
    id: '4',
    question: 'Can I return or exchange products?',
    answer: 'Yes, we offer a 30-day return policy for unused items in original packaging. Contact us via WhatsApp to initiate a return. Some conditions may apply.',
    category: 'returns'
  },
  {
    id: '5',
    question: 'How do I track my order?',
    answer: 'Once your order is confirmed, we will provide you with tracking information via WhatsApp. You can use this to monitor your delivery status.',
    category: 'shipping'
  },
  {
    id: '6',
    question: 'What if the product is out of stock?',
    answer: 'If a product is out of stock, it will be marked as such on the product page. You can contact us via WhatsApp to check when it will be available again.',
    category: 'inventory'
  }
];

const helpCategories = [
  {
    icon: ShoppingBag,
    title: 'Orders & Shopping',
    description: 'Help with placing orders and shopping',
    color: 'text-primary'
  },
  {
    icon: Truck,
    title: 'Shipping & Delivery',
    description: 'Delivery information and tracking',
    color: 'text-success'
  },
  {
    icon: CreditCard,
    title: 'Payment & Billing',
    description: 'Payment methods and billing queries',
    color: 'text-warning'
  },
  {
    icon: RotateCcw,
    title: 'Returns & Refunds',
    description: 'Return policy and refund process',
    color: 'text-destructive'
  }
];

export const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find answers to your questions or get in touch with our support team
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Help Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-normal gradient-card"
                  onClick={() => setSelectedCategory(category.title.toLowerCase().split(' ')[0])}
                >
                  <CardContent className="p-6 text-center">
                    <Icon className={`h-8 w-8 mx-auto mb-4 ${category.color}`} />
                    <h3 className="font-semibold mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQs */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              {selectedCategory && (
                <Button variant="outline" size="sm" onClick={() => setSelectedCategory('')}>
                  Clear Filter
                </Button>
              )}
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-start gap-3 text-left">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground ml-8">{faq.answer}</p>
                    <Badge variant="outline" className="ml-8 mt-2 text-xs">
                      {faq.category}
                    </Badge>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or browse our categories above.
                </p>
              </div>
            )}
          </div>

          {/* Contact & Support */}
          <div className="space-y-6">
            {/* Contact Options */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <MessageCircle className="h-5 w-5 text-success" />
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-sm text-muted-foreground">+1 (555) 987-6543</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">+1 (555) 123-4567</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Mail className="h-5 w-5 text-warning" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">support@storehub.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                  <Clock className="h-4 w-4" />
                  <span>24/7 Support Available</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <Input
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                  />
                  <Input
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    required
                  />
                  <Textarea
                    placeholder="How can we help you?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={4}
                    required
                  />
                  <Button type="submit" className="w-full gradient-primary">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
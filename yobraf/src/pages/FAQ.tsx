import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Package, CreditCard, Truck, RotateCcw, Shield, MessageCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      icon: HelpCircle,
      questions: [
        {
          question: 'What is StoreHub?',
          answer: 'StoreHub is an online marketplace where you can discover and purchase amazing products at competitive prices. We offer a wide range of categories including electronics, clothing, home goods, and more.'
        },
        {
          question: 'How do I create an account?',
          answer: 'Click on the "Sign Up" button in the top navigation or go to /sign-up. Fill in your name, email, and create a secure password. You\'ll receive a confirmation email to verify your account.'
        },
        {
          question: 'Is it safe to shop on StoreHub?',
          answer: 'Yes, absolutely! We use industry-standard SSL encryption to protect your personal and payment information. All transactions are processed securely through our certified payment partners.'
        },
        {
          question: 'Do you have a mobile app?',
          answer: 'Currently, we offer a mobile-optimized website that works great on all devices. We\'re working on dedicated mobile apps for iOS and Android - stay tuned!'
        }
      ]
    },
    {
      id: 'orders',
      title: 'Orders & Products',
      icon: Package,
      questions: [
        {
          question: 'How do I place an order?',
          answer: 'Browse our products, click on items you want to purchase, select quantity and options, then add to cart. When ready, go to your cart and follow the checkout process to complete your order.'
        },
        {
          question: 'Can I modify or cancel my order?',
          answer: 'You can modify or cancel your order within 1 hour of placing it, provided it hasn\'t been processed yet. Contact our customer service team immediately for assistance.'
        },
        {
          question: 'How do I track my order?',
          answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also check your order status by logging into your account and visiting the "My Orders" section.'
        },
        {
          question: 'What if an item is out of stock?',
          answer: 'If an item becomes out of stock after you order, we\'ll notify you immediately and offer alternatives or a full refund. You can also sign up for restock notifications on product pages.'
        }
      ]
    },
    {
      id: 'payment',
      title: 'Payment & Billing',
      icon: CreditCard,
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely.'
        },
        {
          question: 'When will I be charged?',
          answer: 'Your payment method will be charged immediately when you place your order. For pre-orders, you\'ll be charged when the item becomes available and ships.'
        },
        {
          question: 'Do you offer payment plans?',
          answer: 'Yes! We partner with several financing companies to offer flexible payment options for purchases over $200. You can see available plans during checkout.'
        },
        {
          question: 'Why was my payment declined?',
          answer: 'Payment declines can happen for various reasons: insufficient funds, incorrect billing information, or bank security measures. Please verify your details and try again, or contact your bank.'
        }
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping & Delivery',
      icon: Truck,
      questions: [
        {
          question: 'What are your shipping options?',
          answer: 'We offer standard shipping (5-7 business days), expedited shipping (2-3 business days), and overnight shipping. International shipping is available to most countries.'
        },
        {
          question: 'How much does shipping cost?',
          answer: 'Shipping costs vary by location, weight, and speed. Standard shipping is free on orders over $50. Exact costs are calculated at checkout based on your location and chosen method.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to most countries worldwide. International orders may be subject to customs duties and taxes, which are the responsibility of the customer.'
        },
        {
          question: 'What if my package is lost or damaged?',
          answer: 'We\'re fully responsible for packages until they\'re delivered. If your package is lost or arrives damaged, contact us immediately and we\'ll send a replacement or provide a full refund.'
        }
      ]
    },
    {
      id: 'returns',
      title: 'Returns & Refunds',
      icon: RotateCcw,
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some items like personalized products or perishables cannot be returned.'
        },
        {
          question: 'How do I return an item?',
          answer: 'Log into your account, go to "My Orders," find the item you want to return, and click "Return Item." Follow the instructions to print a return label and send the item back.'
        },
        {
          question: 'When will I receive my refund?',
          answer: 'Refunds are processed within 5-10 business days after we receive your returned item. The refund will go back to your original payment method.'
        },
        {
          question: 'Do I have to pay for return shipping?',
          answer: 'Return shipping is free for defective items or our errors. For other returns, customers are responsible for return shipping costs unless you have StoreHub Premium membership.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Security',
      icon: Shield,
      questions: [
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a secure link to reset your password. Make sure to check your spam folder.'
        },
        {
          question: 'How do I update my account information?',
          answer: 'Log into your account and go to "Account Settings." Here you can update your personal information, addresses, payment methods, and communication preferences.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'To delete your account, please contact our customer service team. Note that account deletion is permanent and cannot be undone. We\'ll provide instructions for data export if needed.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we take data security seriously. We use encryption, secure servers, and follow industry best practices. Read our Privacy Policy for detailed information about how we protect your data.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span>FAQ</span>
        </div>
      </div>

      {/* Header */}
      <section className="gradient-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Find answers to common questions about our products and services
          </p>
          <Button asChild variant="secondary" size="lg" className="shadow-glow">
            <Link to="/contact">
              <MessageCircle className="h-5 w-5 mr-2" />
              Still Need Help?
            </Link>
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Category Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {faqCategories.map((category) => (
              <Card key={category.id} className="cursor-pointer hover:shadow-md transition-normal group">
                <CardContent className="p-4 text-center">
                  <category.icon className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-slow" />
                  <h3 className="font-semibold text-sm">{category.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <category.icon className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`}>
                        <AccordionTrigger className="text-left hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Support */}
          <Card className="mt-12 gradient-card">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our customer support team is here to help you 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="mailto:support@storehub.com">Email Us</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
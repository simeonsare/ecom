import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Scale, AlertCircle, Shield, CreditCard, Truck } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span>Terms of Use</span>
        </div>
      </div>

      {/* Header */}
      <section className="gradient-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Scale className="h-16 w-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of Use
          </h1>
          <p className="text-xl text-white/90">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  By accessing and using StoreHub ("the Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p className="text-muted-foreground">
                  These Terms of Use constitute a legally binding agreement between you and StoreHub regarding your use of the Website and services.
                </p>
              </CardContent>
            </Card>

            {/* Use License */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Use License
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Permission is granted to:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Browse and purchase products from our catalog</li>
                    <li>Create and manage your user account</li>
                    <li>Access customer support services</li>
                    <li>Temporarily download materials for personal, non-commercial use</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">This license shall automatically terminate if you violate any of these restrictions:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Use the service for any unlawful purpose</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Reproduce, duplicate, or copy any part of the service</li>
                    <li>Transmit any viruses, malware, or harmful code</li>
                    <li>Harass, abuse, or harm other users</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Account Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>Account Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  When you create an account with us, you agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Keep your login credentials secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Orders and Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Orders and Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Processing</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>All orders are subject to acceptance and availability</li>
                    <li>We reserve the right to refuse or cancel orders</li>
                    <li>Prices are subject to change without notice</li>
                    <li>We do not guarantee product availability</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Payment Terms</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Payment is required at the time of order</li>
                    <li>We accept major credit cards and approved payment methods</li>
                    <li>All transactions are processed securely</li>
                    <li>Additional fees may apply for international orders</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Shipping and Returns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping and Returns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Shipping Policy</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Shipping costs are calculated at checkout</li>
                    <li>Delivery times are estimates and not guaranteed</li>
                    <li>Risk of loss passes to you upon delivery</li>
                    <li>International shipping may be subject to customs fees</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Return Policy</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Returns must be initiated within 30 days of delivery</li>
                    <li>Items must be in original condition and packaging</li>
                    <li>Return shipping costs are the responsibility of the customer</li>
                    <li>Refunds will be processed within 5-10 business days</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The service and its original content, features, and functionality are and will remain the exclusive property of StoreHub and its licensors. The service is protected by copyright, trademark, and other laws.
                </p>
                <p className="text-muted-foreground">
                  Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Disclaimers and Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Service Disclaimer</h3>
                  <p className="text-muted-foreground">
                    The materials on StoreHub's website are provided on an 'as is' basis. StoreHub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Limitation of Liability</h3>
                  <p className="text-muted-foreground">
                    In no event shall StoreHub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on StoreHub's website, even if StoreHub or an authorized representative has been notified orally or in writing of the possibility of such damage.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                </p>
                <p className="text-muted-foreground">
                  If you wish to terminate your account, you may simply discontinue using the service.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  StoreHub reserves the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p className="text-muted-foreground">
                  What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after any revisions become effective, you agree to be bound by the revised terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about these Terms of Use, please contact us at:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>Email: legal@storehub.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>Address: 123 Commerce Street, Business City, BC 12345</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
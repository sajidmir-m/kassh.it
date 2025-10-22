import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, CheckCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/home">
              <Button
                variant="outline"
                className="mb-4 bg-black/20 border-yellow-500/30 text-yellow-200 hover:bg-yellow-500/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-yellow-400">Privacy Policy</h1>
            <p className="text-yellow-200/80 mt-2">Your privacy and security are important to us</p>
          </div>

          <Card className="bg-black/20 border-yellow-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Privacy Policy</CardTitle>
                  <p className="text-sm text-yellow-200/60">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-yellow-300">Information We Collect</h3>
                <ul className="space-y-2 text-yellow-200/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Personal information (name, email, phone number) for account creation and order processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Delivery addresses to ensure accurate order fulfillment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Payment information (processed securely through encrypted channels)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Usage data to improve our services and user experience</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-yellow-300">How We Use Your Information</h3>
                <ul className="space-y-2 text-yellow-200/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Process and fulfill your orders efficiently</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Provide customer support and respond to inquiries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Send order updates and delivery notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Improve our platform and develop new features</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-yellow-300">Data Security</h3>
                <p className="text-yellow-200/80 mb-3">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="space-y-2 text-yellow-200/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>256-bit SSL encryption for all data transmission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Secure payment processing with PCI DSS compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Regular security audits and updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Access controls and authentication protocols</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-yellow-300">Contact Us</h3>
                <p className="text-yellow-200/80">
                  For privacy concerns or questions about this policy, please contact us at:
                </p>
                <div className="mt-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="text-yellow-300 font-medium">Email: info@kassit.com</p>
                  <p className="text-yellow-300 font-medium">Phone: +91 49559 39393</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;


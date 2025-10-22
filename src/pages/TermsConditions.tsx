import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft, CheckCircle } from 'lucide-react';

const TermsConditions = () => {
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
            <h1 className="text-3xl font-bold text-yellow-400">Terms & Conditions</h1>
            <p className="text-yellow-200/80 mt-2">Please read these terms carefully before using our service</p>
          </div>

          <Card className="bg-black/20 border-yellow-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Terms & Conditions</CardTitle>
                  <p className="text-sm text-yellow-200/60">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-yellow-300">Service Agreement</h3>
                <p className="text-yellow-200/80 mb-3">
                  By using Kassh.IT, you agree to these terms and conditions:
                </p>
                <ul className="space-y-2 text-yellow-200/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>You are 18+ years old or have parental consent to use our service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>You provide accurate and up-to-date information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>You use the service legally and responsibly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>You maintain the security of your account credentials</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-yellow-300">Orders & Delivery</h3>
                <ul className="space-y-2 text-yellow-200/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Orders are processed within 10 minutes of placement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Free delivery on orders above ₹500</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Orders can be cancelled within 5 minutes of placement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Delivery times may vary due to weather conditions or high demand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>We reserve the right to cancel orders in case of stock unavailability</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-yellow-300">Payment Terms</h3>
                <ul className="space-y-2 text-yellow-200/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>All payments are processed securely through encrypted channels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>We accept all major payment methods (cards, UPI, wallets)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Refunds are processed within 3-5 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Prices may change without prior notice</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-yellow-300">Limitation of Liability</h3>
                <ul className="space-y-2 text-yellow-200/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Kassh.IT is not liable for delivery delays due to external factors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Maximum liability is limited to the value of your order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>We are not responsible for third-party service issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>Product quality issues should be reported within 24 hours</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-yellow-300">Contact Information</h3>
                <p className="text-yellow-200/80 mb-3">
                  For questions about these terms or any service-related inquiries:
                </p>
                <div className="mt-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="text-yellow-300 font-medium">Email: info@kassit.com</p>
                  <p className="text-yellow-300 font-medium">Phone: +91 49559 39393</p>
                  <p className="text-yellow-200/60 text-sm mt-2">Available: 9 AM - 9 PM (Daily)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;


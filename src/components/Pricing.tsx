import { Check, Star, Zap, FileText, Calendar, Gift } from 'lucide-react';

const Pricing = () => {
  // const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: "Monthly",
      duration: "1 Month",
      papers: 25,
      price: 199,
      originalPrice: 249,
      savings: "20% off",
      description: "Perfect for trying out our platform",
      popular: false,
      badge: "Most Flexible"
    },
    {
      name: "Quarterly",
      duration: "3 Months",
      papers: 100,
      price: 499,
      originalPrice: 747,
      savings: "33% off",
      description: "Best value for regular users",
      popular: false,
      badge: "Best Value"
    },
    {
      name: "Semi-Annual",
      duration: "6 Months",
      papers: 300,
      price: 1299,
      originalPrice: 2244,
      savings: "42% off",
      description: "Ideal for growing institutions",
      popular: false,
      badge: "Popular"
    },
    {
      name: "Annual",
      duration: "12 Months",
      papers: 1000,
      price: 2999,
      originalPrice: 5988,
      savings: "50% off",
      description: "Maximum savings for power users",
      popular: false,
      badge: "Max Savings"
    }
  ];

  const addOnPacks = [
    {
      papers: 50,
      price: 99,
      description: "Quick top-up for busy periods"
    },
    {
      papers: 200,
      price: 299,
      description: "Bulk pack for large institutions"
    }
  ];

  const features = [
    "All Features Included",
    "AI-Powered Question Generation ChatBot (Beta)",
    "Drag & Drop Interface",
    "PDF Export with Answer Sheets",
    "Multi-School Support",
    "Simplified Visual Dashboard",
    "Priority Support",
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Gift className="w-4 h-4 mr-2" />
            All Features Included
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pay Only for the Papers You Create
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, transparent pricing based on your usage. All powerful features included in every plan.
          </p>
        </div>

        {/* Free Trial Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-12 text-center text-white shadow-xl">
          <div className="flex items-center justify-center mb-2">
            <Gift className="w-6 h-6 mr-2" />
            <span className="text-lg font-semibold">Free Trial Available</span>
          </div>
          <p className="text-lg">Get 5 free question papers to try our platform. No credit card required!</p>
          <button className="mt-4 px-6 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
            Start Free Trial
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden ${
                plan.popular ? 'ring-4 ring-blue-500 ring-opacity-50 scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Savings Badge */}
              <div className="absolute top-3 right-3">
                <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {plan.savings}
                </div>
              </div>

              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{plan.duration}</p>
                  <p className="text-gray-500 text-xs">{plan.description}</p>
                </div>

                {/* Papers Included */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-2xl font-bold text-gray-900">{plan.papers.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">Question Papers</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    <span className="text-sm text-gray-500 line-through mr-2">₹{plan.originalPrice.toLocaleString()}</span>
                    <span className="text-sm text-green-600 font-medium">{plan.savings}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group text-sm ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}>
                  Get Started
                  <Zap className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add-on Packs */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Need More Papers?</h3>
            <p className="text-gray-600">Purchase additional paper credits anytime</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {addOnPacks.map((pack, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="w-6 h-6 text-blue-600 mr-2" />
                    <span className="text-2xl font-bold text-gray-900">{pack.papers}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Extra Papers</p>
                  <div className="text-2xl font-bold text-gray-900 mb-3">₹{pack.price}</div>
                  <p className="text-xs text-gray-500 mb-4">{pack.description}</p>
                  <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Included */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Everything You Need Included</h3>
            <p className="text-gray-600">All features are available in every plan</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ/Benefits */}
        <div className="text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Flexible Billing</h4>
              <p className="text-sm text-gray-600">Monthly, quarterly, or annual plans. Cancel anytime.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Usage-Based</h4>
              <p className="text-sm text-gray-600">Pay only for papers you create. No hidden fees.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Zap className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">All Features</h4>
              <p className="text-sm text-gray-600">Every plan includes all features. No feature gating.</p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 bg-green-100 rounded-full text-green-800 font-medium">
            <Check className="w-5 h-5 mr-2" />
            30-day money-back guarantee • Free trial available
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
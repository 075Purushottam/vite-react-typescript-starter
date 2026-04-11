import React from 'react';
import { Check, Star, Zap } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Basic Plan",
      price: "₹499",
      period: "/month",
      description: "For individual teachers",
      features: [
        "Up to 50 papers per month",
        "Standard PDF export",
        "Basic question bank",
        "Email support",
        "Standard templates"
      ],
      buttonText: "Get Started",
      buttonStyle: "bg-gray-600 hover:bg-gray-700",
      popular: false
    },
    {
      name: "Pro Plan",
      price: "₹999",
      period: "/month",
      description: "For schools & institutes",
      features: [
        "Unlimited papers",
        "Custom branding",
        "AI assistance",
        "Priority support",
        "Advanced templates",
        "Multi-user access",
        "Analytics dashboard"
      ],
      buttonText: "Start Pro Trial",
      buttonStyle: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
      popular: true
    },
    {
      name: "Enterprise Plan",
      price: "₹1,999",
      period: "/month",
      description: "For coaching centers & large institutions",
      features: [
        "Everything in Pro",
        "Multi-school support",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated support",
        "White-label solution",
        "API access"
      ],
      buttonText: "Contact Sales",
      buttonStyle: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple & Affordable Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. All plans include free updates and customer support.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ${
                plan.popular ? 'ring-4 ring-blue-500 ring-opacity-50 scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1 text-sm">{plan.period}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${plan.buttonStyle} shadow-lg hover:shadow-xl flex items-center justify-center group text-sm`}>
                  {plan.buttonText}
                  <Zap className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-green-100 rounded-full text-green-800 font-medium">
            <Check className="w-5 h-5 mr-2" />
            30-day money-back guarantee
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
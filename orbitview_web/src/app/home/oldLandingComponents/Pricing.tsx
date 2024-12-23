const plans = [
  {
    name: "Free",
    price: "$0/mo",
    features: ["Basic Features", "Community Access", "Limited AR Sessions"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$15/mo",
    features: [
      "Enhanced Personalization",
      "Priority Support",
      "More AR Events",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "$30/mo",
    features: [
      "1-on-1 Mentorship",
      "Exclusive Workshops",
      "Early Feature Access",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">
          Flexible Plans for Every Explorer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`border p-6 rounded-lg hover:shadow-lg transition relative ${
                plan.popular ? "bg-white" : "bg-white"
              }`}
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-2xl font-bold mb-4">{plan.price}</p>
              <ul className="text-sm text-gray-700 mb-6 space-y-2">
                {plan.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
              <a
                href="#"
                className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full font-medium"
              >
                Choose {plan.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

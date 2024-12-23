export default function EdtechIntegration() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Learn & Grow with Quiztrepreneur and Techonomics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Quiztrepreneur</h3>
            <p className="text-sm text-gray-700 mb-4">
              Master entrepreneurship & venture capital through interactive
              quizzes and simulations. Build your pitch deck, face mock
              investors, and sharpen your business acumen.
            </p>
            <a href="#" className="text-purple-600 font-medium hover:underline">
              Start Quiztrepreneur
            </a>
          </div>
          <div className="border p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Techonomics</h3>
            <p className="text-sm text-gray-700 mb-4">
              Explore tech history and economic trends in a gamified
              environment. Understand how innovations shaped industries and spot
              emerging opportunities.
            </p>
            <a href="#" className="text-purple-600 font-medium hover:underline">
              Explore Techonomics
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DemoShowcase() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">See OrbitView in Action</h2>
        <p className="text-lg text-gray-600 mb-8">
          Personalized dashboards, AR learning, and instant AI-powered insights
          at your fingertips.
        </p>
        {/* Placeholder for a video or interactive carousel */}
        <div className="bg-gray-200 h-64 rounded-lg mb-8 flex items-center justify-center">
          <span className="text-gray-500">
            [Demo Video/Carousel Placeholder]
          </span>
        </div>
        <a
          href="#"
          className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-medium shadow transition"
        >
          Watch the Full Demo
        </a>
      </div>
    </section>
  );
}

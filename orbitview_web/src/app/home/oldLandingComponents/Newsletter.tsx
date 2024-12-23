export default function Newsletter() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay in the Orbit</h2>
        <p className="text-lg text-gray-600 mb-6">
          Get the latest on new features, upcoming events, and curated insights.
        </p>
        <form className="flex flex-col sm:flex-row gap-2 justify-center">
          <input
            type="email"
            placeholder="you@example.com"
            className="border rounded-full px-4 py-2 flex-1 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full font-medium transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#0A0E2C] to-[#1E1F3A] text-white">
      <div className="max-w-4xl px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          OrbitView: Your Launchpad to Immersive Connections and Infinite Growth
        </h1>
        <p className="text-lg md:text-2xl font-medium mb-8">
          Discover, Learn, and Thrive in a New Digital Universe—All in One
          Place.
        </p>
        <a
          href="#"
          className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Get Started
        </a>
        <p className="text-sm mt-2 opacity-75">
          No credit card required • Join in seconds
        </p>
      </div>
      {/* Hero Decoration: Could add a subtle floating illustration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}

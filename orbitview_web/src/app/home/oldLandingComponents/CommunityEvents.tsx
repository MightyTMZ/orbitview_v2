const events = [
  { title: "Tech Innovations Summit - Jan 2025", date: "Jan 15, 2025" },
  { title: "OrbitNode NYC Meetup", date: "Feb 10, 2025" },
  { title: "Global Connections Expo", date: "Mar 05, 2025" },
];

export default function CommunityEvents() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Plug Into the Community</h2>
        <p className="text-lg text-gray-600 mb-8">
          Events and meetups designed to connect and inspire.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((e, i) => (
            <div
              key={i}
              className="border p-6 rounded-lg hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{e.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{e.date}</p>
              <a
                href="#"
                className="text-purple-600 font-medium hover:underline"
              >
                Register Now
              </a>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <a
            href="#"
            className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-medium shadow transition"
          >
            Explore All Events
          </a>
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Alex P.",
    role: "AR Developer",
    quote:
      "OrbitView helped me level up my coding skills in AR literally overnight. I’ve never felt more supported!",
  },
  {
    name: "Priya S.",
    role: "Student Entrepreneur",
    quote:
      "I discovered my perfect mentor and landed an internship, all thanks to OrbitView’s AI recommendations.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">
          Voices from the OrbitView Universe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-700 italic mb-4">“{t.quote}”</p>
              <div className="text-sm text-gray-600 font-medium">
                {t.name}, {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

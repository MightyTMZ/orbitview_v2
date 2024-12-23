const highlights = [
  {
    title: "Personalized AI Navigation",
    description:
      "OrbitSearch AI tailors your journey with custom suggestions and insights.",
    icon: "🌐",
  },
  {
    title: "AR/VR Learning",
    description:
      "Dive into immersive sessions and virtual meetups for hands-on knowledge.",
    icon: "🕶️",
  },
  {
    title: "Purposeful Networking",
    description:
      "Connect with mentors, peers, and industry pros to accelerate your growth.",
    icon: "🤝",
  },
  {
    title: "Skill Elevation",
    description:
      "Microcourses and challenges to enhance your resume and skillset.",
    icon: "🚀",
  },
];

export default function Highlights() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">Why OrbitView?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {highlights.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-gray-700">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

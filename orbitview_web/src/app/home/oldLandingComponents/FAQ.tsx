'use client'

import { useState } from "react";

const faqs = [
  {
    q: "How does the AI personalization work?",
    a: "We use machine learning to analyze your interests, usage, and goals to tailor content and suggestions.",
  },
  {
    q: "Can I access AR sessions on mobile?",
    a: "Yes, our platform is mobile-friendly and supports AR via compatible devices.",
  },
  {
    q: "Is my data secure?",
    a: "We prioritize privacy and use encryption and secure protocols to keep your data safe.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Got Questions?</h2>
        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="border p-4 rounded-lg">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left focus:outline-none flex justify-between items-center"
              >
                <span className="font-medium">{item.q}</span>
                <span>{openIndex === idx ? "-" : "+"}</span>
              </button>
              {openIndex === idx && (
                <p className="mt-2 text-sm text-gray-700">{item.a}</p>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Still unsure?{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

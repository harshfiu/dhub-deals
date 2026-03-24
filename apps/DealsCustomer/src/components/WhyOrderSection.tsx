"use client";

import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {
    title: "BEST VALUE FOR MONEY",
    desc: "Enjoy competitive prices on quality meals. Get great deals and maximize your lunch budget without compromising on taste and quality.",
    emoji: "🏷️",
    bg: "#F2F5F2",
  },
  {
    title: "SECURE PAYMENTS",
    desc: "Every transaction is protected with industry-standard encryption. Pay with confidence using your preferred payment method—your security is our priority.",
    emoji: "🔒",
    bg: "#ffffff",
  },
  {
    title: "FRESH & ON TIME",
    desc: "Our vendors prepare meals fresh for each delivery window. Expect hot, freshly made food arriving right at your desk when you need it.",
    emoji: "🚀",
    bg: "#F2F5F2",
  },
];

const INTERVAL = 4500;

export default function WhyOrderSection() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => {
      setActive(index);
      setFading(false);
    }, 250);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((active + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [active, goTo]);

  const slide = SLIDES[active];

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Why Order With Us?</h2>
      </div>

      {/* Slide area */}
      <div
        className="transition-colors duration-500 py-16"
        style={{ backgroundColor: slide.bg }}
      >
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center gap-10"
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 250ms ease, transform 250ms ease",
          }}
        >
          {/* Icon */}
          <div className="flex-shrink-0 w-40 h-40 flex items-center justify-center text-8xl select-none">
            {slide.emoji}
          </div>

          {/* Text */}
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {slide.title}
            </h3>
            <p className="text-[#4BAEF5] text-base leading-relaxed max-w-md">
              {slide.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div
        className="flex justify-center gap-2.5 py-5"
        style={{ backgroundColor: slide.bg, transition: "background-color 500ms" }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? "24px" : "8px",
              height: "8px",
              backgroundColor: i === active ? "#2DBCB0" : "#D1D5DB",
            }}
          />
        ))}
      </div>
    </section>
  );
}

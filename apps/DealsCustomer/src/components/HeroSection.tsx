import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
    <div className="relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-3xl border border-[#008000]/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_16px_rgba(0,0,0,0.04)]">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #008000 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative py-5 sm:py-8 lg:py-8 px-6 sm:px-8 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Left: copy */}
          <div>
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#008000]/10 text-[#008000] text-xs font-semibold mb-5 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008000] animate-pulse" />
              Live Deals Near You
            </div>

            {/* Two-tone heading */}
            <h1 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold leading-tight tracking-tight mb-3 sm:mb-4">
              <span className="text-gray-800">Discover </span>
              <span className="text-[#008000]">Exclusive</span>
              <br />
              <span className="text-gray-800">Food </span>
              <span className="text-[#f5a623]">Deals</span>
            </h1>

            <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-md mb-5">
              Browse the best restaurant deals in your area — no sign-up
              required, no hidden fees. Just great food at better prices.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap gap-3 items-center">
              <a
                href="#deals"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#008000] text-white text-sm font-semibold hover:bg-[#006600] transition-colors shadow-md shadow-[#008000]/20"
              >
                Browse Deals
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>

            {/* Mobile-only food image */}
            <div className="lg:hidden relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden mt-4 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
                alt="Featured food deal"
                fill
                className="object-cover"
                sizes="100vw"
              />
              {/* Floating badge on mobile image */}
              <div className="absolute right-3 bottom-3 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 border border-gray-100">
                <div className="w-7 h-7 rounded-full bg-[#f5a623]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#f5a623] text-xs font-bold">%</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none">Today's top deal</p>
                  <p className="text-xs font-bold text-gray-800 leading-tight mt-0.5">30% Off Burgers</p>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-5 sm:mt-6 flex gap-8">
              {[
                { value: "200+", label: "Restaurants" },
                { value: "500+", label: "Active Deals" },
                { value: "Free", label: "Always" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: stacked food image collage */}
          <div className="hidden lg:block relative h-[220px]">
            {/* Main image */}
            <div className="absolute right-0 top-0 w-[58%] h-[75%] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80"
                alt="Gourmet burger deal"
                fill
                className="object-cover"
                sizes="300px"
              />
            </div>
            {/* Secondary image */}
            <div className="absolute left-0 bottom-0 w-[52%] h-[60%] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80"
                alt="Pizza deal"
                fill
                className="object-cover"
                sizes="270px"
              />
            </div>
            {/* Floating deal badge */}
            <div className="absolute right-4 bottom-12 bg-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2.5 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-[#f5a623]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#f5a623] text-sm font-bold">%</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 leading-none">Today's top deal</p>
                <p className="text-sm font-bold text-gray-800 leading-tight mt-0.5">30% Off Burgers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}

import Image from "next/image";

const HERO_IMAGES = [
  { src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80", alt: "Lunch bowl" },
  { src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", alt: "Salad bowl" },
  { src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80", alt: "Pancakes" },
];

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{ backgroundColor: "#2DBCB0", minHeight: "160px" }}
      >
        {/* Decorative circles */}
        <div className="absolute left-[-60px] top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-[40px] border-white/10 pointer-events-none" />
        <div className="absolute left-[40px] top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-[28px] border-white/10 pointer-events-none" />

        {/* Left: copy — takes ~58% width, padded */}
        <div className="relative z-10 w-[58%] px-8 sm:px-12 py-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-semibold mb-2 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live Deals Near You
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight">
            Discover <span style={{ color: "#F5C518" }}>Exclusive</span>
            <br />
            Food <span style={{ color: "#F5C518" }}>Deals</span>
          </h1>

          <div className="mt-3 flex items-center gap-5">
            <a
              href="#deals"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#2DBCB0] text-xs font-bold hover:bg-white/90 transition-colors shadow-md"
            >
              Browse Deals
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>

            {/* Stats inline */}
            <div className="flex gap-5">
              {[
                { value: "200+", label: "Restaurants" },
                { value: "500+", label: "Active Deals" },
                { value: "Free", label: "Always" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-sm font-black text-white leading-none">{s.value}</p>
                  <p className="text-[10px] text-white/60 font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: three full-height images, absolute */}
        <div className="absolute top-0 right-0 bottom-0 hidden lg:flex w-[44%]">
          {HERO_IMAGES.map((img, i) => (
            <div
              key={img.src}
              className="relative flex-1 overflow-hidden"
              style={
                i === 0
                  ? { clipPath: "polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)" }
                  : undefined
              }
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

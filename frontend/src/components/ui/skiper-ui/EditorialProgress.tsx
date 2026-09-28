import React, { useEffect, useState } from "react";

const SPREADS = [
  { id: "spread-01", label: "01", name: "Foundation" },
  { id: "spread-02", label: "02", name: "Diligence" },
  { id: "spread-03", label: "03", name: "Platform" },
  { id: "spread-04", label: "04", name: "Validation" },
  { id: "spread-05", label: "05", name: "Outcome" },
];

export const EditorialProgress: React.FC = () => {
  const [activeSpread, setActiveSpread] = useState(0);

  useEffect(() => {
    let ticking = false;
    const updateActiveSpread = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      if (progress < 0.18) setActiveSpread(0);
      else if (progress < 0.38) setActiveSpread(1);
      else if (progress < 0.58) setActiveSpread(2);
      else if (progress < 0.78) setActiveSpread(3);
      else setActiveSpread(4);

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSpread);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateActiveSpread();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSpread = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if ((window as any).__govskill_lenis) {
        (window as any).__govskill_lenis.scrollTo(el, { offset: -60, duration: 1.0 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <aside
      aria-label="Section indicator"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center select-none"
    >
      <div className="flex flex-col items-center gap-2">
        {SPREADS.map((spread, idx) => {
          const isActive = activeSpread === idx;
          return (
            <button
              key={spread.id}
              onClick={() => scrollToSpread(spread.id)}
              title={`Jump to ${spread.name}`}
              className={`group flex items-center gap-1.5 p-1 text-[10px] font-mono transition-colors duration-150 outline-none focus-visible:ring-1 focus-visible:ring-black ${
                isActive
                  ? "font-semibold text-zinc-950"
                  : "font-normal text-zinc-300 hover:text-zinc-600"
              }`}
            >
              <span
                className={`w-1 h-1 rounded-full transition-all duration-200 ${
                  isActive ? "bg-[#AF411E] scale-125" : "bg-transparent scale-0"
                }`}
              />
              <span>{spread.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default EditorialProgress;

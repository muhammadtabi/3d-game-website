import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useWindowScroll } from "react-use";

import { NAV_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";

import { Button } from "./button";

export const Navbar = () => {
  const navContainerRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  const [scrollProgress, setScrollProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const { y: currentScrollY } = useWindowScroll();
  const isScrolled = currentScrollY > 0;

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prevAudioPlaying) => !prevAudioPlaying);
    setIsIndicatorActive((prevIndicatorActive) => !prevIndicatorActive);
  };

  useEffect(() => {
    if (isAudioPlaying) void audioElementRef.current?.play();
    else audioElementRef.current?.pause();
  }, [isAudioPlaying]);

  useEffect(() => {
    if (isScrolled) navContainerRef.current?.classList.add("floating-nav");
    else navContainerRef.current?.classList.remove("floating-nav");

    gsap.to(navContainerRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.2,
    });

    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (currentScrollY / max) * 100 : 0;
    const pctFixed = Number(pct.toFixed(2));
    setScrollProgress(pctFixed);

    if (progressRef.current) {
      // laggy width tween
      gsap.to(progressRef.current, {
        width: `${pctFixed}%`,
        duration: 0.6,
        ease: "power3.out",
      });

      // subtle pulse when progress updates
      gsap.fromTo(
        progressRef.current,
        { boxShadow: "0 0 0 rgba(0,0,0,0)" },
        {
          boxShadow: "0 10px 30px rgba(79,183,221,0.12)",
          duration: 0.35,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
          delay: 0.02,
        }
      );
    }
  }, [currentScrollY, isScrolled]);

  return (
    <header
      ref={navContainerRef}
      className={cn(
        "fixed inset-x-0 top-4 z-50 h-16 transition-all duration-700 sm:inset-x-6",
        isScrolled
          ? "floating-nav border-white/15 bg-white/12 backdrop-saturate-150"
          : "border border-transparent bg-transparent shadow-none backdrop-blur-0 backdrop-saturate-100"
      )}
    >
      <div className="absolute left-0 top-0 h-2 w-full pointer-events-none">
        <div
          aria-hidden
          className="h-full rounded-r-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] transition-all duration-150 ease-linear"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <a href="#hero" className="transition hover:opacity-75">
              <img src="/img/logo.png" alt="Logo" className="w-10" />
            </a>

            <Button
              id="product-button"
              rightIcon={TiLocationArrow}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            >
              Products
            </Button>
          </div>

          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {NAV_ITEMS.map(({ label, href }) => (
                <a key={href} href={href} className="nav-hover-btn">
                  {label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleAudioIndicator}
                className="ml-10 flex items-center space-x-1 p-2 transition hover:opacity-75"
                title="Play Audio"
              >
                <audio
                  ref={audioElementRef}
                  src="/audio/loop.mp3"
                  className="hidden"
                  loop
                />

                {Array(4)
                  .fill("")
                  .map((_, i) => {
                    return (
                      <div
                        key={i + 1}
                        className={cn(
                
                          "indicator-line",
                          isIndicatorActive && "active"
                        )}
                        style={{ animationDelay: `${(i + 1) * 0.1}s` }}
                      />
                    );
                  })}
              </button>

              {/* Source code icon removed as requested */}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

"use client";

import { cn } from "../../lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    title: string;
    image: {
      src: string;
      alt: string;
    };
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    addAnimation();
  }, [isMobile]);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      
      // Determine how many items to show based on screen size
      const itemsToShow = isMobile ? 4 : 5;
      const itemsToDuplicate = Math.max(itemsToShow, scrollerContent.length);

      // Clear existing duplicates
      const existingDuplicates = scrollerRef.current.querySelectorAll('[data-duplicate="true"]');
      existingDuplicates.forEach(dup => dup.remove());

      // Add duplicates for smooth infinite scroll
      for (let i = 0; i < itemsToDuplicate; i++) {
        const item = scrollerContent[i % scrollerContent.length];
        if (item) {
          const duplicatedItem = item.cloneNode(true) as HTMLElement;
          duplicatedItem.setAttribute('data-duplicate', 'true');
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        }
      }

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-32 shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
          isMobile ? "justify-center" : "justify-start"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-56 h-20 sm:w-60 sm:h-20 md:w-60 md:h-20 shrink-0 rounded-full"
            key={`${item.image.alt}-${idx}`}
          >
            <blockquote className="w-full h-full flex flex-row items-center justify-center">
              <div
                aria-hidden="true"
                className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <div className="relative z-20 flex flex-row items-center h-full px-0 py-3 gap-3">
                <img 
                  src={item.image.src} 
                  alt={item.image.alt} 
                  className="w-24 h-24 sm:w-24 sm:h-24 md:w-24 md:h-24 rounded-full flex-shrink-0 object-contain scale-150 sm:scale-150 md:scale-150" />
                {/* <span className="text-sm leading-[1.4] font-normal text-neutral-700 dark:text-gray-300 truncate">
                  {item.title}
                </span> */}
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};

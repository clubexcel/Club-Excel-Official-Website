"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-[2rem] bg-white/5">
        <Calendar className="h-12 w-12 text-blue-500 opacity-20" />
      </div>
    );
  }

  return (
    <div className="group relative h-full w-full overflow-hidden rounded-[2rem]">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Event ${currentIndex + 1}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="h-full w-full object-cover"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(
                (prev) => (prev - 1 + images.length) % images.length
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev + 1) % images.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}

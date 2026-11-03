"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxProps {
  images: {
    imageUrl: string;
  }[];
  startIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  startIndex,
  onClose,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(startIndex);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/95 p-4 backdrop-blur-lg"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Previous */}
      {images.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <ChevronLeft className="w-7 h-7 text-white" />
        </button>
      )}

      {/* Image */}
      <motion.img
        key={index}
        src={images[index].imageUrl}
        alt={`Image ${index + 1}`}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={next}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <ChevronRight className="w-7 h-7 text-white" />
        </button>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-sm text-white">
          {index + 1} / {images.length}
        </div>
      )}
    </motion.div>
  );
}

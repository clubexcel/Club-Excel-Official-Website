"use client";

import { motion } from "framer-motion";

export default function TeamHero() {
  return (
    <section className="text-center mb-24">
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl md:text-7xl font-black tracking-tight"
      >
        OUR TEAM
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6 max-w-3xl mx-auto text-neutral-400 leading-8 text-lg"
      >
        Meet the visionaries, innovators and passionate individuals behind Club
        Excel who work together to build an amazing technical community.
      </motion.p>
    </section>
  );
}

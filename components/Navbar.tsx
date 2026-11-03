"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/public/logo.webp";
import Image from "next/image";
import { useRecruitmentStatus } from "@/hooks/useRecruitments";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isHomePage = pathname === "/";
  const { status: recruitmentStatus } = useRecruitmentStatus();
  const isRecruitmentOpen = recruitmentStatus?.isOpen ?? false;

  const menuItems = [
    { name: "Home", path: "/", isLink: true },
    {
      name: "About",
      path: isHomePage ? "#about" : "/#about",
      isLink: !isHomePage,
    },
    {
      name: "Domains",
      path: isHomePage ? "#domains" : "/#domains",
      isLink: !isHomePage,
    },
    { name: "Achievements", path: "/achievements", isLink: true },
    { name: "Events", path: "/events", isLink: true },
    { name: "Our Team", path: "/our-team", isLink: true },
    { name: "Contact Us", path: "/contact-us", isLink: true },
  ];

  return (
    <nav
      id="navigation"
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
    >
      <div className="relative inline-flex w-fit max-w-[calc(100vw-2rem)] items-center justify-between lg:justify-center gap-8 rounded-full border border-white/10  bg-white/5 px-8 py-3 backdrop-blur-md shadow-2xl shadow-black/50 transition-all  hover:bg-white/10">
        {/* Logo */}
        <Link
          href="/"
          className="text-sm font-bold tracking-tight text-white flex items-center gap-3 z-[60]"
        >
          <Image
            src={logo}
            alt="Club Excel"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="hidden sm:inline">CLUB EXCEL</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {menuItems.map((item) =>
            item.isLink ? (
              <Link
                key={item.name}
                href={item.path}
                className="text-[11px] font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wide"
              >
                {item.name}
              </Link>
            ) : (
              <a
                key={item.name}
                href={item.path}
                className="text-[11px] font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wide"
              >
                {item.name}
              </a>
            )
          )}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {isRecruitmentOpen && (
            <Link
              href="/recruitment"
              className="text-[11px] font-semibold bg-white text-black px-4 py-1.5 rounded-full hover:bg-neutral-200 transition-colors hover-trigger"
            >
              Join Now
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white z-[60] p-1"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-4 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 lg:hidden flex flex-col gap-4 shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {menuItems.map((item) =>
                  item.isLink ? (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-widest border-b border-white/5 pb-2"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      key={item.name}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-widest border-b border-white/5 pb-2"
                    >
                      {item.name}
                    </a>
                  )
                )}
                <div className="flex flex-col gap-3 pt-2">
                  {isRecruitmentOpen && (
                    <Link
                      href="/recruitment"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center text-sm font-semibold bg-white text-black py-3 rounded-xl hover:bg-neutral-200 transition-colors"
                    >
                      Join Now
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;

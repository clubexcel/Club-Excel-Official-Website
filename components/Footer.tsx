"use client";
import { Mail, MapPin } from "lucide-react";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import { FiFacebook, FiInstagram, FiLinkedin } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.webp";

const Footer = () => {
  return (
    <footer
      id="join"
      className="relative bg-black border-t border-white/10 pt-24 pb-12 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/5 via-black to-black"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-2 space-y-6">
            <a
              href="#"
              className="text-2xl font-bold tracking-tighter text-white flex items-center gap-4"
            >
              <Image
                src={logo}
                alt="Club Excel"
                className="w-12 h-12 object-contain"
              />
              CLUB EXCEL
            </a>
            <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
              National Institute of Science and Technology.
              <br />
              Empowering students to build the future through code.
            </p>
            <div className="flex gap-4 pt-4">
              <a
                href="https://www.linkedin.com/company/club-excel-nist/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black hover:border-white transition-all hover-trigger"
              >
                <FiLinkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/_club_excel_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black hover:border-white transition-all hover-trigger"
              >
                <FiInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/_club_excel_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black hover:border-white transition-all hover-trigger"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/excelnist"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black hover:border-white transition-all hover-trigger"
              >
                <FiFacebook className="w-4 h-4" />
              </a>
              <a
                href="https://discord.gg/XVja38tU"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black hover:border-white transition-all hover-trigger"
              >
                <FaDiscord className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-mono text-xs text-neutral-500 mb-6 uppercase tracking-widest">
              Sitemap
            </h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors hover-trigger"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#domains"
                  className="hover:text-white transition-colors hover-trigger"
                >
                  Domains
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-white transition-colors hover-trigger"
                >
                  About
                </a>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="hover:text-white transition-colors hover-trigger"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs text-neutral-500 mb-6 uppercase tracking-widest">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4" /> clubexcel@nist.edu
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4" /> NIST, Odisha
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-600">
          <p>© {new Date().getFullYear()} Club Excel. Built for the future.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-400">
              Privacy
            </a>
            <a href="#" className="hover:text-neutral-400">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

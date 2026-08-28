"use client";

import Link from "next/link";
import {
  Menu,
  ShoppingCart,
  X,
  UserPlus,
  Home,
  Info,
  Handshake,
  Sparkles,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { totalCount, totalAmount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "About Us", href: "/about", icon: <Info size={18} /> },
    { name: "Partner With Us", href: "/pwu", icon: <Handshake size={18} /> },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md border-b border-amber-100/60 py-2.5"
          : "bg-white/95 backdrop-blur-sm border-b border-amber-100 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* LOGO & BRAND */}
          <Link
            href="/"
            className="flex items-center group transition-transform duration-200"
          >
            <div className="relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="Homie Foods Logo"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-lg sm:text-xl font-black tracking-tight text-gray-900 transition-colors">
                  HOMIE<span className="text-amber-500">FOODS</span>
                </span>
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-amber-50/80 p-1.5 rounded-2xl border border-amber-200/50 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center space-x-1.5 ${
                    isActive
                      ? "bg-amber-400 text-gray-950 shadow-sm"
                      : "text-gray-700 hover:text-amber-700 hover:bg-white/80"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS (CART + AUTH + MOBILE TOGGLE) */}
          <div className="flex items-center space-x-3">
            {/* CART BUTTON */}
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className="relative p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-gray-800 hover:text-amber-800 transition-all border border-amber-200/60 shadow-sm flex items-center space-x-2 group cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-800 group-hover:scale-110 transition-transform" />
                {totalCount > 0 && (
                  <span className="absolute -top-3 -right-3 bg-amber-500 text-black text-[11px] font-black rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-md ring-2 ring-white animate-bounce">
                    {totalCount}
                  </span>
                )}
              </div>
              {totalAmount > 0 && (
                <span className="hidden sm:inline-block text-xs font-bold text-gray-900 pl-1 border-l border-amber-200">
                  ₹{totalAmount}
                </span>
              )}
            </Link>

            {/* AUTH BUTTONS */}
            <div className="flex items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-950 text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center space-x-1.5 cursor-pointer">
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="p-1 rounded-full ring-2 ring-amber-400/60">
                  <UserButton />
                </div>
              </SignedIn>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                aria-label="Toggle navigation menu"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-gray-800 hover:bg-amber-50 transition-colors focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white/98 backdrop-blur-lg border-b border-amber-200 overflow-hidden shadow-2xl"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-amber-400 text-gray-950 shadow-sm"
                        : "text-gray-700 hover:bg-amber-50"
                    }`}
                  >
                    <div className={isActive ? "text-gray-950" : "text-amber-600"}>
                      {link.icon}
                    </div>
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold bg-amber-50 text-gray-900 border border-amber-200"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCart size={18} className="text-amber-600" />
                  <span>Cart</span>
                </div>
                <span className="bg-amber-400 text-gray-950 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                  {totalCount} items
                </span>
              </Link>

              {/* COD PROMISE MINI BANNER */}
              <div className="pt-2 text-center text-xs text-amber-800 font-semibold bg-amber-100/60 p-3 rounded-2xl border border-amber-200/60">
                ✨ 100% Cash on Delivery (COD) on all orders
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
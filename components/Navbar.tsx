"use client";
import Link from "next/link";
import { Menu, ShoppingCart, X, UserPlus } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const [menuFlg, setMenuFlg] = useState(false);
  const pathname = usePathname();
  const [cartItemCount, setCartItemCount] = useState(2);

  const handleChange = () => {
    setMenuFlg(!menuFlg);
  };

  const handleLinkClick = () => {
    setMenuFlg(false);
  };

  useEffect(() => {
    setMenuFlg(false);
  }, [pathname]);

  return (
    <div>
      <nav className="flex justify-between md:justify-evenly items-center bg-yellow-50 p-4 md:p-3 relative shadow-md">
        <Link href="/" onClick={handleLinkClick} className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="logo"
            width={50}
            height={50}
          />
          <h1 className="text-orange-500 text-xl md:text-3xl font-extrabold">
            HOMIE FOODS
          </h1>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-lg md:text-xl px-3">
          <li className="hover:scale-110 hover:text-orange-500 transition-transform">
            <Link href="/" onClick={handleLinkClick}>
              Home
            </Link>
          </li>
          <li className="hover:scale-110 hover:text-orange-500 transition-transform">
            <Link href="/about" onClick={handleLinkClick}>
              About Us
            </Link>
          </li>
          <li className="hover:scale-110 hover:text-orange-500 transition-transform">
            <Link href="/pwu" onClick={handleLinkClick}>
              Partner with us
            </Link>
          </li>
        </ul>

        {/* Auth and Cart Icons */}
        <div className="flex space-x-4 items-center">
          <SignedOut>
            <SignInButton>
              <UserPlus className="h-6 w-6 md:h-8 md:w-8 cursor-pointer hover:scale-110 hover:text-orange-500" />
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <div className="relative hover:scale-110 hover:text-orange-500 cursor-pointer">
            <Link href="/cart">
            <ShoppingCart className="h-6 w-6 md:h-8 md:w-8"/></Link>
            {cartItemCount >= 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>

          
        {/* Mobile Menu Button */}
        
          <div className="md:hidden">
          <button
            title="Menu"
            type="button"
            className="text-3xl p-2 focus:outline-none"
            onClick={handleChange}
          >
            {menuFlg ? <X /> : <Menu />}
          </button>
          {menuFlg && (
            <ul className="bg-yellow-100 w-full absolute top-30 left-0 text-lg text-center z-10 shadow-lg">
              <li className="py-3 border-b border-gray-200">
                <Link href="/" onClick={handleLinkClick} className="block">
                  Home
                </Link>
              </li>
              <li className="py-3 border-b border-gray-200">
                <Link href="/about" onClick={handleLinkClick} className="block">
                  About Us
                </Link>
              </li>
              <li className="py-3">
                <Link href="/pwu" onClick={handleLinkClick} className="block">
                  Partner with us
                </Link>
              </li>
            </ul>
          )}
        </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
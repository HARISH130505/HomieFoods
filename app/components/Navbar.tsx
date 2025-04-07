"use client"
import Link from "next/link";
import {Menu,X} from "lucide-react"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";

const Navbar = () => {
    const [menuFlg, setMenuFlg] = useState(false);
    const pathname = usePathname();

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
            <nav className="flex justify-around items-center bg-[#e5d29bcc] p-3">
                <Link href="/" onClick={handleLinkClick}>
                <div className="flex items-center space-x-1">
                    <Image 
                        src="/logo.png" 
                        alt="logo" 
                        width={50}
                        height={50}
                    />
                    <h1 className="text-orange-500 text-3xl font-extrabold">HOMIE FOODS</h1>
                </div>
                </Link>
                <ul className="hidden md:flex space-x-8 text-xl px-3">
                    <li className="hover:scale-110 hover:text-orange-500"><Link href="/" onClick={handleLinkClick}>Home</Link></li>
                    <li className="hover:scale-110 hover:text-orange-500"><Link href="/about" onClick={handleLinkClick}>About Us</Link></li>
                    <li className="hover:scale-110 hover:text-orange-500"><Link href="/pwu" onClick={handleLinkClick}>Partner with us</Link></li>
                    <SignedOut>
                        <li className="hover:scale-110 hover:text-orange-500 cursor-pointer"><SignInButton /></li>
                    </SignedOut>
                    <SignedIn>
                       <li className="hover:scale-110 hover:text-orange-500 cursor-pointer"><UserButton/></li>
                    </SignedIn>
                </ul>
                <div className="md:hidden">
                    <button
                        title="btn"
                        type="button"
                        className="text-4xl px-2"
                        onClick={handleChange}
                    >
                        {menuFlg ? <X /> : <Menu />}
                    </button>
                    {menuFlg && (
                        <ul className="bg-[#E8DEC3CC] w-full absolute top-28 left-0 text-2xl text-center z-10">
                            <li className="py-4"><Link href="/" onClick={handleLinkClick}>Home</Link></li>
                            <li className="py-4"><Link href="/about" onClick={handleLinkClick}>About Us</Link></li>
                            <li className="py-4"><Link href="/pwu" onClick={handleLinkClick}>Partner with us</Link></li>
                            <li className="py-4">
                                <SignedOut>
                                    <SignInButton />
                                </SignedOut>
                                <SignedIn>
                                    <UserButton />
                                </SignedIn>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;

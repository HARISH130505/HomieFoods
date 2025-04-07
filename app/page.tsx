"use client"
import React from 'react';
import Dishes from '@/components/Dishes';
import Hero from '@/components/Hero';
import Vendor from '@/components/Vendor';

const Page = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
        <Hero/>
        <Dishes/>
        <Vendor/>
    </div>
  );
};

export default Page;
"use client";
import React, { useState } from 'react';
import Dishes from '@/components/Dishes';
import Hero from '@/components/Hero';
import Vendor from '@/components/Vendor';
import Map from '@/components/Map';

const Page = () => {
  const [searchTerm, setSearchTerm] = useState('');

  interface HandleSearchProps {
    (term: string): void;
  }

  const handleSearch: HandleSearchProps = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="text-black relative w-full min-h-screen overflow-hidden">
      <Hero onSearch={handleSearch} />
      <Dishes searchTerm={searchTerm} />
      <Map />
      <Vendor />
    </div>
  );
};

export default Page;

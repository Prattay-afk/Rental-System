"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Banner.jpg"
          alt="Rentiful Rental Platform Hero Section"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-opacity-60 z-10" />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 flex flex-col items-center justify-center text-center h-full px-6 sm:px-12"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Start your journey to finding the perfect place to call home
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 mb-8">
            Explore our wide range of rental properties tailored to fit your
            lifestyle and needs!
          </p>

          <div className="flex justify-center w-full max-w-lg mx-auto">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // TODO: Add search functionality
                  console.log("Searching for:", searchQuery);
                }
              }}
              placeholder="Search by city, neighborhood or address"
              className="flex-1 rounded-none rounded-l-xl border-none bg-white h-12 text-gray-900"
            />
            <Button
              onClick={() => {
                // TODO: Add search functionality
                console.log("Searching for:", searchQuery);
              }}
              className="bg-[#cf7636] text-white rounded-none rounded-r-xl border-none hover:bg-[#b8652a] h-12 px-6"
            >
              Search
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

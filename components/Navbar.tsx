"use client";

import Link from "next/link";
import React from "react";
import AuthButton from "./auth/AuthButton";

const Navbar = () => {
  return (
    <div className="fixed bg-black top-0 left-0 w-full z-50 shadow-xl">
      <div className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
        {/* LEFT SIDE — SITE NAME */}
        <Link href="/" className="text-2xl font-semibold text-white">
          <em>Prime</em>
          <span className="text-[#cf7636]">Rental</span>
        </Link>
        
        {/* RIGHT SIDE — AUTH BUTTON */}
        <div className="flex items-center gap-5">
          <AuthButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Bell, MessageCircle, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className="fixed bg-black top-0 left-0 w-full z-50 shadow-xl"
    >
      <div className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
        {/* LEFT SIDE — SITE NAME */}
        <Link href="/" className="text-2xl font-semibold text-white">
          <em>Prime</em><span className="text-[#cf7636]">Rental</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/login">
            <Button
              variant="outline"
              className="text-white border-white bg-transparent hover:bg-[#cf7636] hover:border-[#cf7636] rounded-lg"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="secondary"
              className="text-white bg-[#cf7636] hover:bg-[#b8652a] rounded-lg"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

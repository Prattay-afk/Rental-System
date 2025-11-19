"use client";

// import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
// import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
// import { signOut } from "aws-amplify/auth";
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
//   const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();

//   const isDashboardPage =
//     pathname.includes("/managers") || pathname.includes("/tenants");

//   const handleSignOut = async () => {
//     await signOut();
//     window.location.href = "/";
//   };

  return (
    <div
      className="fixed bg-black top-0 left-0 w-full z-50 shadow-xl"
    //   style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
        <div className="flex items-center gap-5">
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="text-white border-white bg-transparent hover:bg-purple-900 hover:text-primary-700 rounded-lg"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="secondary"
                  className="text-white bg-secondary-600 hover:bg-purple-900 hover:text-primary-700 rounded-lg"
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

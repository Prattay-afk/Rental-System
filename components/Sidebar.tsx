"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Bell,
    Settings,
    HelpCircle,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Bell, label: "Notifications", href: "/notifications", badge: 5 },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    // @ts-ignore - Handle potential nested session structure
    const user = session?.user || session?.session?.user;

    return (
        <div className="w-64 bg-[#1a1b1e] text-gray-400 flex flex-col h-screen fixed left-0 top-0 z-50">
            {/* User Profile Section */}
            <div className="p-6 flex flex-col items-center border-b border-gray-800">
                <div className="relative mb-3">
                    <Avatar className="w-20 h-20 border-2 border-[#cf7636]">
                        <AvatarImage src={user?.image || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"} />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                </div>
                <h3 className="text-white font-semibold text-lg">{user?.name || "User"}</h3>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-black text-white border-l-4 border-[#cf7636]"
                                    : "hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-white")} />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            {item.badge && (
                                <span className={cn(
                                    "text-xs font-bold px-2 py-0.5 rounded-full",
                                    item.label === "Inbox" ? "bg-[#cf7636] text-white" : "bg-[#00c48c] text-white"
                                )}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* List Property Button */}
            <div className="px-4 pb-4">
                <Link
                    href="/list-property"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#cf7636] hover:bg-[#b8652a] text-white font-semibold transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    List Property
                </Link>
            </div>

            {/* My Listings Button */}
            <div className="px-4 pb-4">
                <Link
                    href="/my-listings"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors border border-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    My Listings
                </Link>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-800 space-y-1">
                <Link
                    href="/help"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                    <HelpCircle className="w-5 h-5" />
                    <span className="font-medium">Help & Support</span>
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#ff4d4d] hover:bg-gray-800 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Log Out</span>
                </button>
            </div>
        </div>
    );
}

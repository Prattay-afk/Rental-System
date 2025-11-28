"use client";

import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function FilterBar() {
    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
                <Input
                    placeholder="Search Here...."
                    className="pl-4 pr-10 py-6 rounded-full border-gray-200 bg-white"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#cf7636]" />
            </div>

            {/* Price Filter */}
            <div className="w-full lg:w-auto">
                <Select>
                    <SelectTrigger className="w-full lg:w-[140px] py-6 rounded-full border-gray-200 bg-white">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Price</span>
                            <span className="text-[#cf7636] font-bold">$$</span>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">$</SelectItem>
                        <SelectItem value="medium">$$</SelectItem>
                        <SelectItem value="high">$$$</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Beds Filter */}
            <div className="w-full lg:w-auto">
                <Select defaultValue="2-4">
                    <SelectTrigger className="w-full lg:w-[160px] py-6 rounded-full border-none bg-[#cf7636] text-white hover:bg-[#b8652b]">
                        <SelectValue placeholder="Beds" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1 Bed</SelectItem>
                        <SelectItem value="2-4">2-4 Beds</SelectItem>
                        <SelectItem value="5+">5+ Beds</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Property Type Filter */}
            <div className="w-full lg:w-auto">
                <Select>
                    <SelectTrigger className="w-full lg:w-[180px] py-6 rounded-full border-gray-200 bg-white text-gray-500">
                        <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* More Filters Button */}
            <Button variant="outline" className="w-full lg:w-auto py-6 rounded-full border-gray-200 bg-white text-gray-400 hover:text-gray-600 px-6">
                <span className="mr-2">Filters</span>
                <SlidersHorizontal className="w-4 h-4" />
            </Button>
        </div>
    );
}

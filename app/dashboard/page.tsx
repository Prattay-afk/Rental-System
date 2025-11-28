"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { PropertyCard } from "@/components/PropertyCard";
import { DashboardWidgets } from "@/components/DashboardWidgets";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [propertyFilter, setPropertyFilter] = useState<'buy' | 'sell' | 'rent'>('rent');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  // Fetch properties when filter changes
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/properties?type=${propertyFilter}`);
      const data = await response.json();
      setProperties(data.properties || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProperties();
    }
  }, [propertyFilter, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#cf7636]" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setPropertyFilter('buy')}
              className={`font-bold pb-1 transition-colors ${propertyFilter === 'buy'
                ? 'text-[#cf7636] border-b-2 border-[#cf7636]'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              Buy
            </button>
            <button
              onClick={() => setPropertyFilter('sell')}
              className={`font-bold pb-1 transition-colors ${propertyFilter === 'sell'
                ? 'text-[#cf7636] border-b-2 border-[#cf7636]'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              Sell
            </button>
            <button
              onClick={() => setPropertyFilter('rent')}
              className={`font-bold pb-1 transition-colors ${propertyFilter === 'rent'
                ? 'text-[#cf7636] border-b-2 border-[#cf7636]'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              Rent
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Column: Listings */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading...' : `${properties.length} Results`}
              </h1>
            </div>

            <FilterBar />

            

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#cf7636]" />
                </div>
              ) : properties.length > 0 ? (
                properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    price={property.price}
                    address={property.location}
                    zip=""
                    image={property.imageUrl}
                    userId={property.userId}
                    currentUserId={session?.user?.id}
                    onDelete={fetchProperties}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No properties found for {propertyFilter}</p>
                  <p className="text-gray-400 text-sm mt-2">Try listing a property or changing the filter</p>
                </div>
              )}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { PropertyCard } from "@/components/PropertyCard";

export default function MyListingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/my-listings");
        }
    }, [status, router]);

    const fetchMyProperties = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/properties/mine', {
                credentials: 'include',
            });

            if (response.status === 401) {
                router.push("/login?callbackUrl=/my-listings");
                return;
            }

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
        if (status === "authenticated" && session?.user?.id) {
            fetchMyProperties();
        } else if (status !== "loading") {
            setLoading(false);
        }
    }, [status, session?.user?.id]);

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
            <Sidebar />

            <div className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#cf7636]" />
                        </div>
                    ) : properties.length > 0 ? (
                        <>
                            <div className="mb-4 text-sm text-gray-600">
                                {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {properties.map((property) => (
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
                                        onDelete={fetchMyProperties}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                You have no property listed
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Start by adding your first property!
                            </p>
                            <button
                                onClick={() => router.push('/list-property')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#cf7636] hover:bg-[#b8652a] text-white font-semibold rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                List Your First Property
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

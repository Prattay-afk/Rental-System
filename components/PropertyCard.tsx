"use client";

import { MapPin, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

interface PropertyCardProps {
    id?: string;
    image: string;
    title: string;
    price: number;
    address: string;
    zip: string;
    userId?: string;
    currentUserId?: string;
    onDelete?: () => void;
}

export function PropertyCard({
    id,
    image,
    title,
    price,
    address,
    zip,
    userId,
    currentUserId,
    onDelete
}: PropertyCardProps) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);
    const isOwner = userId && currentUserId && userId === currentUserId;

    const handleEdit = () => {
        if (id) {
            router.push(`/edit-property/${id}`);
        }
    };

    const handleDelete = async () => {
        if (!id) return;

        const confirmed = window.confirm('Are you sure you want to delete this property? This action cannot be undone.');
        if (!confirmed) return;

        setDeleting(true);
        try {
            const response = await fetch(`/api/properties/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete property');
            }

            toast.success('Property deleted successfully!');
            if (onDelete) {
                onDelete();
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete property');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Card className="overflow-hidden border-none shadow-none bg-transparent group cursor-pointer">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isOwner && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit();
                            }}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="bg-red-500/90 hover:bg-red-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                            disabled={deleting}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
            <CardContent className="p-0">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
                <p className="text-[#cf7636] font-bold mb-1">$ {price.toFixed(2)}</p>
                <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{address}{zip ? `, ${zip}` : ''}</span>
                </div>
            </CardContent>
        </Card>
    );
}

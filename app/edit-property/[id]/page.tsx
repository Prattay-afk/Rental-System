"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

export default function EditPropertyPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const propertyId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetchingProperty, setFetchingProperty] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "rent",
        price: "",
        location: "",
        bedrooms: "",
        bathrooms: "",
        imageUrl: "",
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/dashboard");
        }
    }, [status, router]);

    // Fetch property data
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await fetch(`/api/properties/${propertyId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch property');
                }

                const property = data.property;
                setFormData({
                    title: property.title,
                    description: property.description,
                    type: property.type,
                    price: property.price.toString(),
                    location: property.location,
                    bedrooms: property.bedrooms.toString(),
                    bathrooms: property.bathrooms.toString(),
                    imageUrl: property.imageUrl,
                });
                setImagePreview(property.imageUrl);
            } catch (error: any) {
                toast.error(error.message || 'Failed to load property');
                router.push('/dashboard');
            } finally {
                setFetchingProperty(false);
            }
        };

        if (status === "authenticated" && propertyId) {
            fetchProperty();
        }
    }, [status, propertyId, router]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setUploading(true);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload image');
            }

            setFormData({ ...formData, imageUrl: data.imageUrl });
            setImagePreview(data.imageUrl);
            toast.success('Image uploaded successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, imageUrl: "" });
        setImagePreview("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/properties/${propertyId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    bedrooms: parseInt(formData.bedrooms),
                    bathrooms: parseFloat(formData.bathrooms),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update property");
            }

            toast.success("Property updated successfully!");
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to update property");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || fetchingProperty) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#cf7636]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Edit Property</CardTitle>
                        <CardDescription>
                            Update your property details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Property Title *</Label>
                                <Input
                                    id="title"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Modern 3BR Apartment in Downtown"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe your property..."
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Listing Type *</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="rent">For Rent</SelectItem>
                                            <SelectItem value="sell">For Sale</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (USD) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="e.g., 1500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <Input
                                    id="location"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g., New York, NY"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                                    <Input
                                        id="bedrooms"
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.bedrooms}
                                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                                        placeholder="e.g., 3"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                                    <Input
                                        id="bathrooms"
                                        type="number"
                                        required
                                        min="0"
                                        step="0.5"
                                        value={formData.bathrooms}
                                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                                        placeholder="e.g., 2"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Property Image *</Label>
                                {!imagePreview ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#cf7636] transition-colors">
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                        <label htmlFor="image" className="cursor-pointer">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600">
                                                {uploading ? 'Uploading...' : 'Click to upload property image'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PNG, JPG, WebP up to 5MB
                                            </p>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="relative aspect-video rounded-lg overflow-hidden">
                                            <Image
                                                src={imagePreview}
                                                alt="Property preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                                <input type="hidden" required value={formData.imageUrl} />
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={loading || uploading || !formData.imageUrl}
                                    className="flex-1 bg-[#cf7636] hover:bg-[#b8652a]"
                                >
                                    {loading ? "Updating..." : "Update Property"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/dashboard")}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

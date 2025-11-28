import { ObjectId } from 'mongodb';

export interface IProperty {
    _id?: ObjectId;
    userId: string | ObjectId;
    title: string;
    description: string;
    type: 'rent' | 'sell';
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    status?: 'active' | 'pending' | 'sold' | 'rented';
}

export interface IPropertyResponse {
    id: string;
    userId: string;
    title: string;
    description: string;
    type: 'rent' | 'sell';
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    status?: 'active' | 'pending' | 'sold' | 'rented';
}

export function propertyToResponse(property: IProperty): IPropertyResponse {
    return {
        id: property._id?.toString() || '',
        userId: typeof property.userId === 'string' ? property.userId : property.userId?.toString() || '',
        title: property.title,
        description: property.description,
        type: property.type,
        price: property.price,
        location: property.location,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        imageUrl: property.imageUrl,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
        status: property.status,
    };
}

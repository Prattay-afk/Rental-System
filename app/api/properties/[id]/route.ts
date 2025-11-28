import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { IProperty } from '@/models/Property';
import { ObjectId } from 'mongodb';

// GET single property
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid property ID' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const propertiesCollection = db.collection<IProperty>('properties');

        const property = await propertiesCollection.findOne({
            _id: new ObjectId(id),
        });

        if (!property) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            property: {
                id: property._id?.toString(),
                ...property,
                _id: undefined,
            },
        });
    } catch (error: any) {
        console.error('Property fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT update property
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid property ID' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const propertiesCollection = db.collection<IProperty>('properties');

        // Check if property exists and user owns it
        const existingProperty = await propertiesCollection.findOne({
            _id: new ObjectId(id),
        });

        if (!existingProperty) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            );
        }

        const ownerId =
            typeof existingProperty.userId === 'string'
                ? existingProperty.userId
                : existingProperty.userId?.toString();

        if (!ownerId || ownerId !== session.user.id) {
            return NextResponse.json(
                { error: 'Forbidden: You can only edit your own properties' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { title, description, type, price, location, bedrooms, bathrooms, imageUrl } = body;

        // Validation
        if (!title || !description || !type || !price || !location || bedrooms === undefined || bathrooms === undefined || !imageUrl) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Update property
        const result = await propertiesCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    title,
                    description,
                    type,
                    price: parseFloat(price),
                    location,
                    bedrooms: parseInt(bedrooms),
                    bathrooms: parseFloat(bathrooms),
                    imageUrl,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Property updated successfully',
        });
    } catch (error: any) {
        console.error('Property update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE property
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid property ID' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const propertiesCollection = db.collection<IProperty>('properties');

        // Check if property exists and user owns it
        const existingProperty = await propertiesCollection.findOne({
            _id: new ObjectId(id),
        });

        if (!existingProperty) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            );
        }

        const ownerId =
            typeof existingProperty.userId === 'string'
                ? existingProperty.userId
                : existingProperty.userId?.toString();

        if (!ownerId || ownerId !== session.user.id) {
            return NextResponse.json(
                { error: 'Forbidden: You can only delete your own properties' },
                { status: 403 }
            );
        }

        // Delete property
        const result = await propertiesCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Property deleted successfully',
        });
    } catch (error: any) {
        console.error('Property delete error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

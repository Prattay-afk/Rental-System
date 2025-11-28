import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { IProperty } from '@/models/Property';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { title, description, type, price, location, bedrooms, bathrooms, imageUrl } = body;

        // Basic presence validation
        if (!title || !description || !type || price === undefined || !location || bedrooms === undefined || bathrooms === undefined || !imageUrl) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const parsedPrice = typeof price === 'string' ? parseFloat(price) : price;
        const parsedBedrooms = typeof bedrooms === 'string' ? parseInt(bedrooms, 10) : bedrooms;
        const parsedBathrooms = typeof bathrooms === 'string' ? parseFloat(bathrooms) : bathrooms;

        // Validate type
        if (type !== 'rent' && type !== 'sell') {
            return NextResponse.json(
                { error: 'Invalid property type. Must be "rent" or "sell"' },
                { status: 400 }
            );
        }

        // Validate numbers
        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            return NextResponse.json(
                { error: 'Price must be a positive number' },
                { status: 400 }
            );
        }

        if (!Number.isInteger(parsedBedrooms) || parsedBedrooms < 0) {
            return NextResponse.json(
                { error: 'Bedrooms must be a non-negative number' },
                { status: 400 }
            );
        }

        if (!Number.isFinite(parsedBathrooms) || parsedBathrooms < 0) {
            return NextResponse.json(
                { error: 'Bathrooms must be a non-negative number' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const propertiesCollection = db.collection<IProperty>('properties');

        // Create new property payload
        const newProperty: Omit<IProperty, '_id'> = {
            userId: session.user.id,
            title,
            description,
            type,
            price: parsedPrice,
            location,
            bedrooms: parsedBedrooms,
            bathrooms: parsedBathrooms,
            imageUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'active',
        };

        const result = await propertiesCollection.insertOne(newProperty);

        return NextResponse.json(
            {
                message: 'Property created successfully',
                propertyId: result.insertedId.toString(),
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Property creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch properties
export async function GET(req: NextRequest) {
    try {
        const db = await getDatabase();
        const propertiesCollection = db.collection<IProperty>('properties');

        // Get query parameters
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const userId = searchParams.get('userId');

        // Build query
        const query: any = {};

        // Only add status filter if not filtering by userId
        if (!userId) {
            query.status = 'active';
        }

        if (type && (type === 'rent' || type === 'sell')) {
            query.type = type;
        }
        if (userId) {
            if (ObjectId.isValid(userId)) {
                query.$or = [
                    { userId },
                    { userId: new ObjectId(userId) },
                ];
            } else {
                query.userId = userId;
            }
            console.log('Filtering by userId:', userId);
        }

        console.log('Query:', query);

        const properties = await propertiesCollection
            .find(query)
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();

        console.log('Found properties:', properties.length);
        if (properties.length > 0) {
            console.log('First property userId:', properties[0].userId);
        }

        return NextResponse.json({
            properties: properties.map(prop => ({
                id: prop._id?.toString(),
                userId: (prop.userId as any)?.toString?.() ?? prop.userId,
                title: prop.title,
                description: prop.description,
                type: prop.type,
                price: prop.price,
                location: prop.location,
                bedrooms: prop.bedrooms,
                bathrooms: prop.bathrooms,
                imageUrl: prop.imageUrl,
                createdAt: prop.createdAt,
                updatedAt: prop.updatedAt,
                status: prop.status,
            })),
        });
    } catch (error: any) {
        console.error('Properties fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

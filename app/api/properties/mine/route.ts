import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { IProperty, propertyToResponse } from '@/models/Property';
import { ObjectId } from 'mongodb';

export async function GET(_req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const db = await getDatabase();
        const propertiesCollection = db.collection<IProperty>('properties');

        const userId = session.user.id;
        const ownershipQuery = ObjectId.isValid(userId)
            ? {
                $or: [
                    { userId },
                    { userId: new ObjectId(userId) },
                ],
            }
            : { userId };

        const properties = await propertiesCollection
            .find(ownershipQuery)
            .sort({ createdAt: -1 })
            .limit(100)
            .toArray();

        return NextResponse.json({
            properties: properties.map(propertyToResponse),
        });
    } catch (error) {
        console.error('My properties fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}


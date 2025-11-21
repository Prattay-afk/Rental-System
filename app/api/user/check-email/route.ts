import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { IUser } from '@/models/User';

// POST - Check if email already exists
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<IUser>('users');

    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase(),
    });

    return NextResponse.json({
      exists: !!existingUser,
    });
  } catch (error: any) {
    console.error('Email check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


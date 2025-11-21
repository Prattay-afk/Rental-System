import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  fullName: string;
  email: string;
  password: string;
  image?: string;
  emailVerified?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  id: string;
  fullName: string;
  email: string;
  image?: string;
  emailVerified?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Convert MongoDB user to response format (exclude password)
export function userToResponse(user: IUser): IUserResponse {
  return {
    id: user._id?.toString() || '',
    fullName: user.fullName,
    email: user.email,
    image: user.image,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}


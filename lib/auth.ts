import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';
import { IUser } from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        try {
          const db = await getDatabase();
          const usersCollection = db.collection<IUser>('users');

          // Find user by email
          const user = await usersCollection.findOne({
            email: credentials.email.toLowerCase()
          });

          if (!user) {
            throw new Error('No user found with this email');
          }

          // Check password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Return user object (without password)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.fullName,
            image: user.image,
          };
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login', // Error code passed in query string as ?error=
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          const db = await getDatabase();
          const usersCollection = db.collection<IUser>('users');

          // Check if user already exists
          const existingUser = await usersCollection.findOne({
            email: user.email?.toLowerCase()
          });

          if (!existingUser) {
            // Create new user for OAuth
            await usersCollection.insertOne({
              fullName: user.name || '',
              email: user.email?.toLowerCase() || '',
              password: '', // OAuth users don't have password
              image: user.image,
              emailVerified: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        } catch (error) {
          console.error('Error creating OAuth user:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.dbIdSynced = false;
      }

      const shouldSyncDbUser = token.email && !token.dbIdSynced;

      if (shouldSyncDbUser) {
        try {
          const db = await getDatabase();
          const usersCollection = db.collection<IUser>('users');
          const dbUser = await usersCollection.findOne({ email: token.email!.toLowerCase() });

          if (dbUser) {
            token.id = dbUser._id.toString();
            token.name = dbUser.fullName || token.name || token.email!.split('@')[0];
            token.picture = dbUser.image || token.picture;
          }
        } catch (error) {
          console.error("Error syncing JWT token with DB user:", error);
        } finally {
          token.dbIdSynced = true;
        }
      }

      if (!token.name && token.email) {
        token.name = token.email.split('@')[0];
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session };
        token.dbIdSynced = false;
      }

      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Incoming Session:", JSON.stringify(session, null, 2));
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      console.log("Session Callback - Outgoing Session:", JSON.stringify(session, null, 2));
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};


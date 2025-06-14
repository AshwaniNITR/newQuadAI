// types/next-auth.d.ts
//import { NextRequest } from 'next/server';
import { Document } from 'mongoose'; // If using Mongoose
import User from '@/models/userModel';

// Extend the User type if needed
type AuthUser = Pick<InstanceType<typeof User>, '_id' | 'username' | 'email'> & Document;

declare module 'next/server' {
  interface NextRequest {
    user?: AuthUser;
  }
}
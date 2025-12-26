// Authentication utilities
import { SignJWT, jwtVerify } from 'jose';

// Get credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ngirit.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ngirit123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin Ngirit';
const JWT_SECRET_KEY = process.env.JWT_SECRET || 'ngirit-super-secret-key-2025';

const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_KEY);

export interface User {
  id: string;
  email: string;
  name: string;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return { id: '1', email: ADMIN_EMAIL, name: ADMIN_NAME };
  }
  return null;
}

export async function generateToken(user: User): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string
    };
  } catch {
    return null;
  }
}

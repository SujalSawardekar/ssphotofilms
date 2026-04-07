import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    console.log(`[LOGIN_API] Attempting login for: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== password) {
      console.log(`[LOGIN_API] Invalid credentials for: ${email}`);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Return user without password
    const { password: _pw, ...safeUser } = user;

    console.log(`[LOGIN_API] Successful login for: ${email}, role: ${user.role}`);
    return NextResponse.json({ user: safeUser }, { status: 200 });

  } catch (error: any) {
    console.error('[LOGIN_API] Error during login:', error);
    return NextResponse.json(
      { error: 'A server error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

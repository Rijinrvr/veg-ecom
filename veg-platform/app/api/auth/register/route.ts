import { NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const { name, email, phone, password } = await request.json();

        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            id: `user-${uuidv4().slice(0, 8)}`,
            name,
            email,
            phone,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        };

        createUser(user);

        // Return user without password
        const { password: _, ...safeUser } = user;
        return NextResponse.json(safeUser, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}

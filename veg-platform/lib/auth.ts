import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vegfresh-admin-secret-key-2026';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export function verifyCredentials(username: string, password: string): boolean {
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function generateToken(username: string): string {
    return jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): { username: string; role: string } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { username: string; role: string };
    } catch {
        return null;
    }
}

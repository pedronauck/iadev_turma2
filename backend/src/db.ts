import { Database } from 'bun:sqlite';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

config();

const DATABASE_URL = process.env.DATABASE_URL || path.join(process.cwd(), 'data', 'database.sqlite');
const dbDir = path.dirname(DATABASE_URL);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(DATABASE_URL, { create: true });
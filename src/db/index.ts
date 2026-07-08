import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// This is a helper for Next.js Edge runtime
// When using @cloudflare/next-on-pages, the D1 binding is injected into process.env
// However, the recommended way is using getRequestContext()

export function getDb() {
  const dbBinding = process.env.DB as unknown as D1Database;
  if (!dbBinding) {
    throw new Error('DB binding not found.');
  }
  return drizzle(dbBinding, { schema });
}

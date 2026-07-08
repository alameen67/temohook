import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { inboxes } from '@/db/schema';
import { lt } from 'drizzle-orm';




export async function GET(req: NextRequest) {
  try {
    // Basic security check
    const authHeader = req.headers.get('authorization');
    const expectedKey = process.env.CRON_API_KEY || 'local-cron-key';
    
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    
    // Delete all inboxes where expiresAt is in the past
    const result = await db.delete(inboxes).where(lt(inboxes.expiresAt, new Date())).returning();

    return NextResponse.json({ success: true, deletedCount: result.length });
  } catch (error) {
    console.error('Cron cleanup error:', error);
    return NextResponse.json({ error: 'Failed to cleanup' }, { status: 500 });
  }
}

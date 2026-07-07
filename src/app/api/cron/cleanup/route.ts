import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // Basic security check to ensure this is only called intentionally
    const authHeader = req.headers.get('authorization');
    const expectedKey = process.env.CRON_API_KEY || 'local-cron-key';
    
    // In production, you might want to enforce this.
    // For now, we'll just allow it if the key matches or if it's not set in env.
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all inboxes where expiresAt is in the past
    // The CASCADE delete in the schema will also delete associated messages
    const result = await prisma.inbox.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    return NextResponse.json({ success: true, deletedCount: result.count });
  } catch (error) {
    console.error('Cron cleanup error:', error);
    return NextResponse.json({ error: 'Failed to cleanup' }, { status: 500 });
  }
}

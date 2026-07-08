import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { inboxes, messages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';



export async function GET(
  req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const db = getDb();

    const inbox = await db.select().from(inboxes).where(eq(inboxes.address, address)).get();

    if (!inbox) {
      return NextResponse.json({ error: 'Inbox not found' }, { status: 404 });
    }

    const inboxMessages = await db.select({
      id: messages.id,
      sender: messages.sender,
      subject: messages.subject,
      receivedAt: messages.receivedAt,
      size: messages.size,
      attachments: messages.attachments,
    })
    .from(messages)
    .where(eq(messages.inboxId, inbox.id))
    .orderBy(desc(messages.receivedAt));

    // Update last accessed
    await db.update(inboxes)
      .set({ lastAccessed: new Date() })
      .where(eq(inboxes.id, inbox.id));

    return NextResponse.json({
      ...inbox,
      messages: inboxMessages
    });
  } catch (error) {
    console.error('Error fetching inbox:', error);
    return NextResponse.json({ error: 'Failed to fetch inbox' }, { status: 500 });
  }
}

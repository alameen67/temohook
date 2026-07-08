import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { inboxes } from '@/db/schema';
import { generateMemorableName } from '@/lib/nameGenerator';
import { addHours } from 'date-fns';
import { eq } from 'drizzle-orm';




export async function POST(req: Request) {
  try {
    const db = getDb();
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'temphook.lol';
    
    let name = '';
    try {
      const body: any = await req.json();
      if (body.customName && /^[a-zA-Z0-9-]+$/.test(body.customName)) {
        name = body.customName.toLowerCase();
      }
    } catch (e) {}

    if (!name) {
      let isUnique = false;
      while (!isUnique) {
        name = generateMemorableName();
        const existing = await db.select().from(inboxes).where(eq(inboxes.address, `${name}@${domain}`)).get();
        if (!existing) isUnique = true;
      }
    }

    const address = `${name}@${domain}`;
    
    const existing = await db.select().from(inboxes).where(eq(inboxes.address, address)).get();
    if (existing) {
      return NextResponse.json({ error: 'Address already in use' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    await db.insert(inboxes).values({
      id,
      address,
      expiresAt: addHours(new Date(), 24),
    });

    const newInbox = await db.select().from(inboxes).where(eq(inboxes.id, id)).get();

    return NextResponse.json(newInbox);
  } catch (error) {
    console.error('Error generating email:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

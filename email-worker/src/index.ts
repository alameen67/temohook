import PostalMime from 'postal-mime';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

export interface Env {
  DB: D1Database;
}

export default {
  async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext) {
    try {
      const db = drizzle(env.DB, { schema });
      
      // Parse the email using postal-mime
      const parser = new PostalMime();
      const rawEmail = new Response(message.raw);
      const email = await parser.parse(await rawEmail.arrayBuffer());
      
      const recipientAddress = message.to.toLowerCase();
      
      // Check if inbox exists and is not expired
      const inbox = await db.select().from(schema.inboxes).where(eq(schema.inboxes.address, recipientAddress)).get();
      
      if (inbox && inbox.expiresAt > new Date()) {
        const id = crypto.randomUUID();
        
        const attachments = email.attachments.map(att => ({
          filename: att.filename || 'unknown',
          contentType: att.mimeType,
          size: typeof att.content === 'string' ? att.content.length : (att.content?.byteLength || 0),
        }));
        
        const headers: Record<string, string> = {};
        for (const header of email.headers) {
          headers[header.key] = header.value;
        }

        await db.insert(schema.messages).values({
          id,
          inboxId: inbox.id,
          sender: message.from,
          recipient: recipientAddress,
          subject: email.subject || 'No Subject',
          text: email.text || '',
          html: email.html || '',
          attachments: JSON.stringify(attachments),
          headers: JSON.stringify(headers),
          size: message.rawSize,
        });
      } else {
        // If inbox doesn't exist, we can optionally reject the email
        // message.setReject("Address does not exist or has expired");
      }
    } catch (error) {
      console.error('Failed to process email:', error);
      // Let Cloudflare know processing failed
      message.setReject("Internal server error processing email");
    }
  }
};

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const inboxes = sqliteTable('inboxes', {
  id: text('id').primaryKey(),
  address: text('address').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  lastAccessed: integer('last_accessed', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  inboxId: text('inbox_id').notNull().references(() => inboxes.id, { onDelete: 'cascade' }),
  sender: text('sender').notNull(),
  recipient: text('recipient').notNull(),
  subject: text('subject'),
  text: text('text'),
  html: text('html'),
  attachments: text('attachments', { mode: 'json' }), // Stored as JSON string
  headers: text('headers', { mode: 'json' }),         // Stored as JSON string
  size: integer('size').notNull().default(0),
  receivedAt: integer('received_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

# Temphook - Cloudflare Deployment Guide

This guide explains how to deploy Temphook 100% serverless using Cloudflare Pages, Cloudflare D1, and Cloudflare Email Routing.

## Prerequisites
1. A Cloudflare account.
2. Your domain (`temphook.lol`) managed by Cloudflare.
3. Node.js installed locally to run Wrangler deployment commands.

## 1. Setup Cloudflare D1 Database
Log in to your Cloudflare dashboard, go to **Workers & Pages** -> **D1**, and create a new database named `temphook_d1`.

Note the `database_id` provided and update it in two places:
- `wrangler.toml` (in the root directory)
- `email-worker/wrangler.toml`

Run the database migrations to create the tables:
```bash
npx wrangler d1 execute temphook_d1 --local --file=./drizzle/0000_init.sql
npx wrangler d1 execute temphook_d1 --remote --file=./drizzle/0000_init.sql
```
*(Note: You will need to generate the migration first using `npx drizzle-kit generate` if not already done).*

## 2. Deploy the Next.js App to Cloudflare Pages
The frontend and APIs are powered by Next.js edge runtime.

Build and deploy:
```bash
npx @cloudflare/next-on-pages
npx wrangler pages deploy .vercel/output/static --project-name temphook
```
Go to your Cloudflare dashboard -> **Pages** -> **temphook** -> **Settings** -> **Functions** -> **D1 database bindings**. Bind your D1 database to the variable name `DB`.

## 3. Deploy the Email Worker
This worker processes incoming emails.

Navigate to the worker directory and deploy:
```bash
cd email-worker
npx wrangler deploy
```

## 4. Setup Cloudflare Email Routing
This is the magic that replaces Postfix!

1. In your Cloudflare dashboard, select your domain (`temphook.lol`).
2. Go to **Email** -> **Email Routing**.
3. Enable Email Routing. This will automatically add the necessary MX and TXT (SPF/DMARC) records to your DNS!
4. Go to the **Routing rules** tab.
5. Under **Catch-all address**, click **Edit**.
6. Set **Action** to `Send to a Worker`.
7. Set **Destination** to your deployed worker (`temphook-email-worker`).
8. Save.

## That's it!
You now have a globally distributed, infinitely scalable, zero-maintenance temporary email platform running entirely on Cloudflare's free tier!

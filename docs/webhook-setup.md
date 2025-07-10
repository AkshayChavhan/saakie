# Clerk Webhook Setup Guide

## Problem: Localhost URLs Don't Work for Webhooks

Clerk's servers cannot reach `http://localhost:3001` because it's only accessible on your local machine.

## Solution 1: Using ngrok (Recommended)

### Step 1: Install ngrok

```bash
# Download from https://ngrok.com/download
# Or use npm:
npm install -g ngrok

# Or use snap (Ubuntu/Linux):
sudo snap install ngrok
```

### Step 2: Start your Next.js server

```bash
npm run dev
# Server runs on http://localhost:3001
```

### Step 3: Create ngrok tunnel

```bash
# In a new terminal:
ngrok http 3001
```

### Step 4: Copy the public URL

```
# You'll see something like:
Forwarding  https://abc123.ngrok.io -> http://localhost:3001
```

### Step 5: Configure Clerk Webhook

1. Go to Clerk Dashboard → Webhooks
2. Add Endpoint: `https://abc123.ngrok.io/api/webhooks/clerk`
3. Select events: user.created, user.updated, user.deleted
4. Copy the webhook secret

## Solution 2: Using localtunnel

### Install and run:

```bash
npm install -g localtunnel
lt --port 3001 --subdomain saakie-webhooks
```

Your URL will be: `https://saakie-webhooks.loca.lt/api/webhooks/clerk`

## Solution 3: Using Cloudflare Tunnel

### Install and run:

```bash
# Install cloudflared
# https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/

cloudflared tunnel --url http://localhost:3001
```

## Solution 4: Deploy to a Staging Environment

Deploy your app to Vercel/Netlify for testing:

```bash
# For Vercel:
npm i -g vercel
vercel

# Your webhook URL will be:
# https://your-app.vercel.app/api/webhooks/clerk
```

## Testing the Webhook

Once configured, test by:

1. Creating a new user account at `/sign-up`
2. Check server logs for webhook activity
3. Verify user appears in MongoDB

## Important Notes

- **ngrok URLs change** each time you restart (unless you have a paid account)
- **Update Clerk webhook URL** whenever your tunnel URL changes
- **For production**, use your actual domain: `https://yourdomain.com/api/webhooks/clerk`

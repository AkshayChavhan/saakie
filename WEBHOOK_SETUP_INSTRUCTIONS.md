# 🔧 Clerk Webhook Setup Instructions

## The Problem

Clerk cannot reach `http://localhost:3001` because it's your local machine. You need a public URL.

## Quick Solution: Use ngrok

### Option 1: Run the Setup Script

```bash
./setup-webhook.sh
```

### Option 2: Manual Setup

1. **Start ngrok in a new terminal:**

   ```bash
   ngrok http 3001
   ```

2. **You'll see output like:**

   ```
   Session Status                online
   Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3001
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

4. **Configure Clerk Webhook:**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Navigate to **Webhooks** → **Add Endpoint**
   - Enter URL: `https://abc123.ngrok-free.app/api/webhooks/clerk`
   - Select events:
     - ✅ user.created
     - ✅ user.updated
     - ✅ user.deleted
   - Click **Create**
   - Copy the **Signing Secret** (starts with `whsec_`)

5. **Update your .env.local:**

   ```env
   CLERK_WEBHOOK_SECRET=whsec_[paste_your_secret_here]
   ```

6. **Restart your Next.js server:**
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

## Testing the Integration

1. **Sign up a new user:**
   - Visit: `http://localhost:3001/sign-up`
   - Create a test account

2. **Check server logs for:**

   ```
   Processing user.created for user: { clerkId: ..., email: ..., name: ... }
   ✅ User created successfully: 686e...
   ```

3. **Verify in Admin Panel:**
   - Visit: `http://localhost:3001/admin`
   - Check User Management section
   - New user should appear

## Alternative Solutions

### For Production Testing

Deploy to Vercel:

```bash
vercel --prod
# Use: https://your-app.vercel.app/api/webhooks/clerk
```

### Using Cloudflare Tunnel

```bash
cloudflared tunnel --url http://localhost:3001
```

### Using localtunnel

```bash
npx localtunnel --port 3001
```

## Important Notes

⚠️ **ngrok URLs expire** when you stop ngrok  
⚠️ **Update Clerk webhook URL** each time you restart ngrok  
⚠️ **For production**, use your actual domain

## Troubleshooting

- **"Invalid URL" in Clerk:** Make sure you're using HTTPS, not HTTP
- **No webhook received:** Check if ngrok is still running
- **401/403 errors:** Verify CLERK_WEBHOOK_SECRET is correct
- **User not created:** Check server logs for error messages

## Production Setup

For production, use your actual domain:

```
https://yourdomain.com/api/webhooks/clerk
```

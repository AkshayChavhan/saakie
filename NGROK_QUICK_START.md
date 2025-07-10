# 🚀 ngrok Quick Start Guide

## 1️⃣ Open a NEW Terminal

Don't close your Next.js server! Open a second terminal window.

## 2️⃣ Run ngrok

```bash
ngrok http 3001
```

## 3️⃣ Look for Your URL

```
Forwarding    https://YOUR-UNIQUE-ID.ngrok-free.app -> http://localhost:3001
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
              Copy this HTTPS URL!
```

## 4️⃣ Your Webhook URL

Add `/api/webhooks/clerk` to the ngrok URL:

```
https://YOUR-UNIQUE-ID.ngrok-free.app/api/webhooks/clerk
```

## 5️⃣ Common Issues & Solutions

### "command not found: ngrok"

```bash
# Install ngrok first:
brew install ngrok/ngrok/ngrok  # macOS
# OR
sudo snap install ngrok          # Ubuntu/Linux
# OR
# Download from https://ngrok.com/download
```

### "3001: Port not available"

Make sure your Next.js server is running:

```bash
npm run dev
```

### "Invalid host header" error

Add to your `next.config.mjs`:

```javascript
module.exports = {
  // ... other config
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ];
  },
};
```

## 6️⃣ Testing Your Tunnel

1. While ngrok is running, visit your ngrok URL in a browser:

   ```
   https://YOUR-UNIQUE-ID.ngrok-free.app
   ```

   You should see your Next.js app!

2. Check ngrok dashboard:
   ```
   http://localhost:4040
   ```
   This shows all requests going through your tunnel.

## 7️⃣ Keep ngrok Running

- ✅ Keep the ngrok terminal open while testing
- ❌ Don't close it or press Ctrl+C until you're done
- 🔄 If you close it, you'll get a new URL when you restart

## Example Full Process:

Terminal 1 (Next.js):

```bash
cd /home/l910009/Documents/workspace/RETHINK/saakie_byknk/saakie
npm run dev
# Keep this running!
```

Terminal 2 (ngrok):

```bash
ngrok http 3001
# Copy the HTTPS URL shown
# Keep this running too!
```

In Clerk Dashboard:

```
Webhook URL: https://84c5df474.ngrok-free.app/api/webhooks/clerk
Events: user.created, user.updated, user.deleted
```

That's it! 🎉

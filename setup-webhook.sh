#!/bin/bash

echo "🚀 Clerk Webhook Setup Script"
echo "============================"
echo ""

# Check if server is running
echo "✅ Checking if Next.js server is running on port 3001..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "   Server is running!"
else
    echo "❌ Server is not running. Please run 'npm run dev' first."
    exit 1
fi

echo ""
echo "📡 Starting ngrok tunnel..."
echo ""

# Kill any existing ngrok processes
pkill ngrok 2>/dev/null

# Start ngrok
ngrok http 3001 &
NGROK_PID=$!

# Wait for ngrok to start
sleep 5

# Get the public URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'https://[^"]*' | head -1)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Failed to get ngrok URL. Please run manually:"
    echo "   ngrok http 3001"
    echo ""
    echo "Then use the HTTPS URL shown in the ngrok output."
else
    echo "✅ ngrok is running!"
    echo ""
    echo "🔗 Your webhook URL is:"
    echo "   ${NGROK_URL}/api/webhooks/clerk"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to Clerk Dashboard: https://dashboard.clerk.com"
    echo "2. Navigate to Webhooks section"
    echo "3. Click 'Add Endpoint'"
    echo "4. Paste this URL: ${NGROK_URL}/api/webhooks/clerk"
    echo "5. Select these events:"
    echo "   - user.created"
    echo "   - user.updated"
    echo "   - user.deleted"
    echo "6. Copy the webhook secret (starts with whsec_)"
    echo "7. Update your .env.local file:"
    echo "   CLERK_WEBHOOK_SECRET=whsec_your_secret_here"
    echo ""
    echo "⚠️  Note: This ngrok URL will change when you restart ngrok."
    echo "    For production, use your actual domain."
fi

echo ""
echo "Press Ctrl+C to stop ngrok when done testing."
wait $NGROK_PID
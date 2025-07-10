#!/bin/bash

echo "🚀 Starting ngrok tunnel for Clerk webhooks..."
echo ""
echo "Make sure your Next.js server is running on port 3001!"
echo ""
echo "Starting ngrok..."
echo ""

# Run ngrok and display the public URL
ngrok http 3001
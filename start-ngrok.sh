#!/bin/bash

echo "🚀 Starting ngrok v3 for Clerk webhooks..."
echo ""
echo "Using ngrok from: $(pwd)/ngrok"
echo ""

# Run ngrok v3
./ngrok http 3001
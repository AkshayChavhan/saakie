import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Error occurred -- no svix headers' },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Error occurred' }, { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, phone_numbers } =
      evt.data;

    // Extract user data from Clerk webhook payload
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim() || 'User';
    const phone = phone_numbers?.[0]?.phone_number || null;

    // Validate required fields
    if (!id || !email) {
      console.error('Missing required fields:', { id, email });
      return NextResponse.json(
        { error: 'Missing required fields: clerkId or email' },
        { status: 400 }
      );
    }

    console.log(`Processing ${eventType} for user:`, {
      clerkId: id,
      email,
      name,
      phone,
      eventType,
    });

    try {
      const user = await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email,
          name,
          phone,
          updatedAt: new Date(),
        },
        create: {
          clerkId: id,
          email,
          name,
          phone,
          role: 'CUSTOMER', // Default role for new users
          status: 'ACTIVE', // Default status for new users
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(
        `✅ User ${eventType === 'user.created' ? 'created' : 'updated'} successfully:`,
        {
          userId: user.id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        }
      );

      return NextResponse.json({
        success: true,
        message: `User ${eventType === 'user.created' ? 'created' : 'updated'} successfully`,
        userId: user.id,
      });
    } catch (error) {
      console.error('❌ Error syncing user:', error);
      return NextResponse.json(
        {
          error: 'Error syncing user',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      await prisma.user.delete({
        where: { clerkId: id },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
        { error: 'Error deleting user' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

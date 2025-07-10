import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/products(.*)',
  '/categories(.*)',
  '/api/webhooks(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const isApiRoute = createRouteMatcher(['/api(.*)']);

export default clerkMiddleware((auth, req) => {
  // Skip authentication check during build time
  if (process.env.NODE_ENV === 'production' && !process.env.CLERK_SECRET_KEY) {
    return NextResponse.next();
  }

  // For API routes that aren't public, check authentication
  if (isApiRoute(req) && !isPublicRoute(req)) {
    const authObject = auth();
    if (!authObject.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // For non-API routes that aren't public, protect them
  if (!isPublicRoute(req) && !isApiRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

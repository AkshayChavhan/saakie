# Troubleshooting Guide

## Common Issues and Solutions

### 1. Clerk Middleware Error

**Error**: `TypeError: (0 , _clerk_nextjs__WEBPACK_IMPORTED_MODULE_0__.authMiddleware) is not a function`

**Cause**: This error occurs when using the older Clerk v4 middleware pattern with Clerk v5+.

**Solution**: Update your middleware to use the new Clerk v5 API:

```typescript
// ❌ Old way (Clerk v4)
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/'],
});

// ✅ New way (Clerk v5+)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/products(.*)',
  '/categories(.*)',
  '/api/webhooks(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});
```

### 2. Database Connection Issues

**Error**: `PrismaClientInitializationError: Can't reach database server`

**Cause**: Invalid MongoDB connection string or database not accessible.

**Solutions**:

1. Check your `DATABASE_URL` in `.env.local`
2. Ensure MongoDB cluster is running
3. Verify IP whitelist in MongoDB Atlas
4. Test connection with `npx prisma db push`

### 3. Environment Variables Not Loading

**Error**: `TypeError: Cannot read properties of undefined`

**Cause**: Environment variables not properly loaded.

**Solutions**:

1. Ensure `.env.local` is in the root directory
2. Check variable naming (use `NEXT_PUBLIC_` prefix for client-side variables)
3. Restart development server after adding new variables
4. Verify no typos in variable names

### 4. Build Errors

**Error**: `Type error: Cannot find module or its corresponding type declarations`

**Cause**: Missing type definitions or incorrect imports.

**Solutions**:

1. Run `npm install` to ensure all dependencies are installed
2. Check TypeScript configuration in `tsconfig.json`
3. Verify import paths use the correct aliases (`@/` for src folder)
4. Run `npx prisma generate` to regenerate Prisma types

### 5. Git Hooks Not Working

**Error**: Commits going through without linting/formatting

**Cause**: Husky hooks not properly installed.

**Solutions**:

1. Run `npx husky install` to install hooks
2. Check `.husky/pre-commit` file exists and is executable
3. Verify `prepare` script in package.json
4. Run `chmod +x .husky/pre-commit` to make executable

### 6. Tailwind CSS Not Working

**Error**: Styles not applying or classes not found

**Cause**: Tailwind not properly configured or CSS not imported.

**Solutions**:

1. Verify `@tailwind` directives in `globals.css`
2. Check `tailwind.config.ts` content paths
3. Ensure CSS file is imported in `layout.tsx`
4. Restart development server

### 7. React Query Issues

**Error**: `No QueryClient set, use QueryClientProvider`

**Cause**: Query client not properly set up.

**Solution**: Add QueryClientProvider to your layout:

```typescript
// layout.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ClerkProvider>
            {children}
          </ClerkProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### 8. Zustand Persistence Not Working

**Error**: Cart state not persisting across page refreshes

**Cause**: Hydration mismatch or localStorage not available.

**Solutions**:

1. Use `skipHydration: true` in persist options
2. Check if running in client environment
3. Handle server-side rendering properly

### 9. Deployment Issues

**Error**: Build fails on Vercel/Netlify

**Cause**: Missing environment variables or build configuration.

**Solutions**:

1. Add all environment variables to deployment platform
2. Check `next.config.mjs` for proper configuration
3. Verify build scripts in `package.json`
4. Ensure database is accessible from deployment environment

## Development Tips

### 1. Code Quality

- Always run `npm run lint` before committing
- Use `npm run type-check` to catch TypeScript errors
- Format code with `npm run format`

### 2. Database Management

- Use `npx prisma studio` for visual database inspection
- Always run `npx prisma generate` after schema changes
- Use `npx prisma db push` for development schema updates

### 3. Environment Setup

- Keep `.env.example` updated with all required variables
- Never commit `.env.local` to version control
- Use different databases for development and production

### 4. Testing

- Test authentication flows with Clerk development keys
- Verify protected routes work correctly
- Test form submissions and error handling

## Getting Help

If you encounter issues not covered here:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review [Clerk documentation](https://clerk.com/docs)
3. Check [Prisma documentation](https://www.prisma.io/docs)
4. Search existing issues in the project repository
5. Create a detailed issue with error messages and steps to reproduce

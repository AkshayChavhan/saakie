# Saakie E-commerce Platform - Complete Documentation

## Table of Contents

1. [Project Setup Steps](#project-setup-steps)
2. [Package Documentation](#package-documentation)
3. [System Architecture & Flow](#system-architecture--flow)
4. [Development Workflow](#development-workflow)
5. [Code Examples](#code-examples)

---

## Project Setup Steps

### Step 1: Project Initialization

```bash
npx create-next-app@14 . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --no-git
```

- Creates Next.js 14 project with TypeScript support
- Enables Tailwind CSS
- Uses App Router (modern Next.js routing)
- Sets up path alias `@/*` for clean imports

### Step 2: Dependency Installation

All dependencies were added to `package.json` and installed via `npm install`:

#### Production Dependencies

- **@clerk/nextjs**: Authentication and user management
- **@prisma/client**: Database ORM client
- **@radix-ui/react-\***: Headless UI components
- **@tanstack/react-query**: Server state management
- **class-variance-authority**: Dynamic className utilities
- **clsx**: Conditional className utility
- **lucide-react**: Icon library
- **tailwind-merge**: Merge Tailwind classes without conflicts
- **zustand**: Client state management

#### Development Dependencies

- **@commitlint/cli & config**: Enforce commit conventions
- **@typescript-eslint/\***: TypeScript linting
- **eslint-config-airbnb**: Industry-standard linting rules
- **husky**: Git hooks
- **lint-staged**: Run linters on staged files
- **prettier**: Code formatting
- **prisma**: Database ORM

### Step 3: Configuration Files Created

1. **TypeScript Configuration** (`tsconfig.json`)
   - Strict mode enabled
   - Path aliases configured
   - Next.js plugin integration

2. **ESLint Configuration** (`.eslintrc.json`)
   - Airbnb style guide
   - TypeScript support
   - Prettier integration
   - Custom rules for Next.js

3. **Prettier Configuration** (`.prettierrc.json`)
   - Consistent code formatting
   - Tailwind CSS plugin for class sorting

4. **Husky & Git Hooks**
   - Pre-commit: Runs lint-staged
   - Commit-msg: Validates commit messages

5. **Commitlint** (`commitlint.config.js`)
   - Enforces conventional commits
   - Standardized commit types

### Step 4: Project Structure

```
src/
├── app/                 # Next.js 14 App Router
│   ├── layout.tsx      # Root layout with providers
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/
│   └── ui/             # Shadcn/ui components
│       └── button.tsx  # Example component
├── lib/
│   ├── prisma.ts       # Prisma client singleton
│   └── utils.ts        # Utility functions
├── hooks/
│   └── useCart.ts      # Cart state management
├── types/
│   └── index.ts        # TypeScript types
├── constants/
│   └── index.ts        # App constants
└── middleware.ts       # Clerk auth middleware
```

---

## Package Documentation

### Authentication: Clerk

**Use Case**: Complete user authentication solution

```typescript
// middleware.ts - Protects routes (Updated for Clerk v5)
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

// layout.tsx - Wraps app with ClerkProvider
<ClerkProvider>
  {children}
</ClerkProvider>
```

**Features**:

- Social logins (Google, GitHub, etc.)
- Email/password authentication
- User profiles
- Session management
- Webhook support

### Database: MongoDB + Prisma

**Use Case**: Type-safe database access

```typescript
// prisma/schema.prisma - Database schema
model Product {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  price       Float
  // ... other fields
}

// Usage in API routes
import { prisma } from '@/lib/prisma';

const products = await prisma.product.findMany({
  where: { featured: true },
  include: { category: true }
});
```

### State Management: Zustand

**Use Case**: Client-side state (shopping cart)

```typescript
// hooks/useCart.ts
export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        // Add to cart logic
      },
      // ... other methods
    }),
    { name: 'saakie-cart' } // Persists to localStorage
  )
);

// Usage in components
const { items, addItem } = useCart();
```

### Data Fetching: React Query

**Use Case**: Server state management with caching

```typescript
// Example: Fetch products
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['products', category],
  queryFn: () => fetchProducts(category),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### UI Components: Shadcn/ui + Radix UI

**Use Case**: Accessible, customizable components

```typescript
// components/ui/button.tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva('base-styles', {
  variants: {
    variant: {
      default: 'default-styles',
      destructive: 'destructive-styles',
    },
    size: {
      default: 'h-10 px-4',
      sm: 'h-9 px-3',
    },
  },
});
```

### Styling: Tailwind CSS

**Use Case**: Utility-first CSS framework

```typescript
// Responsive design example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Product cards */}
</div>

// Dark mode support
<div className="bg-white dark:bg-gray-900">
  {/* Content */}
</div>
```

---

## System Architecture & Flow

### 1. Authentication Flow

```
User visits site → Clerk middleware checks auth status
                ↓
    Unauthenticated → Redirect to /sign-in
                ↓
    Authenticated → Access protected routes
                ↓
    User data synced with database via webhooks
```

### 2. Data Flow Architecture

```
Client Component → React Query → API Route → Prisma → MongoDB
        ↑                ↓
        └── Zustand ←────┘
         (Local State)
```

### 3. E-commerce Flow

```
1. Browse Products
   - Server-side rendered product pages
   - React Query for filtering/pagination
   - Optimistic updates for favorites

2. Add to Cart
   - Zustand manages cart state
   - Persisted to localStorage
   - Synced with server on checkout

3. Checkout Process
   - Clerk ensures authentication
   - Address selection/creation
   - Payment processing (Stripe/Razorpay)
   - Order creation in database

4. Order Management
   - Real-time status updates
   - Email notifications
   - Order tracking
```

### 4. Component Architecture

```
app/
├── (auth)/
│   ├── sign-in/
│   └── sign-up/
├── (shop)/
│   ├── products/
│   │   ├── page.tsx          # Product listing
│   │   └── [id]/page.tsx     # Product detail
│   ├── categories/
│   │   └── [slug]/page.tsx   # Category page
│   └── cart/
│       └── page.tsx          # Shopping cart
├── (user)/
│   ├── profile/
│   ├── orders/
│   └── addresses/
└── api/
    ├── products/
    ├── orders/
    └── webhooks/
        └── clerk/            # User sync
```

---

## Development Workflow

### 1. Git Workflow with Conventional Commits

```bash
# Feature development
git checkout -b feat/product-filters

# Make changes and commit
git add .
git commit -m "feat: add price range filter to product listing"

# Commit types:
# feat: New feature
# fix: Bug fix
# docs: Documentation
# style: Code style changes
# refactor: Code refactoring
# perf: Performance improvements
# test: Tests
# chore: Maintenance
```

### 2. Code Quality Checks

```bash
# Run before committing (automated by Husky)
npm run lint        # ESLint checks
npm run format      # Prettier formatting
npm run type-check  # TypeScript validation

# Manual checks
npm run lint:fix    # Auto-fix linting issues
npm run format:check # Check formatting
```

### 3. Database Workflow

```bash
# Schema changes
1. Edit prisma/schema.prisma
2. npx prisma generate    # Generate types
3. npx prisma db push     # Update database

# Migrations (production)
npx prisma migrate dev --name add_product_tags
npx prisma migrate deploy
```

---

## Code Examples

### 1. Creating a Product Listing Page

```typescript
// app/products/page.tsx
import { Suspense } from 'react';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductFilters } from '@/components/products/product-filters';

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Collection</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ProductFilters />
        </aside>

        <main className="lg:col-span-3">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid
              category={searchParams.category}
              sort={searchParams.sort}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
```

### 2. API Route with Prisma

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const sort = searchParams.get('sort');

  try {
    const products = await prisma.product.findMany({
      where: category ? { category: { slug: category } } : {},
      include: { category: true },
      orderBy: sort === 'price-asc' ? { price: 'asc' } : { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

### 3. React Query Hook

```typescript
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types';

async function fetchProducts(params: {
  category?: string;
  sort?: string;
}): Promise<Product[]> {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(`/api/products?${searchParams}`);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

export function useProducts(params: { category?: string; sort?: string }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

### 4. Zustand Store with TypeScript

```typescript
// stores/useStore.ts
interface StoreState {
  filters: {
    priceRange: [number, number];
    categories: string[];
    inStock: boolean;
  };
  setFilters: (filters: Partial<StoreState['filters']>) => void;
  resetFilters: () => void;
}

const defaultFilters = {
  priceRange: [0, 10000] as [number, number],
  categories: [],
  inStock: true,
};

export const useStore = create<StoreState>((set) => ({
  filters: defaultFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
```

### 5. Server Actions (Next.js 14)

```typescript
// app/actions/products.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const categoryId = formData.get('categoryId') as string;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        categoryId,
        // ... other fields
      },
    });

    revalidatePath('/products');
    return { success: true, product };
  } catch (error) {
    return { success: false, error: 'Failed to create product' };
  }
}
```

---

## Testing Commands

```bash
# Development
npm run dev           # Start dev server
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking

# Production Build
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma studio    # Visual database editor
npx prisma generate  # Generate Prisma client
npx prisma db push   # Sync schema with database
```

## Environment Variables Required

```env
# Database
DATABASE_URL="mongodb+srv://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Payment (Stripe/Razorpay)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

This documentation covers the complete setup, package use cases, and system flow of the Saakie e-commerce platform.

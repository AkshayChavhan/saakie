# Saakie Architecture & Flow Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                             │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │   Next.js   │  │ React Query  │  │      Zustand           │ │
│  │   Pages     │  │   (Cache)    │  │  (Local State)         │ │
│  └──────┬──────┘  └──────┬───────┘  └────────┬───────────────┘ │
└─────────┼────────────────┼───────────────────┼─────────────────┘
          │                │                   │
          ▼                ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Server (Vercel)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Middleware  │  │ Server       │  │   API Routes       │   │
│  │   (Clerk)    │  │ Components   │  │  (REST/Actions)    │   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────┘   │
└─────────┼─────────────────┼───────────────────┼────────────────┘
          │                 │                   │
          ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │    Clerk     │  │   MongoDB    │  │  Cloudinary/       │   │
│  │    Auth      │  │  Database    │  │  Stripe            │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Flow Diagrams

### 1. Authentication Flow

```
User Access Flow:
═══════════════

1. Anonymous User
   │
   ├─→ Public Routes (/, /products, /categories)
   │   └─→ Direct Access
   │
   └─→ Protected Routes (/cart, /profile, /checkout)
       │
       └─→ Middleware Check (Clerk)
           │
           ├─→ Authenticated → Allow Access
           │
           └─→ Not Authenticated → Redirect to /sign-in
               │
               └─→ Sign In/Up Process
                   │
                   ├─→ Email/Password
                   ├─→ Google OAuth
                   └─→ Other Social Providers
                       │
                       └─→ Webhook → Create User in DB
                           │
                           └─→ Redirect to Original Route
```

### 2. Product Browsing Flow

```
Product Discovery:
═════════════════

Homepage
    │
    ├─→ Featured Products (SSR)
    │   └─→ Server Component fetches from DB
    │
    ├─→ Category Navigation
    │   └─→ /categories/[slug]
    │       └─→ Dynamic Route with Filters
    │
    └─→ Search
        └─→ /products?search=query
            │
            └─→ Server-Side Filtering
                │
                ├─→ Prisma Query with Full-Text Search
                └─→ Return Filtered Results

Client-Side Interactions:
    │
    ├─→ Sort Products (React Query)
    ├─→ Filter by Price (URL Params)
    ├─→ Filter by Size/Color (Zustand)
    └─→ Pagination (Infinite Scroll)
```

### 3. Shopping Cart Flow

```
Cart Management:
═══════════════

Add to Cart:
    │
    ├─→ Product Page
    │   ├─→ Select Options (Size/Color)
    │   └─→ Click "Add to Cart"
    │       │
    │       └─→ Zustand Store Update
    │           ├─→ Check Existing Item
    │           ├─→ Update Quantity or Add New
    │           └─→ Persist to LocalStorage
    │
    └─→ Quick Add (Product Grid)
        └─→ Default Options → Add to Cart

Cart Page:
    │
    ├─→ Display Items from Zustand
    ├─→ Update Quantities
    │   └─→ Optimistic Update → Validate Stock
    ├─→ Remove Items
    └─→ Calculate Totals
        ├─→ Subtotal
        ├─→ Shipping (Free above ₹2999)
        └─→ Total

Proceed to Checkout:
    │
    └─→ Authenticate Check
        ├─→ Guest → Sign In/Up
        └─→ User → Checkout Page
```

### 4. Checkout & Order Flow

```
Checkout Process:
════════════════

1. Checkout Page Load
   │
   ├─→ Fetch User Addresses (React Query)
   ├─→ Validate Cart Items (Server Action)
   │   ├─→ Check Stock Availability
   │   └─→ Update Prices if Changed
   └─→ Calculate Final Total

2. Address Selection
   │
   ├─→ Select Existing Address
   └─→ Add New Address
       └─→ Server Action → Save to DB

3. Payment Method Selection
   │
   ├─→ Card (Stripe/Razorpay)
   ├─→ UPI
   ├─→ Net Banking
   └─→ Cash on Delivery

4. Place Order
   │
   └─→ Server Action (Transaction)
       │
       ├─→ Create Order in DB
       ├─→ Update Inventory
       ├─→ Process Payment
       │   └─→ Payment Gateway Integration
       ├─→ Send Confirmation Email
       └─→ Clear Cart (Zustand)
           │
           └─→ Redirect to Order Success
```

### 5. Data Fetching Patterns

```
Server Components (SSR/SSG):
═══════════════════════════

Page Request → Server Component
                    │
                    ├─→ Direct DB Query (Prisma)
                    ├─→ No Client JS Required
                    └─→ Return HTML with Data

Example: Product Listing Page
    │
    └─→ app/products/page.tsx
        │
        └─→ const products = await prisma.product.findMany()
            └─→ Render Product Grid

Client Components (CSR):
═══════════════════════

Interactive Component → React Query
                           │
                           ├─→ Check Cache
                           │   ├─→ Fresh → Return Data
                           │   └─→ Stale → Background Refetch
                           │
                           └─→ No Cache → Fetch from API
                               │
                               └─→ /api/products
                                   │
                                   └─→ Prisma Query
                                       └─→ Return JSON
```

### 6. State Management Flow

```
State Types & Management:
════════════════════════

1. Server State (React Query)
   │
   ├─→ Products, Categories, Orders
   ├─→ Cached with TTL
   └─→ Background Sync

2. Client State (Zustand)
   │
   ├─→ Shopping Cart
   │   └─→ Persisted to LocalStorage
   ├─→ UI State (Modals, Filters)
   └─→ User Preferences

3. Form State (React Hook Form)
   │
   ├─→ Checkout Forms
   ├─→ Address Forms
   └─→ Profile Updates

4. URL State (Next.js Router)
   │
   ├─→ Filters & Sorting
   ├─→ Pagination
   └─→ Search Queries
```

### 7. Performance Optimization Flow

```
Optimization Strategies:
═══════════════════════

1. Image Optimization
   │
   ├─→ Next.js Image Component
   │   ├─→ Automatic WebP/AVIF
   │   ├─→ Responsive Sizes
   │   └─→ Lazy Loading
   │
   └─→ Cloudinary Integration
       ├─→ On-demand Transformations
       └─→ CDN Delivery

2. Code Splitting
   │
   ├─→ Route-based Splitting (Automatic)
   ├─→ Component Lazy Loading
   │   └─→ const Modal = lazy(() => import('./Modal'))
   └─→ Third-party Libraries
       └─→ Dynamic Imports

3. Caching Strategy
   │
   ├─→ Static Pages (SSG)
   │   └─→ Build Time Generation
   ├─→ Dynamic Pages (ISR)
   │   └─→ Revalidate on Interval
   └─→ Client Cache (React Query)
       ├─→ Stale While Revalidate
       └─→ Optimistic Updates
```

### 8. Error Handling Flow

```
Error Boundaries:
════════════════

Application Error
    │
    ├─→ Page Level error.tsx
    │   └─→ Graceful Error Display
    │
    ├─→ API Route Errors
    │   └─→ Structured Error Response
    │       └─→ { error: message, code: ERROR_CODE }
    │
    └─→ Client-Side Errors
        ├─→ React Query Error Handling
        │   └─→ Retry Logic
        └─→ Toast Notifications
            └─→ User-Friendly Messages
```

### 9. Deployment Flow

```
CI/CD Pipeline:
══════════════

Git Push → GitHub
    │
    └─→ GitHub Actions
        │
        ├─→ Run Tests
        ├─→ Type Check
        ├─→ Lint & Format
        └─→ Build
            │
            └─→ Deploy to Vercel
                │
                ├─→ Preview Deployment (PR)
                └─→ Production (main branch)
                    │
                    └─→ Edge Functions
                        └─→ Global CDN
```

## Security Flow

```
Security Measures:
═════════════════

1. Authentication (Clerk)
   │
   ├─→ JWT Session Management
   ├─→ CSRF Protection
   └─→ Rate Limiting

2. API Security
   │
   ├─→ Input Validation (Zod)
   ├─→ SQL Injection Prevention (Prisma)
   └─→ CORS Configuration

3. Payment Security
   │
   ├─→ PCI Compliance (Stripe)
   ├─→ Webhook Verification
   └─→ SSL/TLS Encryption

4. Data Protection
   │
   ├─→ Environment Variables
   ├─→ Encrypted Database
   └─→ Secure Cookies
```

## Monitoring & Analytics Flow

```
Observability:
═════════════

User Action → Application
    │
    ├─→ Error Tracking (Sentry)
    │   └─→ Real-time Alerts
    │
    ├─→ Performance Monitoring
    │   ├─→ Core Web Vitals
    │   └─→ API Response Times
    │
    └─→ Analytics
        ├─→ Google Analytics 4
        ├─→ Custom Events
        └─→ Conversion Tracking
```

This architecture ensures a scalable, performant, and maintainable e-commerce platform following MAANG-level best practices.

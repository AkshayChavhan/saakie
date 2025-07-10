# Package Use Cases - Detailed Documentation

## Core Packages

### 1. Next.js 14 (Framework)

**Version**: 14.2.4  
**Purpose**: Full-stack React framework with server-side rendering

**Use Cases**:

- **App Router**: File-based routing with layouts and nested routes
- **Server Components**: Reduced JavaScript bundle size
- **Server Actions**: Direct database mutations from components
- **API Routes**: Backend endpoints within the same project
- **Image Optimization**: Automatic image optimization and lazy loading
- **Middleware**: Request interception for authentication

**Example Flow**:

```
User Request → Middleware (auth check) → Route Handler →
Server Component (data fetch) → Client Component (interactivity)
```

### 2. TypeScript

**Version**: 5.5.3  
**Purpose**: Type safety and better developer experience

**Use Cases**:

- **Type Safety**: Catch errors at compile time
- **IntelliSense**: Better IDE support
- **Code Documentation**: Types serve as inline documentation
- **Refactoring**: Safe code refactoring with type checking

**Example**:

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

// Type safety ensures correct data structure
const formatProduct = (product: Product): FormattedProduct => {
  return {
    ...product,
    displayPrice: formatPrice(product.price),
    thumbnail: product.images[0] || '/placeholder.jpg',
  };
};
```

### 3. Tailwind CSS

**Version**: 3.4.4  
**Purpose**: Utility-first CSS framework

**Use Cases**:

- **Rapid Styling**: No context switching between CSS files
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode**: Built-in dark mode support
- **Custom Themes**: CSS variables for consistent theming

**Utility Classes Flow**:

```
Component → Tailwind Classes → PostCSS → Optimized CSS
Example: "bg-white dark:bg-gray-900 p-4 md:p-6 rounded-lg shadow-md"
```

## Authentication & User Management

### 4. Clerk (@clerk/nextjs)

**Version**: 5.2.4  
**Purpose**: Complete authentication solution

**Use Cases**:

- **User Registration**: Email/password, social logins
- **Session Management**: Secure JWT-based sessions
- **User Profiles**: Built-in user management UI
- **Webhooks**: Sync users with database
- **Organizations**: Multi-tenant support

**Authentication Flow**:

```
1. User attempts to access protected route
2. Middleware checks Clerk session
3. If unauthenticated → Redirect to /sign-in
4. After sign-in → Webhook creates user in database
5. User accesses protected content
```

## Database & ORM

### 5. Prisma

**Version**: 5.16.1  
**Purpose**: Type-safe database ORM

**Use Cases**:

- **Schema Definition**: Declarative data modeling
- **Type Generation**: Auto-generated TypeScript types
- **Migrations**: Version control for database schema
- **Query Builder**: Type-safe database queries

**Data Flow**:

```
Prisma Schema → Generate Types → Use in Application
      ↓
   Database
```

### 6. MongoDB (via Prisma)

**Purpose**: NoSQL database for flexible data structure

**Use Cases**:

- **Product Catalog**: Variable attributes for different saree types
- **User Profiles**: Flexible user data structure
- **Order History**: Complex nested order data
- **Real-time Inventory**: Fast updates and queries

## State Management

### 7. Zustand

**Version**: 4.5.4  
**Purpose**: Lightweight client-side state management

**Use Cases**:

- **Shopping Cart**: Persistent cart across sessions
- **UI State**: Modals, sidebars, filters
- **User Preferences**: Theme, language, display options
- **Optimistic Updates**: Immediate UI feedback

**State Flow**:

```
Component → useStore Hook → Zustand Store → LocalStorage
                ↓                   ↑
            Update UI          Persist State
```

### 8. React Query (@tanstack/react-query)

**Version**: 5.51.1  
**Purpose**: Server state management

**Use Cases**:

- **Data Fetching**: Declarative data fetching
- **Caching**: Intelligent cache management
- **Background Refetching**: Keep data fresh
- **Optimistic Updates**: Immediate UI updates
- **Infinite Queries**: Pagination and infinite scroll

**Query Flow**:

```
Component → useQuery → Check Cache → Fetch if Stale → Update Cache
                           ↓                              ↓
                    Return Cached Data             Update Component
```

## UI Components

### 9. Radix UI (@radix-ui/react-\*)

**Purpose**: Unstyled, accessible component primitives

**Components & Use Cases**:

- **Dialog**: Product quick view, cart modal
- **Dropdown Menu**: User menu, sort options
- **Accordion**: FAQ, product details
- **Toast**: Notifications, success messages
- **Select**: Size/color selection
- **Slider**: Price range filter
- **Tabs**: Product information sections

### 10. Shadcn/UI Components

**Purpose**: Pre-styled Radix UI components

**Use Cases**:

- **Consistent Design**: Unified component library
- **Customizable**: Tailwind-based styling
- **Copy-paste**: Own the code, no dependency
- **Dark Mode**: Built-in theme support

## Utility Libraries

### 11. class-variance-authority (CVA)

**Version**: 0.7.0  
**Purpose**: Dynamic className generation

**Use Case Example**:

```typescript
const button = cva('base-classes', {
  variants: {
    intent: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      small: 'text-sm py-1 px-2',
      medium: 'text-base py-2 px-4',
    },
  },
});

// Usage: button({ intent: "primary", size: "medium" })
```

### 12. clsx

**Version**: 2.1.1  
**Purpose**: Conditional className concatenation

**Use Cases**:

```typescript
// Conditional classes
className={clsx(
  "base-class",
  isActive && "active-class",
  { "error-class": hasError }
)}
```

### 13. tailwind-merge

**Version**: 2.3.0  
**Purpose**: Merge Tailwind classes without conflicts

**Use Case**:

```typescript
// Prevents class conflicts
cn('p-4 p-8'); // Results in "p-8" only
```

### 14. Lucide React

**Version**: 0.396.0  
**Purpose**: Icon library

**Use Cases**:

- Navigation icons
- Action buttons
- Status indicators
- Loading states

## Development Tools

### 15. ESLint + Airbnb Config

**Purpose**: Code quality and consistency

**Rules Enforced**:

- Import ordering
- Variable naming conventions
- React best practices
- TypeScript specific rules
- Accessibility checks

### 16. Prettier

**Version**: 3.3.2  
**Purpose**: Code formatting

**Features**:

- Consistent code style
- Tailwind class sorting
- Automatic formatting on save
- Git hook integration

### 17. Husky

**Version**: 9.0.11  
**Purpose**: Git hooks

**Hooks Configured**:

- **pre-commit**: Run lint-staged
- **commit-msg**: Validate commit message

### 18. lint-staged

**Version**: 15.2.7  
**Purpose**: Run linters on staged files

**Workflow**:

```
Git add → Pre-commit hook → lint-staged →
ESLint fix → Prettier format → Proceed with commit
```

### 19. Commitlint

**Version**: 19.3.0  
**Purpose**: Enforce commit conventions

**Commit Types**:

```
feat: New feature
fix: Bug fix
docs: Documentation
style: Formatting
refactor: Code restructuring
perf: Performance
test: Tests
chore: Maintenance
```

## Package Interaction Flow

### Complete User Journey Example:

1. **User Browses Products**
   - Next.js serves SSR page
   - React Query fetches and caches data
   - Tailwind styles the UI
   - Radix/Shadcn components for interaction

2. **User Adds to Cart**
   - Zustand updates local state
   - LocalStorage persists cart
   - Toast notification (Radix)
   - Optimistic UI update

3. **User Proceeds to Checkout**
   - Clerk ensures authentication
   - Prisma fetches user data
   - React Query manages addresses
   - Server Action processes order

4. **Order Processing**
   - Database transaction (Prisma)
   - Payment gateway integration
   - Email notification
   - Real-time status updates

This comprehensive flow demonstrates how all packages work together to create a seamless e-commerce experience.

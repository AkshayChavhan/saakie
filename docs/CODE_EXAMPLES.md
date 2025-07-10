# Saakie - Common Code Examples & Patterns

## Table of Contents

1. [Product Management](#product-management)
2. [Shopping Cart Implementation](#shopping-cart-implementation)
3. [Authentication Patterns](#authentication-patterns)
4. [API Routes & Server Actions](#api-routes--server-actions)
5. [React Query Patterns](#react-query-patterns)
6. [Form Handling](#form-handling)
7. [Real-world Components](#real-world-components)

---

## Product Management

### 1. Product Card Component

```typescript
// src/components/products/product-card.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    setIsLoading(true);

    try {
      addItem({
        productId: product.id,
        quantity: 1,
        price: product.price,
      });

      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-md transition-all hover:scale-110"
          >
            <Heart
              className={cn(
                'h-4 w-4',
                isFavorite && 'fill-red-500 text-red-500'
              )}
            />
          </button>

          {/* Stock Badge */}
          {product.stock < 5 && product.stock > 0 && (
            <div className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-1 text-xs text-white">
              Only {product.stock} left
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-red-500 px-4 py-2 text-white">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-medium">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            {product.category.name}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold">
              {formatPrice(product.price)}
            </span>

            <Button
              size="sm"
              variant="outline"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isLoading}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
```

### 2. Product Filters Component

```typescript
// src/components/products/product-filters.tsx
import { useRouter, useSearchParams } from 'next/navigation';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PRODUCT_CATEGORIES, SORT_OPTIONS } from '@/constants';
import { useState, useCallback } from 'react';

export const ProductFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    parseInt(searchParams.get('maxPrice') || '10000'),
  ]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('categories')?.split(',').filter(Boolean) || []
  );

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    // Price filter
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    else params.delete('minPrice');

    if (priceRange[1] < 10000) params.set('maxPrice', priceRange[1].toString());
    else params.delete('maxPrice');

    // Category filter
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    } else {
      params.delete('categories');
    }

    router.push(`/products?${params.toString()}`);
  }, [priceRange, selectedCategories, searchParams, router]);

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedCategories([]);
    router.push('/products');
  };

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="mb-4 text-sm font-semibold">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={10000}
          step={100}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-4 text-sm font-semibold">Categories</h3>
        <div className="space-y-2">
          {PRODUCT_CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category.id]);
                  } else {
                    setSelectedCategories(
                      selectedCategories.filter((c) => c !== category.id)
                    );
                  }
                }}
              />
              <Label
                htmlFor={category.id}
                className="cursor-pointer text-sm font-normal"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  );
};
```

## Shopping Cart Implementation

### 3. Cart Page with Optimistic Updates

```typescript
// src/app/cart/page.tsx
'use client';

import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function CartPage() {
  const { items, clearCart, getTotalPrice } = useCart();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!isSignedIn) {
      router.push('/sign-in?redirect_url=/checkout');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-8 text-muted-foreground">
          Add some beautiful sarees to get started
        </p>
        <Link href="/products">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Link href="/products">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>

            <Button
              variant="destructive"
              onClick={() => {
                if (confirm('Are you sure you want to clear your cart?')) {
                  clearCart();
                }
              }}
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            subtotal={getTotalPrice()}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
```

### 4. Cart Item Component with Stock Validation

```typescript
// src/components/cart/cart-item.tsx
import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

async function fetchProduct(productId: string) {
  const res = await fetch(`/api/products/${productId}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch latest product data for stock validation
  const { data: product } = useQuery({
    queryKey: ['product', item.productId],
    queryFn: () => fetchProduct(item.productId),
    staleTime: 5 * 60 * 1000,
  });

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);

    // Check stock
    if (product && newQuantity > product.stock) {
      alert(`Only ${product.stock} items available`);
      setIsUpdating(false);
      return;
    }

    updateQuantity(item.id, newQuantity);
    setIsUpdating(false);
  };

  if (!product) {
    return <div className="h-32 animate-pulse rounded-lg bg-gray-200" />;
  }

  return (
    <div className="flex gap-4 rounded-lg border p-4">
      {/* Product Image */}
      <div className="relative h-24 w-24 overflow-hidden rounded-md">
        <Image
          src={product.images[0] || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {product.category.name}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              className="h-8 w-16 text-center"
              min="1"
              max={product.stock}
              disabled={isUpdating}
            />

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-semibold">
              {formatPrice(item.price * item.quantity)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatPrice(item.price)} each
            </p>
          </div>
        </div>

        {/* Stock Warning */}
        {product.stock < 5 && product.stock > 0 && (
          <p className="mt-2 text-xs text-orange-500">
            Only {product.stock} left in stock
          </p>
        )}
      </div>
    </div>
  );
};
```

## Authentication Patterns

### 5. Protected Route Wrapper

```typescript
// src/components/auth/protected-route.tsx
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackUrl?: string;
}

export const ProtectedRoute = ({
  children,
  fallbackUrl = '/sign-in'
}: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isSignedIn) {
    redirect(fallbackUrl);
  }

  return <>{children}</>;
};
```

### 6. User Profile Sync

```typescript
// src/app/api/webhooks/clerk/route.ts
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim();

    await prisma.user.upsert({
      where: { clerkId: id },
      update: { email, name },
      create: {
        clerkId: id,
        email,
        name,
      },
    });
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    await prisma.user.delete({
      where: { clerkId: id },
    });
  }

  return new Response('', { status: 200 });
}
```

## API Routes & Server Actions

### 7. Product Search API

```typescript
// src/app/api/products/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const searchSchema = z.object({
  q: z.string().min(1),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sort: z.enum(['price-asc', 'price-desc', 'name-asc', 'name-desc']).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const params = searchSchema.parse(searchParams);

    const where = {
      AND: [
        {
          OR: [
            { name: { contains: params.q, mode: 'insensitive' } },
            { description: { contains: params.q, mode: 'insensitive' } },
          ],
        },
        params.category ? { category: { slug: params.category } } : {},
        params.minPrice ? { price: { gte: params.minPrice } } : {},
        params.maxPrice ? { price: { lte: params.maxPrice } } : {},
      ],
    };

    const orderBy = {
      'price-asc': { price: 'asc' },
      'price-desc': { price: 'desc' },
      'name-asc': { name: 'asc' },
      'name-desc': { name: 'desc' },
    }[params.sort || 'name-asc'];

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 8. Order Creation Server Action

```typescript
// src/app/actions/orders.ts
'use server';

import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { CartItem } from '@/types';

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      price: z.number(),
    })
  ),
  addressId: z.string(),
  paymentMethod: z.enum(['CARD', 'UPI', 'NET_BANKING', 'COD']),
});

export async function createOrder(data: unknown) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate input
    const validatedData = createOrderSchema.parse(data);

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { addresses: true },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Validate address
    const address = user.addresses.find(
      (addr) => addr.id === validatedData.addressId
    );

    if (!address) {
      return { success: false, error: 'Invalid address' };
    }

    // Start transaction
    const order = await prisma.$transaction(async (tx) => {
      // Validate stock for all items
      for (const item of validatedData.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.stock}`
          );
        }
      }

      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount: validatedData.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          shippingAddress: address,
          paymentMethod: validatedData.paymentMethod,
          items: {
            create: validatedData.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update stock
      for (const item of validatedData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    revalidatePath('/orders');
    revalidatePath('/products');

    return { success: true, order };
  } catch (error) {
    console.error('Order creation error:', error);

    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid order data' };
    }

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: 'Failed to create order' };
  }
}
```

## React Query Patterns

### 9. Infinite Scroll Products

```typescript
// src/hooks/useInfiniteProducts.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { Product } from '@/types';

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
}

async function fetchProducts({
  pageParam = 1,
  category,
  sort,
}: {
  pageParam?: number;
  category?: string;
  sort?: string;
}): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    page: pageParam.toString(),
    limit: '12',
    ...(category && { category }),
    ...(sort && { sort }),
  });

  const response = await fetch(`/api/products?${params}`);
  if (!response.ok) throw new Error('Failed to fetch products');

  const data = await response.json();

  return {
    products: data.products,
    pagination: {
      ...data.pagination,
      hasMore: pageParam < data.pagination.totalPages,
    },
  };
}

export function useInfiniteProducts(category?: string, sort?: string) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', category, sort],
    queryFn: ({ pageParam }) => fetchProducts({ pageParam, category, sort }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined,
    staleTime: 5 * 60 * 1000,
  });
}

// Usage in component
export function ProductGrid() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteProducts();

  // Flatten pages
  const products = data?.pages.flatMap(page => page.products) ?? [];

  return (
    <InfiniteScroll
      dataLength={products.length}
      next={fetchNextPage}
      hasMore={hasNextPage || false}
      loader={<ProductSkeleton count={4} />}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
```

## Form Handling

### 10. Address Form with Validation

```typescript
// src/components/address/address-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

const addressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  isDefault: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => Promise<void>;
  defaultValues?: Partial<AddressFormData>;
}

export function AddressForm({ onSubmit, defaultValues }: AddressFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  const handleFormSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true);

    try {
      await onSubmit(data);
      toast({
        title: 'Success',
        description: 'Address saved successfully',
      });
      reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save address',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="line1">Address Line 1</Label>
        <Input
          id="line1"
          {...register('line1')}
          placeholder="House/Flat No., Building Name"
        />
        {errors.line1 && (
          <p className="mt-1 text-sm text-red-500">{errors.line1.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="line2">Address Line 2 (Optional)</Label>
        <Input
          id="line2"
          {...register('line2')}
          placeholder="Street, Locality"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register('city')} />
          {errors.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register('state')} />
          {errors.state && (
            <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="pincode">Pincode</Label>
        <Input
          id="pincode"
          {...register('pincode')}
          placeholder="6 digit pincode"
          maxLength={6}
        />
        {errors.pincode && (
          <p className="mt-1 text-sm text-red-500">{errors.pincode.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isDefault"
          {...register('isDefault')}
          className="h-4 w-4"
        />
        <Label htmlFor="isDefault" className="cursor-pointer">
          Set as default address
        </Label>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Saving...' : 'Save Address'}
      </Button>
    </form>
  );
}
```

## Real-world Components

### 11. Order Status Tracker

```typescript
// src/components/orders/order-status-tracker.tsx
import { CheckCircle, Circle, Package, Truck, Home } from 'lucide-react';
import { OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

interface OrderStatusTrackerProps {
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const statusSteps = [
  { status: OrderStatus.CONFIRMED, label: 'Order Confirmed', icon: CheckCircle },
  { status: OrderStatus.PROCESSING, label: 'Processing', icon: Package },
  { status: OrderStatus.SHIPPED, label: 'Shipped', icon: Truck },
  { status: OrderStatus.DELIVERED, label: 'Delivered', icon: Home },
];

export function OrderStatusTracker({
  status,
  createdAt,
  updatedAt
}: OrderStatusTrackerProps) {
  const currentStepIndex = statusSteps.findIndex(
    (step) => step.status === status
  );

  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute left-8 top-8 h-[calc(100%-64px)] w-0.5 bg-gray-200">
        <div
          className="h-full w-full bg-primary transition-all duration-500"
          style={{
            height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-8">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.status} className="flex items-start gap-4">
              <div
                className={cn(
                  'relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white transition-all',
                  isCompleted
                    ? 'border-primary text-primary'
                    : 'border-gray-300 text-gray-400'
                )}
              >
                <Icon
                  className={cn(
                    'h-6 w-6 transition-all',
                    isCurrent && 'animate-pulse'
                  )}
                />
              </div>

              <div className="flex-1 pt-2">
                <h3
                  className={cn(
                    'font-semibold',
                    isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </h3>

                {isCurrent && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {status === OrderStatus.CONFIRMED &&
                      `Confirmed on ${formatDate(createdAt)}`}
                    {status === OrderStatus.PROCESSING &&
                      'Your order is being prepared'}
                    {status === OrderStatus.SHIPPED &&
                      'Your order is on the way'}
                    {status === OrderStatus.DELIVERED &&
                      `Delivered on ${formatDate(updatedAt)}`}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### 12. Payment Method Selector

```typescript
// src/components/checkout/payment-method-selector.tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, Building, Banknote } from 'lucide-react';
import { PaymentMethod } from '@/types';
import { PAYMENT_METHODS } from '@/constants';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

const paymentIcons = {
  [PaymentMethod.CARD]: CreditCard,
  [PaymentMethod.UPI]: Smartphone,
  [PaymentMethod.NET_BANKING]: Building,
  [PaymentMethod.COD]: Banknote,
};

export function PaymentMethodSelector({
  value,
  onChange
}: PaymentMethodSelectorProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Object.entries(PAYMENT_METHODS).map(([key, label]) => {
          const Icon = paymentIcons[key as PaymentMethod];

          return (
            <div key={key}>
              <RadioGroupItem
                value={key}
                id={key}
                className="peer sr-only"
              />
              <Label
                htmlFor={key}
                className="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all hover:bg-accent peer-checked:border-primary peer-checked:bg-primary/5"
              >
                <Icon className="h-5 w-5" />
                <div>
                  <p className="font-medium">{label}</p>
                  {key === PaymentMethod.COD && (
                    <p className="text-xs text-muted-foreground">
                      ₹50 extra charges
                    </p>
                  )}
                  {key === PaymentMethod.UPI && (
                    <p className="text-xs text-muted-foreground">
                      Instant payment
                    </p>
                  )}
                </div>
              </Label>
            </div>
          );
        })}
      </div>
    </RadioGroup>
  );
}
```

These examples demonstrate real-world patterns for building a production-ready e-commerce platform with Next.js 14, following MAANG-level best practices.

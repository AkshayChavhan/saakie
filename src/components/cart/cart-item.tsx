'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

// Mock product data to get product details
const mockProducts = [
  {
    id: '1',
    name: 'Elegant Silk Saree with Golden Border',
    images: ['/api/placeholder/300/400'],
    category: { name: 'Silk Sarees' },
    stock: 10,
  },
  {
    id: '2',
    name: 'Contemporary Cotton Saree',
    images: ['/api/placeholder/300/400'],
    category: { name: 'Cotton Sarees' },
    stock: 15,
  },
  {
    id: '3',
    name: 'Designer Wedding Saree',
    images: ['/api/placeholder/300/400'],
    category: { name: 'Wedding Collection' },
    stock: 5,
  },
  {
    id: '4',
    name: 'Party Wear Georgette Saree',
    images: ['/api/placeholder/300/400'],
    category: { name: 'Party Wear' },
    stock: 8,
  },
  {
    id: '5',
    name: 'Casual Handloom Saree',
    images: ['/api/placeholder/300/400'],
    category: { name: 'Casual Wear' },
    stock: 12,
  },
  {
    id: '6',
    name: 'Premium Banarasi Silk Saree',
    images: ['/api/placeholder/300/400'],
    category: { name: 'Silk Sarees' },
    stock: 3,
  },
];

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  // Get product details (in real app, this would come from API)
  const product = mockProducts.find((p) => p.id === item.productId);

  if (!product) {
    return (
      <div className="rounded-lg border p-4">
        <div className="text-center text-gray-500">Product not found</div>
      </div>
    );
  }

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);

    // Check stock
    if (newQuantity > product.stock) {
      alert(`Only ${product.stock} items available`);
      setIsUpdating(false);
      return;
    }

    updateQuantity(item.id, newQuantity);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsUpdating(false);
  };

  const handleRemove = () => {
    if (confirm('Remove this item from your cart?')) {
      removeItem(item.id);
    }
  };

  return (
    <div className="flex gap-4 rounded-lg border bg-white p-4">
      {/* Product Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={product.images[0] || '/api/placeholder/300/400'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div className="flex-1">
            <h3 className="line-clamp-2 font-medium text-gray-900">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {product.category.name}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="ml-4 text-red-500 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="w-8 text-center font-medium">{item.quantity}</span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {formatPrice(item.price * item.quantity)}
            </p>
            <p className="text-sm text-gray-500">
              {formatPrice(item.price)} each
            </p>
          </div>
        </div>

        {/* Stock Warning */}
        {product.stock < 5 && product.stock > 0 && (
          <p className="mt-2 text-sm text-orange-600">
            Only {product.stock} left in stock
          </p>
        )}
      </div>
    </div>
  );
};

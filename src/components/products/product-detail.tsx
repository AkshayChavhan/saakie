'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Minus, Plus, Share2 } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail = ({ product }: ProductDetailProps) => {
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      addItem({
        productId: product.id,
        quantity,
        price: product.price,
      });

      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={
              product.images[selectedImageIndex] || '/api/placeholder/400/600'
            }
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Thumbnail Images */}
        {product.images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2',
                  selectedImageIndex === index
                    ? 'border-primary'
                    : 'border-gray-200'
                )}
              >
                <Image
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={cn(
                    'h-4 w-4',
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  )}
                />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-2 flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {product.category.name}
            </span>
            {product.featured && (
              <span className="rounded-full bg-primary px-2 py-1 text-xs text-white">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.stock < 5 && product.stock > 0 && (
            <span className="text-sm font-medium text-orange-500">
              Only {product.stock} left in stock
            </span>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Description
          </h3>
          <p className="leading-relaxed text-gray-600">{product.description}</p>
        </div>

        {/* Quantity Selector */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Adding to Cart...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </div>
            )}
          </Button>

          {product.stock === 0 && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-600">
                This product is currently out of stock
              </p>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="border-t pt-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Product Details
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Category:
              </span>
              <p className="text-sm text-gray-600">{product.category.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Stock:</span>
              <p className="text-sm text-gray-600">
                {product.stock > 0
                  ? `${product.stock} available`
                  : 'Out of stock'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                Material:
              </span>
              <p className="text-sm text-gray-600">Premium Quality</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Care:</span>
              <p className="text-sm text-gray-600">Dry Clean Only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

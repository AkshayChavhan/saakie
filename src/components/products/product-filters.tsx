'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { PRODUCT_CATEGORIES } from '@/constants';
import { formatPrice } from '@/lib/utils';

export const ProductFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get('minPrice') || '0'),
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
    <div className="space-y-6 rounded-lg border p-6">
      <h2 className="text-lg font-semibold">Filters</h2>

      {/* Price Range */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Price Range</h3>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([parseInt(e.target.value), priceRange[1]])
            }
            className="w-full"
          />
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Categories</h3>
        <div className="space-y-2">
          {PRODUCT_CATEGORIES.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center space-x-2"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([...selectedCategories, category.id]);
                  } else {
                    setSelectedCategories(
                      selectedCategories.filter((c) => c !== category.id)
                    );
                  }
                }}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm">{category.name}</span>
            </label>
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

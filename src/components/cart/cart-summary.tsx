'use client';

import { ShoppingBag, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { SHIPPING_CHARGE, FREE_SHIPPING_THRESHOLD } from '@/constants';

interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
}

export const CartSummary = ({ subtotal, onCheckout }: CartSummaryProps) => {
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : SHIPPING_CHARGE;
  const total = subtotal + shippingCost;

  return (
    <div className="sticky top-24 rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Order Summary
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {isFreeShipping ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(shippingCost)
            )}
          </span>
        </div>

        {!isFreeShipping && (
          <div className="rounded-lg bg-blue-50 p-3">
            <div className="flex items-center text-blue-600">
              <Truck className="mr-2 h-4 w-4" />
              <span className="text-sm">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for
                free shipping
              </span>
            </div>
          </div>
        )}

        <hr className="my-4" />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <Button onClick={onCheckout} className="mt-6 w-full" size="lg">
        <ShoppingBag className="mr-2 h-5 w-5" />
        Proceed to Checkout
      </Button>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Secure checkout powered by Stripe
        </p>
      </div>
    </div>
  );
};

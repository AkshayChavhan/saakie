'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { ShoppingCart, Search, Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonWithLoading } from '@/components/ui/button-with-loading';
import { LinkWithLoading } from '@/components/ui/link-with-loading';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';

export const Header = () => {
  const { user } = useUser();
  const { getTotalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <LinkWithLoading href="/" className="flex items-center">
            <div className="rounded-lg bg-green-600 px-6 py-3 text-3xl font-bold text-white transition-colors hover:bg-green-700">
              Saakie
            </div>
          </LinkWithLoading>

          {/* Search Bar */}
          <div className="relative mx-8 hidden max-w-lg flex-1 md:block">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search for sarees..."
              className="h-12 pl-12 text-base"
            />
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <LinkWithLoading
              href="/products"
              className="text-base font-medium transition-colors hover:text-primary"
            >
              Products
            </LinkWithLoading>
            <LinkWithLoading
              href="/categories"
              className="text-base font-medium transition-colors hover:text-primary"
            >
              Categories
            </LinkWithLoading>

            {/* Cart */}
            <LinkWithLoading href="/cart" className="relative">
              <Button variant="ghost" size="lg" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </LinkWithLoading>

            {/* Admin Settings */}
            <ButtonWithLoading
              href="/admin"
              variant="outline"
              size="default"
              className="border-blue-200 bg-blue-50 px-4 py-2 text-base text-blue-700 hover:border-blue-300 hover:bg-blue-100"
            >
              <Settings className="mr-2 h-5 w-5" />
              Admin Settings
            </ButtonWithLoading>

            {/* Authentication */}
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="flex items-center space-x-3">
                <ButtonWithLoading
                  href="/sign-in"
                  variant="ghost"
                  size="default"
                  className="text-base"
                >
                  Sign In
                </ButtonWithLoading>
                <ButtonWithLoading
                  href="/sign-up"
                  size="default"
                  className="px-6 text-base"
                >
                  Sign Up
                </ButtonWithLoading>
              </div>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="lg" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

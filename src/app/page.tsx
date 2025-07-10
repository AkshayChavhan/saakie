import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import { ButtonWithLoading } from '@/components/ui/button-with-loading';

const HomePage = () => (
  <div className="min-h-screen">
    {/* Hero Section */}
    <section className="relative bg-gradient-to-r from-pink-50 to-purple-50 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
            Discover Exquisite
            <span className="block text-primary">Indian Sarees</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            From traditional silk to modern designs, find the perfect saree for
            every occasion. Crafted with love, delivered with care.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <ButtonWithLoading
              href="/products"
              size="lg"
              className="px-8 py-6 text-lg"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </ButtonWithLoading>
            <ButtonWithLoading
              href="/categories"
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg"
            >
              Browse Categories
            </ButtonWithLoading>
          </div>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Premium Quality</h3>
            <p className="text-gray-600">
              Handpicked sarees from skilled artisans across India
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Secure Shopping</h3>
            <p className="text-gray-600">
              Safe and secure payment with 100% buyer protection
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Fast Delivery</h3>
            <p className="text-gray-600">
              Free shipping on orders above ₹2,999 across India
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Categories Preview */}
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Shop by Category
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Explore our carefully curated collection of sarees for every
            occasion
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: 'Silk Sarees',
              description: 'Traditional elegance',
              color: 'bg-red-100 text-red-800',
              id: 'silk-sarees',
            },
            {
              name: 'Cotton Sarees',
              description: 'Everyday comfort',
              color: 'bg-blue-100 text-blue-800',
              id: 'cotton-sarees',
            },
            {
              name: 'Designer Sarees',
              description: 'Modern style',
              color: 'bg-purple-100 text-purple-800',
              id: 'designer-sarees',
            },
            {
              name: 'Wedding Collection',
              description: 'Special occasions',
              color: 'bg-pink-100 text-pink-800',
              id: 'wedding-collection',
            },
            {
              name: 'Party Wear',
              description: 'Evening elegance',
              color: 'bg-green-100 text-green-800',
              id: 'party-wear',
            },
            {
              name: 'Casual Wear',
              description: 'Daily comfort',
              color: 'bg-orange-100 text-orange-800',
              id: 'casual-wear',
            },
          ].map((category) => (
            <div
              key={category.id}
              className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`mb-3 inline-block rounded-full px-3 py-1 text-sm font-medium ${category.color}`}
              >
                {category.name}
              </div>
              <p className="mb-4 text-gray-600">{category.description}</p>
              <ButtonWithLoading
                href={`/products?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                variant="outline"
                size="sm"
              >
                Explore
              </ButtonWithLoading>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="bg-primary py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">
          Ready to Find Your Perfect Saree?
        </h2>
        <p className="mb-8 text-xl opacity-90">
          Join thousands of happy customers who trust Saakie for their saree
          needs
        </p>
        <ButtonWithLoading
          href="/products"
          size="lg"
          variant="secondary"
          className="px-8 py-6 text-lg"
        >
          Start Shopping
          <ArrowRight className="ml-2 h-5 w-5" />
        </ButtonWithLoading>
      </div>
    </section>
  </div>
);

export default HomePage;

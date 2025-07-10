import { ProductCard } from './product-card';

// Mock data for now
const mockProducts = [
  {
    id: '1',
    name: 'Elegant Silk Saree with Golden Border',
    description: 'Beautiful traditional silk saree perfect for weddings',
    price: 4500,
    images: ['/api/placeholder/300/400'],
    category: { id: 'silk', name: 'Silk Sarees', slug: 'silk-sarees' },
    stock: 10,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Contemporary Cotton Saree',
    description: 'Modern cotton saree for daily wear',
    price: 1800,
    images: ['/api/placeholder/300/400'],
    category: { id: 'cotton', name: 'Cotton Sarees', slug: 'cotton-sarees' },
    stock: 15,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Designer Wedding Saree',
    description: 'Luxurious designer saree for special occasions',
    price: 8500,
    images: ['/api/placeholder/300/400'],
    category: {
      id: 'wedding',
      name: 'Wedding Collection',
      slug: 'wedding-collection',
    },
    stock: 5,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Party Wear Georgette Saree',
    description: 'Stylish georgette saree for parties',
    price: 3200,
    images: ['/api/placeholder/300/400'],
    category: { id: 'party', name: 'Party Wear', slug: 'party-wear' },
    stock: 8,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Casual Handloom Saree',
    description: 'Comfortable handloom saree for everyday wear',
    price: 2200,
    images: ['/api/placeholder/300/400'],
    category: { id: 'casual', name: 'Casual Wear', slug: 'casual-wear' },
    stock: 12,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Premium Banarasi Silk Saree',
    description: 'Authentic Banarasi silk saree with intricate work',
    price: 12000,
    images: ['/api/placeholder/300/400'],
    category: { id: 'silk', name: 'Silk Sarees', slug: 'silk-sarees' },
    stock: 3,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface ProductGridProps {
  searchParams: {
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
  };
}

export const ProductGrid = ({ searchParams }: ProductGridProps) => {
  // Filter products based on search params
  let filteredProducts = [...mockProducts];

  // Filter by category
  if (searchParams.category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category.id === searchParams.category
    );
  }

  // Filter by price range
  if (searchParams.minPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= parseInt(searchParams.minPrice!)
    );
  }

  if (searchParams.maxPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= parseInt(searchParams.maxPrice!)
    );
  }

  // Filter by search query
  if (searchParams.search) {
    const query = searchParams.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  // Sort products
  switch (searchParams.sort) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      filteredProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
        <p className="mt-2 text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {mockProducts.length} products
        </p>

        <select
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          defaultValue={searchParams.sort || 'newest'}
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

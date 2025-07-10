import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/products/product-detail';

// Mock data - same as in product-grid for consistency
const mockProducts = [
  {
    id: '1',
    name: 'Elegant Silk Saree with Golden Border',
    description:
      'Beautiful traditional silk saree perfect for weddings and special occasions. Made from premium quality silk with intricate golden border work.',
    price: 4500,
    images: [
      '/api/placeholder/400/600',
      '/api/placeholder/400/600',
      '/api/placeholder/400/600',
    ],
    category: { id: 'silk', name: 'Silk Sarees', slug: 'silk-sarees' },
    stock: 10,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Contemporary Cotton Saree',
    description:
      'Modern cotton saree for daily wear. Comfortable and stylish with contemporary patterns.',
    price: 1800,
    images: ['/api/placeholder/400/600', '/api/placeholder/400/600'],
    category: { id: 'cotton', name: 'Cotton Sarees', slug: 'cotton-sarees' },
    stock: 15,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Designer Wedding Saree',
    description:
      'Luxurious designer saree for special occasions. Features heavy embroidery and premium fabric.',
    price: 8500,
    images: [
      '/api/placeholder/400/600',
      '/api/placeholder/400/600',
      '/api/placeholder/400/600',
    ],
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
    description:
      'Stylish georgette saree for parties and evening events. Lightweight and elegant.',
    price: 3200,
    images: ['/api/placeholder/400/600', '/api/placeholder/400/600'],
    category: { id: 'party', name: 'Party Wear', slug: 'party-wear' },
    stock: 8,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Casual Handloom Saree',
    description:
      'Comfortable handloom saree for everyday wear. Made from organic cotton with traditional weaving.',
    price: 2200,
    images: ['/api/placeholder/400/600'],
    category: { id: 'casual', name: 'Casual Wear', slug: 'casual-wear' },
    stock: 12,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Premium Banarasi Silk Saree',
    description:
      'Authentic Banarasi silk saree with intricate work. A masterpiece of traditional Indian craftsmanship.',
    price: 12000,
    images: [
      '/api/placeholder/400/600',
      '/api/placeholder/400/600',
      '/api/placeholder/400/600',
    ],
    category: { id: 'silk', name: 'Silk Sarees', slug: 'silk-sarees' },
    stock: 3,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />
    </div>
  );
}

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = mockProducts.find((p) => p.id === params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Saakie`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

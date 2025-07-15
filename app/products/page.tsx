import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Our Products</h1>

      {products.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500">No products available yet.</p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            Return to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border p-4 transition-shadow hover:shadow-lg"
            >
              {product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="mb-4 h-48 w-full rounded-md object-cover"
                />
              )}
              <h2 className="mb-2 text-xl font-semibold">{product.name}</h2>
              <p className="mb-2 line-clamp-2 text-gray-600">
                {product.description}
              </p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{product.price}
              </p>
              {product.category && (
                <p className="mt-2 text-sm text-gray-500">
                  Category: {product.category.name}
                </p>
              )}
              <button className="mt-4 w-full rounded-md bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

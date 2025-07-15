import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Welcome to Saakie
        </h1>
        <p className="mb-8 text-center text-xl">
          Your one-stop shop for all your needs
        </p>

        <div className="flex justify-center gap-4">
          {userId ? (
            <>
              <Link
                href="/products"
                className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
              >
                Browse Products
              </Link>
              <Link
                href="/profile"
                className="rounded-lg bg-gray-600 px-6 py-3 text-white transition-colors hover:bg-gray-700"
              >
                My Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-gray-600 px-6 py-3 text-white transition-colors hover:bg-gray-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

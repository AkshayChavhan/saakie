import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getUserData(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export default async function ProfilePage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId) {
    redirect('/sign-in');
  }

  const userData = await getUserData(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 text-center">
              {clerkUser?.imageUrl && (
                <img
                  src={clerkUser.imageUrl}
                  alt="Profile"
                  className="mx-auto mb-4 h-24 w-24 rounded-full"
                />
              )}
              <h2 className="text-xl font-semibold">
                {clerkUser?.firstName} {clerkUser?.lastName}
              </h2>
              <p className="text-gray-600">
                {clerkUser?.emailAddresses[0]?.emailAddress}
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <Link
                href="/profile/addresses"
                className="block w-full rounded-md bg-blue-600 py-2 text-center text-white transition-colors hover:bg-blue-700"
              >
                Manage Addresses
              </Link>
              <Link
                href="/profile/orders"
                className="block w-full rounded-md bg-gray-600 py-2 text-center text-white transition-colors hover:bg-gray-700"
              >
                View All Orders
              </Link>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-xl font-semibold">Recent Orders</h3>

            {userData?.orders && userData.orders.length > 0 ? (
              <div className="space-y-4">
                {userData.orders.map((order) => (
                  <div key={order.id} className="border-b pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">
                          Order #{order.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{order.totalAmount}</p>
                        <p className="text-sm text-gray-600">{order.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No orders yet.</p>
            )}
          </div>

          <div className="mt-6 rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-xl font-semibold">Saved Addresses</h3>

            {userData?.addresses && userData.addresses.length > 0 ? (
              <div className="space-y-4">
                {userData.addresses.map((address) => (
                  <div key={address.id} className="border-b pb-4">
                    <p className="font-semibold">{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    {address.isDefault && (
                      <span className="mt-2 inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No addresses saved yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export default async function AdminPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in?redirect_url=/admin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminDashboard />
    </div>
  );
}

export const metadata = {
  title: 'Admin Settings - Saakie',
  description:
    'Administrative dashboard for managing the Saakie e-commerce platform',
};

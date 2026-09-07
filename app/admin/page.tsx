import { getAllSubdomains } from '@/lib/subdomains';
import type { Metadata } from 'next';
import { AdminDashboard } from './dashboard';
import { rootDomain } from '@/lib/utils';
import { requireAdminAccess } from '@/lib/platform/access';

export const metadata: Metadata = {
  title: `Admin Dashboard | ${rootDomain}`,
  description: `Manage subdomains for ${rootDomain}`
};

export default async function AdminPage() {
  await requireAdminAccess();
  const tenants = await getAllSubdomains();

  return <AdminDashboard tenants={tenants} />;
}

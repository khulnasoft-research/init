import 'server-only';

export async function requireAdminAccess() {
  if (process.env.NODE_ENV !== 'production') return;
  if (process.env.ADMIN_ACCESS_TOKEN) {
    throw new Error('Admin authentication adapter is not connected');
  }
  throw new Error('Admin access is not configured');
}

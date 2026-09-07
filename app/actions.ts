'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createTenant, deleteTenant, getTenant } from '@/lib/platform/tenant-repository';
import { isValidIcon, validateSubdomain } from '@/lib/platform/tenancy';
import { requireAdminAccess } from '@/lib/platform/access';
import { tenantUrl } from '@/lib/platform/config';

type CreateState = {
  subdomain?: string;
  icon?: string;
  success?: boolean;
  error?: string;
};

export async function createSubdomainAction(
  _prevState: CreateState,
  formData: FormData
): Promise<CreateState> {
  await requireAdminAccess();

  const subdomain = String(formData.get('subdomain') || '');
  const icon = String(formData.get('icon') || '');
  const validationError = validateSubdomain(subdomain);

  if (validationError || !isValidIcon(icon)) {
    return {
      subdomain,
      icon,
      success: false,
      error: validationError || 'Please enter a valid emoji (maximum 10 characters)'
    };
  }

  if (await getTenant(subdomain)) {
    return { subdomain, icon, success: false, error: 'This subdomain is already taken' };
  }

  await createTenant(subdomain, icon);
  redirect(tenantUrl(subdomain));
}

export async function deleteSubdomainAction(
  _prevState: unknown,
  formData: FormData
) {
  await requireAdminAccess();
  const subdomain = String(formData.get('subdomain') || '');
  if (!validateSubdomain(subdomain)) await deleteTenant(subdomain);
  revalidatePath('/admin');
  return { success: 'Domain deleted successfully' };
}

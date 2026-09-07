import { getTenant, listTenants } from '@/lib/platform/tenant-repository';
import { isValidIcon } from '@/lib/platform/tenancy';

export { isValidIcon };

export const getSubdomainData = getTenant;
export const getAllSubdomains = listTenants;

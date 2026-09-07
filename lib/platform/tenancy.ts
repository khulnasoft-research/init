export type TenantRecord = {
  subdomain: string;
  emoji: string;
  createdAt: number;
};

export const RESERVED_SUBDOMAINS = new Set(['www', 'admin', 'api', 'app']);

export function normalizeSubdomain(value: string) {
  return value.trim().toLowerCase();
}

export function validateSubdomain(value: string) {
  const subdomain = normalizeSubdomain(value);
  if (!subdomain) return 'Subdomain is required';
  if (subdomain.length > 63) return 'Subdomain must be 63 characters or fewer';
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(subdomain)) {
    return 'Use lowercase letters, numbers, and hyphens only';
  }
  if (RESERVED_SUBDOMAINS.has(subdomain)) return 'That subdomain is reserved';
  return null;
}

export function isValidIcon(value: string) {
  if (!value || value.length > 10) return false;
  return /\p{Extended_Pictographic}/u.test(value);
}

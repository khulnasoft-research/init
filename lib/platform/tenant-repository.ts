import 'server-only';

import { platformConfig } from './config';
import type { TenantRecord } from './tenancy';
import { normalizeSubdomain } from './tenancy';
import { redis } from '@/lib/redis';

const keyFor = (subdomain: string) => `subdomain:${normalizeSubdomain(subdomain)}`;

export async function getTenant(subdomain: string) {
  const normalized = normalizeSubdomain(subdomain);
  const data = await redis.get<Omit<TenantRecord, 'subdomain'>>(keyFor(normalized));
  return data ? { subdomain: normalized, ...data } : null;
}

export async function createTenant(subdomain: string, emoji: string): Promise<TenantRecord> {
  const normalized = normalizeSubdomain(subdomain);
  const tenant = { subdomain: normalized, emoji, createdAt: Date.now() };
  await redis.set(keyFor(normalized), { emoji, createdAt: tenant.createdAt });
  await redis.sadd(platformConfig.tenantIndexKey, normalized);
  return tenant;
}

export async function deleteTenant(subdomain: string) {
  const normalized = normalizeSubdomain(subdomain);
  await redis.del(keyFor(normalized));
  await redis.srem(platformConfig.tenantIndexKey, normalized);
}

export async function listTenants(): Promise<TenantRecord[]> {
  const indexed = await redis.smembers(platformConfig.tenantIndexKey);
  const keys = indexed.length ? indexed.map(keyFor) : await redis.keys('subdomain:*');
  if (!keys.length) return [];
  const values = await redis.mget<Omit<TenantRecord, 'subdomain'>[]>(...keys);
  return keys.flatMap((key, index) => {
    const data = values[index];
    if (!data) return [];
    return [{ subdomain: key.replace('subdomain:', ''), ...data }];
  });
}

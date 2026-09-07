function required(name: string, value: string | undefined) {
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const platformConfig = {
  protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
  rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000',
  redisUrl: required('KV_REST_API_URL', process.env.KV_REST_API_URL),
  redisToken: required('KV_REST_API_TOKEN', process.env.KV_REST_API_TOKEN),
  tenantIndexKey: 'platform:tenants'
} as const;

export function tenantUrl(subdomain: string) {
  return `${platformConfig.protocol}://${subdomain}.${platformConfig.rootDomain}`;
}

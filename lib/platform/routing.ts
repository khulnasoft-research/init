import { platformConfig } from './config';

export function hostnameFromRequest(host: string | null) {
  return (host || '').split(':')[0].toLowerCase();
}

export function extractTenantFromHost(host: string | null) {
  const hostname = hostnameFromRequest(host);
  const root = platformConfig.rootDomain.split(':')[0].toLowerCase();

  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return null;
  if (hostname.endsWith('.localhost')) return hostname.split('.')[0] || null;
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    return hostname.split('---')[0] || null;
  }
  if (hostname === root || hostname === `www.${root}`) return null;
  if (hostname.endsWith(`.${root}`)) return hostname.slice(0, -(root.length + 1));
  return null;
}

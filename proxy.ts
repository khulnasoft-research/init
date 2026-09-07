import { type NextRequest, NextResponse } from 'next/server';
import { extractTenantFromHost } from '@/lib/platform/routing';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tenant = extractTenantFromHost(request.headers.get('host'));

  if (tenant && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (tenant && pathname === '/') {
    return NextResponse.rewrite(new URL(`/s/${tenant}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|[\\w-]+\\.\\w+).*)']
};

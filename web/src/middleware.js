import { NextResponse } from 'next/server';

export function middleware(request) {
  const rolesCookie = request.cookies.get('roles')?.value;

  if (!rolesCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const roles = rolesCookie.split(',');

  const url = new URL(request.url);

  if (url.pathname.startsWith('/admin/dashboard/')) {
    if (!roles.includes('admin') && !roles.includes('sysadmin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (url.pathname.startsWith('/apanel/dashboard/')) {
    if (!roles.includes('admin') && !roles.includes('sysadmin') && !roles.includes('user')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/apanel/dashboard/:path*'],
};

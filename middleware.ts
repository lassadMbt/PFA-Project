/**
 * middleware.ts — place at ROOT of project (next to package.json)
 * Blocks /admin at Vercel Edge before React loads. Returns 404.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Block direct access to /admin if anyone guesses it
  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}
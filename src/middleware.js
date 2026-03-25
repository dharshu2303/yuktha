import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (static files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

export default function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Allowed base domains
  const isLocalhost = hostname.includes('localhost');
  const baseDomain = isLocalhost ? 'localhost:3000' : 'yuktha.online';
  
  if (hostname.includes(`.${baseDomain}`)) {
    const subdomain = hostname.split('.')[0];
    
    // Skip 'www' 
    if (subdomain !== 'www') {
      // Rewrite to /sites/[subdomain] without changing the URL bar
      const rewriteUrl = new URL(`/sites/${subdomain}${url.pathname}`, req.url);
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  return NextResponse.next();
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Détection du domaine principal hebertik.fr (avec ou sans port)
  const isMainHubDomain =
    host.startsWith("hebertik.fr") ||
    host.startsWith("www.hebertik.fr");

  // Détection du sous-domaine mail.hebertik.fr
  const isMailSubdomain = host.startsWith("mail.hebertik.fr");

  // Si on est sur le domaine principal hebertik.fr et sur la racine -> afficher le Hub
  if (isMainHubDomain && pathname === "/") {
    return NextResponse.rewrite(new URL("/hub", request.url));
  }

  // Si quelqu'un va sur hebertik.fr/mail -> redirection propre vers mail.hebertik.fr
  if (isMainHubDomain && pathname === "/mail") {
    return NextResponse.redirect(new URL("https://mail.hebertik.fr", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json / icon.svg (PWA assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon.svg).*)",
  ],
};


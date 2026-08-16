import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { i18n, type Locale } from "@/config/i18n/config";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored – called from middleware
          }
        },
      },
    }
  );

  // Refresh the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ─────────────────────────────────────────────
  // Locale routing
  // ─────────────────────────────────────────────
  const { pathname } = request.nextUrl;

  // Check if pathname already has a locale
  const hasLocale = i18n.locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  let locale: Locale = i18n.defaultLocale;

  if (!hasLocale) {
    // Detect preferred locale from Accept-Language header
    const acceptLang = request.headers.get("accept-language") || "";
    const preferredLocale = acceptLang.includes("ar") ? "ar" : i18n.defaultLocale;
    locale = preferredLocale;

    // Rewrite to include locale
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Extract locale from pathname
  const pathLocale = pathname.split("/")[1] as Locale;
  if (i18n.locales.includes(pathLocale)) {
    locale = pathLocale;
  }

  // ─────────────────────────────────────────────
  // Admin route protection
  // ─────────────────────────────────────────────
  const isAdminRoute = pathname.includes("/admin");
  const isLoginPage = pathname.includes("/admin/login");

  if (isAdminRoute && !isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/admin/login`;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // If user is authenticated and visits login, redirect to dashboard
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/admin/dashboard`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

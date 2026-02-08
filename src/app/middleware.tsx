import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // ✅ USE getSession (NOT getUser)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  const url = request.nextUrl.clone();
  const isAdminPath = url.pathname.startsWith("/admin");
  const isAuthPage =
    url.pathname === "/" ||
    url.pathname === "/login" ||
    url.pathname === "/signup";

  // --- NOT LOGGED IN ---
  if (!user) {
    if (!isAuthPage) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // --- LOGGED IN ---
  const role = user.app_metadata?.role;

  if (!role) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthPage) {
    url.pathname = role === "admin" ? "/admin/dashboard" : "/home";
    return NextResponse.redirect(url);
  }

  if (isAdminPath && role !== "admin") {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return response;
}

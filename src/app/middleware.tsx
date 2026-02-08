import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Initialize Response
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
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // 2. ✅ Use getUser (Safer for Server Middleware)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const isAdminPath = url.pathname.startsWith("/admin");
  const isAuthPage =
    url.pathname === "/" ||
    url.pathname === "/login" ||
    url.pathname === "/signup";

  // --- SCENARIO 1: NOT LOGGED IN ---
  if (!user) {
    if (!isAuthPage) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // --- SCENARIO 2: LOGGED IN ---
  if (user) {
    // 3. ✅ FETCH REAL ROLE FROM YOUR DB
    // We cannot trust app_metadata because it's empty.
    const { data: dbUser } = await supabase
      .from("users")
      .select("u_role")
      .eq("u_id", user.id)
      .single();

    // Default to 'user' if something goes wrong
    const role = dbUser?.u_role || "user";

    // Rule A: Redirect logged-in users away from Login/Home
    if (isAuthPage) {
      if (role === "admin") {
        url.pathname = "/admin/dashboard";
      } else {
        url.pathname = "/home";
      }
      return NextResponse.redirect(url);
    }

    // Rule B: Protect Admin Dashboard
    if (isAdminPath && role !== "admin") {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

// Config matches everything except static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

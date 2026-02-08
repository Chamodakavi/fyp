import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log(`🔥 MIDDLEWARE HIT: ${request.nextUrl.pathname}`);

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
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

  // 1. SECURITY: Use getUser(), not getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // 2. LOGIC: Block non-admins from /admin
  if (url.pathname.startsWith("/admin")) {
    // A. No User? -> Login
    if (!user) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // B. Have User? -> Check DB Role
    const { data: dbUser } = await supabase
      .from("users")
      .select("u_role")
      .eq("id", user.id)
      .single();

    const role = dbUser?.u_role || "user";

    // Debugging (Check your Server Terminal)
    console.log(`Middleware Check -> Path: ${url.pathname} | Role: ${role}`);

    // C. Not Admin? -> Kick to Home
    if (role !== "admin") {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match everything except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

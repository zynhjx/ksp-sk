import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";


const jwtSecretString = process.env.JWT_SECRET;
const expressApiUrl = process.env.NEXT_PUBLIC_EXPRESS_API_URL;

if (!jwtSecretString) {
  throw new Error("Missing JWT_SECRET environment variable")
}

if (!expressApiUrl) {
  throw new Error("Missing NEXT_PUBLIC_EXPRESS_API_URL environment variable")
}

const JWT_SECRET = new TextEncoder().encode(jwtSecretString);
const isProd = process.env.NODE_ENV === "production";
const cookieDomain = isProd ? "kabataanprofile.com" : "kabataanprofile.test";

// Routes that require authentication
const protectedRoutePrefixes = ["/dashboard", "/programs", "/suggestions", "/announcements"];
const authRoutes = ["/auth"];

type PayloadType = {
  payload: {
    id: number;
    email: string;
    role: "youth" | "sk" | "admin";
    status: "pending" | "active";
    type: "access";
  };
};

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // Check route types
  const isProtectedRoute = protectedRoutePrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isOnboardingRoute = pathname.startsWith("/onboarding");
  const requiresAuth = isProtectedRoute || isOnboardingRoute || isAuthRoute;


  if (requiresAuth) {
    if (accessToken) {
      try {
        const { payload }: PayloadType = await jwtVerify(
          accessToken,
          JWT_SECRET
        );

        if (payload.role !== "youth") {
          if (isAuthRoute) {
            return NextResponse.next()
          }
          return NextResponse.redirect(new URL("/auth", req.url))
        }

        // If pending status, redirect to onboarding
        if (payload.status === "pending") {
          if (isOnboardingRoute) {
            return NextResponse.next();
          }
          return NextResponse.redirect(new URL("/onboarding", req.url));
        }

      
        // If already authenticated and trying to access auth/onboarding, redirect to home
        if (isAuthRoute || isOnboardingRoute) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
      } catch (error) {
        console.error("Token verification failed:", error);
        if (isAuthRoute) {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/auth", req.url));
      }
    } 
    
    if (refreshToken) {
      try {
        const res = await fetch(`${expressApiUrl}/api/auth/middleware/refresh`, {
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();

          if (!data?.accessToken || !data?.refreshToken) {
            throw new Error("Invalid refresh response");
          }

          const { payload }: PayloadType = await jwtVerify(
            data.accessToken,
            JWT_SECRET
          );

          if (payload.role !== "youth") {
            if (isAuthRoute) {
              return NextResponse.next()
            }
            return NextResponse.redirect(new URL("/auth", req.url))
          }
          
          let response: NextResponse;

          if (payload.status === "pending") {
            if (isOnboardingRoute) {
              response = NextResponse.next();
            } else {
              response = NextResponse.redirect(new URL("/onboarding", req.url));
            }
          } else {
            if (isAuthRoute || isOnboardingRoute) {
              response = NextResponse.redirect(new URL("/home", req.url));
            } else {
              response = NextResponse.next();
            }
          }

          response.cookies.set("accessToken", data.accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: "/",
            maxAge: 5 * 60,
            domain: cookieDomain,
          });

          response.cookies.set("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
            domain: cookieDomain,
          });

          return response;
        }

        if (isAuthRoute) {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/auth", req.url));
      } catch (error) {
        console.error("Token refresh failed:", error);
        if (isAuthRoute) {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/auth", req.url));
      }
    } else {
      if (isAuthRoute) {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  return NextResponse.next();
}

// Only run middleware on relevant pages
export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|map)).*)",
  ],
};

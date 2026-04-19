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
const protectedRoutePrefixes = ["/dashboard", "/profile", "/youth-profiles", "/programs", "/suggestions", "/announcements"];
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
  const sk_verificationToken = req.cookies.get("sk_verificationToken")?.value

  // Check route types
  const isProtectedRoute = protectedRoutePrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isOnboardingRoute = pathname.startsWith("/onboarding");


  if (isProtectedRoute) {
    if (accessToken) {
      try {
        const { payload }: PayloadType = await jwtVerify(
          accessToken,
          JWT_SECRET
        );

        if (payload.role !== "sk") {
          return NextResponse.redirect(new URL("/auth/login", req.url))
        }

        return NextResponse.next();
      } catch (error) {
        console.error("Token verification failed:", error);
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    } 
    
    if (refreshToken) {
      try {
        const res = await fetch(`${expressApiUrl}/api/auth/middleware/refresh`, {
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
            "x-app-type": "sk"
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

          if (payload.role !== "sk") {
            return NextResponse.redirect(new URL("/auth/login", req.url))
          }

          const response = NextResponse.next();

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

        const response = NextResponse.redirect(new URL("/auth/login", req.url));

        response.cookies.set("refreshToken", "", {
          httpOnly: true,
          secure: isProd,
          sameSite: "lax",
          path: "/",
          maxAge: 0,
          domain: cookieDomain,
        });

        return response
      } catch (error) {
        console.error("Token refresh failed:", error);
        const response = NextResponse.redirect(new URL("/auth/login", req.url));

        response.cookies.set("refreshToken", "", {
          httpOnly: true,
          secure: isProd,
          sameSite: "lax",
          path: "/",
          maxAge: 0,
          domain: cookieDomain,
        });

        return response
      }
    } else {
      if (isAuthRoute) {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  if (isAuthRoute || isOnboardingRoute) {
    if (accessToken) {
      try {
        const { payload } = await jwtVerify(accessToken, JWT_SECRET)
        if (payload.role !== "sk") {
          return NextResponse.next()
        }
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch (err) {
        console.log(err)
      }
    }

    if (refreshToken) {
      try {
        const res = await fetch(`${expressApiUrl}/api/auth/middleware/refresh`, {
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
            "x-app-type": "sk"
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

          if (payload.role !== "sk") {
            if (sk_verificationToken) {
              try {
                await jwtVerify(sk_verificationToken, JWT_SECRET)
                if (isOnboardingRoute) {
                  return NextResponse.next()
                }
                return NextResponse.redirect(new URL("/onboarding", req.url))
              } catch (err) {
                console.log(err)
                const response = NextResponse.next()
                response.cookies.set("sk_verificationToken", "", {
                  httpOnly: true,
                  secure: isProd,
                  sameSite: "lax",
                  path: "/",
                  maxAge: 0,
                  domain: cookieDomain,
                })
                return response
              }
            }
            if (isAuthRoute) {
              return NextResponse.next()
            }
            return NextResponse.redirect(new URL("/auth/login", req.url));
          }
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next()
      } catch (err) {
        console.log(err)
      }
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

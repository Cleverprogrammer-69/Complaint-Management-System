import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that don't require authentication
const publicRoutes = ["/login", "/register"]

// Routes that should redirect to home if already authenticated
const authRoutes = ["/login", "/register"]
const adminRoutes = ["/complaints/all", "/resolver-management", "/department-def", "/user-def", "/issue-def", 
  "/service-def", "/role-def", "/company-def"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token from cookies (we'll need to set this on login)
  const token = request.cookies.get("accessToken")?.value
  const userRole = request.cookies.get("userRole")?.value
  // console.log(token)
  const isAuthenticated = !!token
  const isAdmin = userRole === "ADMIN"
  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated and trying to access auth routes (login/register)
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  // If authenticated but not admin and trying to access admin routes
  if (isAuthenticated && isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)",
  ],
}

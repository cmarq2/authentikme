import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    if (!token) return NextResponse.redirect(new URL("/login", req.url))

    const role = token.role as string

    if (pathname.startsWith("/candidate/") && role !== "CANDIDATE") {
      return NextResponse.redirect(new URL("/employer/dashboard", req.url))
    }

    if (pathname.startsWith("/employer/") && role !== "EMPLOYER") {
      return NextResponse.redirect(new URL("/candidate/dashboard", req.url))
    }

    // Revoked/pending employers holding an older session token get bounced out.
    if (pathname.startsWith("/employer/") && role === "EMPLOYER" && token.employerApproved === false) {
      return NextResponse.redirect(new URL("/login?error=EMPLOYER_PENDING_APPROVAL", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/candidate/((?!signup$|verify-email).+)",
    "/employer/((?!signup$).+)",
  ],
}

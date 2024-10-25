import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

const protectedRoutes = ["/admin"];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const isProcted = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!session?.user && isProcted) {
    const absoluteUrl = new URL("/login", request.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
}

return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}


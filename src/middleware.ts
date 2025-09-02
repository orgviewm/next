import { auth } from "@/auth";

export const runtime = "nodejs";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname === "/charts") {
    return Response.redirect(new URL("/auth", req.url));
  }
});

export const config = {
  matcher: ["/charts"],
};

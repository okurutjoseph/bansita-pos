import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your middleware
const publicRoutes = ["/", "/auth/sign-in(.*)", "/auth/sign-up(.*)"];
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req) => {
  // If the request is for a public route, don't protect it
  if (isPublicRoute(req)) {
    return;
  }
  
  // For all other routes, protect them
  await auth.protect();
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

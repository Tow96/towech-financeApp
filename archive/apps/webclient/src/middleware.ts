import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([]);

export default clerkMiddleware(
  async (auth, req) => {
    if (!isPublicRoute(req) && !(process.env.NEXT_PUBLIC_USERS_DISABLED === 'true')) {
      await auth.protect();
    }
  },
  {
    contentSecurityPolicy: {
      directives: {
        'connect-src': ['https://betafinanceapi.towechlabs.com', 'http://localhost:3001'],
      },
    },
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

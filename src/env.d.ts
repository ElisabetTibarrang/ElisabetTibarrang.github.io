/// <reference types="astro/client" />

// Values the middleware (src/middleware.ts) puts on Astro.locals.
declare namespace App {
  interface Locals {
    /** CSP nonce for this request (server mode only). */
    nonce: string;
    session?: any;
    user?: {
      sessionId: string;
      userId: string;
      role: string;
      email: string;
      mfaRequired?: boolean;
      totpEnabled?: boolean;
      recoveryEmailVerified?: boolean;
      contactVerified?: boolean;
    };
  }
}

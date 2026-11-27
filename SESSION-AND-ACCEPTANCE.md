# Session and request interaction

SessionProvider resolves /me once before SplashGate permits login/private content. Network errors keep the splash with a retry button. Login updates the shared provider, logout clears it. The splash keeps the existing driver artwork.

Accept submits immediately to the authoritative backend. Only the specific stale-GPS conflict triggers one shared location update and a single retry. GPS freshness and assignment validation remain on the server. Earnings and tracking reads no longer block offers or acceptance; stale list responses cannot overwrite a successful mutation. Pending buttons prevent duplicate acceptance and offer rotation. Reject locally removes the offer immediately, preserving the existing semantics; it does not cancel the customer's request for every driver. Map markers switch without a stale delayed recenter.

AppZoomGuard prevents accidental page zoom while retaining scrolling and map controls. The viewport locks scale; coarse-pointer inputs use at least 16px. Both apps use standalone PWA display, viewport-fit=auto and apple-mobile-web-app-status-bar-style=default so the OS status bar is outside app content. Verify installed PWA appearance on physical iOS/Android after deployment; desktop emulation cannot render the actual OS bar.

Assistant deployment: see ../khodrochare-backend/docs/ASSISTANT.md. Browser scenarios run from ../khodrochare-app with production servers on ports 3334 (customer) and 3335 (driver): npx playwright test --config=playwright.fleet.config.ts.

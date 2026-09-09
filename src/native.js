// Native-shell glue for the Capacitor iOS build. Every branch here is behind
// Capacitor.isNativePlatform(), so on the web (the GitHub Pages build) this
// module imports the Capacitor shims, does nothing, and adds no behaviour.

import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  bootNative();
}

async function bootNative() {
  // Load plugin code only inside the app.
  const [{ StatusBar, Style }, { Browser }, { SplashScreen }] = await Promise.all([
    import('@capacitor/status-bar'),
    import('@capacitor/browser'),
    import('@capacitor/splash-screen'),
  ]);

  /* ---- Safe areas -------------------------------------------------------
     The web layout already uses env(safe-area-inset-bottom); the sticky
     header predates iOS and has no top inset. Add both here (native only)
     rather than touching the app's stylesheet. */
  const shim = document.createElement('style');
  shim.textContent = `
    .uk .top { padding-top: calc(14px + env(safe-area-inset-top)); }
    .uk:has(.pathwrap) .top { padding-top: calc(14px + env(safe-area-inset-top)); }
    .auth-root { padding-top: calc(40px + env(safe-area-inset-top)); }
    .acct-fab { bottom: calc(64px + env(safe-area-inset-bottom)); }
  `;
  document.head.appendChild(shim);

  /* ---- Status bar follows the app's own light/dark toggle -------------- */
  const applyStatusBar = () => {
    const dark = document.querySelector('.uk')?.getAttribute('data-dark') === '1';
    StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(() => {});
  };
  const watchDark = () => {
    const uk = document.querySelector('.uk');
    if (!uk) return false;
    applyStatusBar();
    new MutationObserver(applyStatusBar).observe(uk, {
      attributes: true,
      attributeFilter: ['data-dark'],
    });
    return true;
  };
  if (!watchDark()) {
    // .uk mounts after React does; retry briefly.
    const iv = setInterval(() => { if (watchDark()) clearInterval(iv); }, 200);
    setTimeout(() => clearInterval(iv), 8000);
  }

  /* ---- External links open in the system browser, not the app shell ---- */
  document.addEventListener(
    'click',
    (e) => {
      const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
      if (!a) return;
      let url;
      try {
        url = new URL(a.getAttribute('href'), document.baseURI);
      } catch {
        return;
      }
      if ((url.protocol === 'http:' || url.protocol === 'https:') && url.origin !== location.origin) {
        e.preventDefault();
        Browser.open({ url: url.href }).catch(() => {});
      }
    },
    true,
  );

  /* ---- Drop the splash once the app has painted ----------------------- */
  const hide = () => SplashScreen.hide().catch(() => {});
  if (document.readyState === 'complete') setTimeout(hide, 300);
  else window.addEventListener('load', () => setTimeout(hide, 300), { once: true });
}

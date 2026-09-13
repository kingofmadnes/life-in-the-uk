import { useEffect } from "react";
import { showBanner, hideBanner, onBannerSize, prepareInterstitial } from "./ads.js";

/* Renders nothing. The banner itself is a native view the AdMob SDK
   overlays on the bottom of the screen, outside the web view — so all
   this component does is turn it on while a permitted screen is
   mounted, and publish its measured height as --ad-h so the app's
   bottom navigation can sit clear of it.

   Mounted only when the entitlement is "free" and the current view is
   one of AD_VIEWS; see LifeInTheUK.jsx. */
export default function AdBanner() {
  useEffect(() => {
    let live = true;
    let unsubscribe = () => {};

    onBannerSize((h) => {
      if (live) document.documentElement.style.setProperty("--ad-h", h + "px");
    }).then((off) => {
      if (live) unsubscribe = off;
      else off();
    });

    showBanner();
    // A quiet moment while they read: get the next full-screen ad in
    // place now so it never stalls a tap later.
    prepareInterstitial();

    return () => {
      live = false;
      unsubscribe();
      hideBanner();
      document.documentElement.style.setProperty("--ad-h", "0px");
    };
  }, []);

  return null;
}

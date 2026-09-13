import React, { useEffect, useState } from "react";
import * as store from "../storekit.js";

/* The unlock screen. Renders inside the app's .uk root, so it picks up the
   app's own tokens and dark-mode toggle rather than carrying a second copy
   of the palette — see the .pw rules in the CSS block in LifeInTheUK.jsx.

   Text comes in through `t` so the paywall speaks whichever of the fifteen
   languages the person chose, like every other screen. */
export default function Paywall({ t, onClose, onUnlocked }) {
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  // Ask the App Store what this costs where the viewer lives. Until it
  // answers, the button says "Unlock" with no figure — better than showing
  // £2.99 to someone who will be charged in rupees.
  useEffect(() => {
    let live = true;
    store.product().then((p) => {
      if (live && p && p.price) setPrice(p.price);
    });
    return () => { live = false; };
  }, []);

  const buy = async () => {
    setBusy("buy");
    setMsg("");
    const result = await store.purchase();
    if (result === "owned") {
      onUnlocked();
      return; // the paywall unmounts — don't touch state after this
    }
    if (result === "pending") setMsg(t("pwPending"));
    else if (result === "failed") setMsg(t("pwFail"));
    // "cancelled" is a deliberate choice, not an error. Say nothing.
    setBusy("");
  };

  const restore = async () => {
    setBusy("restore");
    setMsg("");
    const owned = await store.restore();
    if (owned) {
      onUnlocked();
      return;
    }
    setMsg(t("pwNone"));
    setBusy("");
  };

  const working = busy !== "";

  return (
    <div className="pw" role="dialog" aria-modal="true" aria-label={t("pwTitle")}>
      <div className="pw-card">
        <div className="pw-mark" aria-hidden="true">★</div>
        <h2 className="pw-title">{t("pwTitle")}</h2>
        <p className="pw-lead">{t("pwLead")}</p>

        <ul className="pw-list">
          {[t("pwOne"), t("pwTwo"), t("pwThree")].map((line) => (
            <li key={line}>
              <span className="pw-tick" aria-hidden="true">✓</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {msg && <p className="pw-msg">{msg}</p>}

        <button type="button" className="pw-buy" disabled={working} onClick={buy}>
          {busy === "buy" ? t("pwBuying") : price ? t("pwBuy", { p: price }) : t("pwTitle")}
        </button>
        <p className="pw-once">{t("pwOnce")}</p>

        <button type="button" className="pw-alt" disabled={working} onClick={restore}>
          {busy === "restore" ? t("pwBuying") : t("pwRestore")}
        </button>
        <button type="button" className="pw-alt pw-quiet" disabled={working} onClick={onClose}>
          {t("pwNotNow")}
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import * as store from "../storekit.js";

/* The unlock screen. Renders inside the app's .uk root, so it picks up the
   app's own tokens and dark-mode toggle rather than carrying a second copy
   of the palette — see the .pw rules in the CSS block in LifeInTheUK.jsx.

   Text comes in through `t` so the paywall speaks whichever of the fifteen
   languages the person chose, like every other screen. */
export default function Paywall({ t, onClose, onUnlocked }) {
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  // Ask the App Store what this costs where the viewer lives. The button
  // stays disabled until it answers, so the price is never a guess. If the
  // store has no product, say so and offer a retry rather than sit blank.
  useEffect(() => {
    let live = true;
    setLoading(true);
    store.product().then((p) => {
      if (!live) return;
      setPrice(p && p.price ? p.price : "");
      setUnavailable(!(p && p.price));
      setLoading(false);
    });
    return () => { live = false; };
  }, [attempt]);

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
    const { owned } = await store.restore();
    if (owned) {
      onUnlocked();
      return;
    }
    setMsg(t("pwNone"));
    setBusy("");
  };

  const working = busy !== "";
  const retry = () => setAttempt((n) => n + 1);

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

        {(msg || unavailable) && !loading && <p className="pw-msg">{msg || t("pwNoPrice")}</p>}

        <button
          type="button"
          className="pw-buy"
          disabled={working || loading}
          onClick={unavailable ? retry : buy}
        >
          {busy === "buy" || loading
            ? t("pwBuying")
            : unavailable
              ? t("pwRetry")
              : t("pwBuy", { p: price })}
        </button>
        {/* What this charges and that it is a single payment. Apple requires
            the price be visible before the purchase, not just in a linked
            policy. */}
        <p className="pw-once">
          {price ? t("pwTerms", { p: price }) : ""}
        </p>

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

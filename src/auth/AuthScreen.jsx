import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase.js";

/* Firebase auth error codes → wording a person can act on. */
const MSG = {
  "auth/invalid-email": "That doesn't look like a valid email address.",
  "auth/missing-password": "Please enter your password.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with that email already exists — try logging in.",
  "auth/weak-password": "Choose a password of at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a little while and try again.",
  "auth/network-request-failed": "Network problem. Check your connection and try again.",
  "auth/operation-not-allowed":
    "This sign-in method isn't enabled for the project yet (Firebase console → Authentication → Sign-in method).",
  "auth/popup-blocked":
    "Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again.",
  "auth/unauthorized-domain":
    "This domain isn't allowed for Google sign-in (Firebase console → Authentication → Settings → Authorized domains).",
  "auth/account-exists-with-different-credential":
    "You already have an account with this email using a different sign-in method. Log in that way first.",
};
/* Codes that just mean "the user backed out" — not worth showing as an error. */
const SILENT = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
  "auth/user-cancelled",
]);
const friendly = (e) =>
  MSG[e && e.code] || (e && e.message) || "Something went wrong. Please try again.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthScreen({ configError = false }) {
  const [mode, setMode] = useState("login"); // login | register | reset
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  if (configError) {
    return (
      <div className="auth-root">
        <div className="auth-card auth-config">
          <div className="auth-brand">
            <span className="auth-logo">UK</span>
            <span className="auth-wordmark">Life in the UK</span>
          </div>
          <h1 className="auth-h1">Firebase isn't configured yet</h1>
          <p className="auth-sub">
            Add your Firebase web config so sign-in can work. Paste the values into
            <code>src/firebase.js</code>
            (or copy <code>.env.local.example</code> to <code>.env.local</code> and fill it in),
            then reload.
          </p>
        </div>
      </div>
    );
  }

  const reset = (next) => {
    setMode(next);
    setErr("");
    setOk("");
    setPw("");
    setPw2("");
    setShowPw(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    const addr = email.trim();
    if (!EMAIL_RE.test(addr)) {
      setErr("Please enter a valid email address.");
      return;
    }

    if (mode === "reset") {
      setBusy(true);
      try {
        await sendPasswordResetEmail(auth, addr);
        setOk("Password reset email sent. Check your inbox (and spam folder).");
      } catch (e2) {
        setErr(friendly(e2));
      } finally {
        setBusy(false);
      }
      return;
    }

    if (pw.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (mode === "register" && pw !== pw2) {
      setErr("The two passwords don't match.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, addr, pw);
        const dn = name.trim();
        if (dn) {
          try {
            await updateProfile(cred.user, { displayName: dn });
          } catch {
            /* non-fatal */
          }
        }
      } else {
        await signInWithEmailAndPassword(auth, addr, pw);
      }
      // On success onAuthStateChanged in AuthGate swaps this screen for the app.
    } catch (e2) {
      setErr(friendly(e2));
      setBusy(false);
    }
  };

  const signInGoogle = async () => {
    if (!googleProvider) return;
    setErr("");
    setOk("");
    setBusy(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // AuthGate takes over on success.
    } catch (e2) {
      if (!SILENT.has(e2 && e2.code)) setErr(friendly(e2));
      setBusy(false);
    }
  };

  const isReset = mode === "reset";
  const isRegister = mode === "register";

  return (
    <div className="auth-root">
      <form className="auth-card" onSubmit={submit} noValidate>
        <div className="auth-brand">
          <span className="auth-logo">UK</span>
          <span className="auth-wordmark">Life in the UK</span>
        </div>

        {isReset ? (
          <>
            <h1 className="auth-h1">Reset your password</h1>
            <p className="auth-sub">
              Enter your account email and we'll send you a reset link.
            </p>
          </>
        ) : (
          <>
            <h1 className="auth-h1">
              {isRegister ? "Create your account" : "Welcome back"}
            </h1>
            <p className="auth-sub">
              {isRegister
                ? "Sign up to save your progress across devices."
                : "Log in to continue studying."}
            </p>
            <div className="auth-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={!isRegister}
                className={"auth-tab" + (!isRegister ? " on" : "")}
                onClick={() => reset("login")}
              >
                Log in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isRegister}
                className={"auth-tab" + (isRegister ? " on" : "")}
                onClick={() => reset("register")}
              >
                Create account
              </button>
            </div>
          </>
        )}

        {err && (
          <div className="auth-msg err" role="alert">
            {err}
          </div>
        )}
        {ok && (
          <div className="auth-msg ok" role="status">
            {ok}
          </div>
        )}

        {isRegister && (
          <div className="auth-field">
            <label htmlFor="auth-name">Name (optional)</label>
            <input
              id="auth-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How we address you"
            />
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck="false"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        {!isReset && (
          <div className="auth-field has-toggle">
            <label htmlFor="auth-pw">Password</label>
            <div className="auth-input-wrap">
              <input
                id="auth-pw"
                type={showPw ? "text" : "password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder={isRegister ? "At least 6 characters" : "Your password"}
                required
              />
              <button
                type="button"
                className="auth-peek"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        )}

        {isRegister && (
          <div className="auth-field">
            <label htmlFor="auth-pw2">Confirm password</label>
            <input
              id="auth-pw2"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              placeholder="Re-enter your password"
              required
            />
          </div>
        )}

        {mode === "login" && (
          <button
            type="button"
            className="auth-link auth-forgot"
            onClick={() => reset("reset")}
          >
            Forgot password?
          </button>
        )}

        <button className="auth-btn" type="submit" disabled={busy}>
          {busy
            ? "Please wait…"
            : isReset
              ? "Send reset link"
              : isRegister
                ? "Create account"
                : "Log in"}
        </button>

        {!isReset && googleProvider && (
          <>
            <div className="auth-or"><span>or</span></div>
            <button
              type="button"
              className="auth-btn auth-google"
              onClick={signInGoogle}
              disabled={busy}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
                <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33Z" />
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        {isReset ? (
          <p className="auth-alt">
            Remembered it?{" "}
            <button type="button" className="auth-link" onClick={() => reset("login")}>
              Back to log in
            </button>
          </p>
        ) : isRegister ? (
          <p className="auth-alt">
            Already have an account?{" "}
            <button type="button" className="auth-link" onClick={() => reset("login")}>
              Log in
            </button>
          </p>
        ) : (
          <p className="auth-alt">
            New here?{" "}
            <button type="button" className="auth-link" onClick={() => reset("register")}>
              Create an account
            </button>
          </p>
        )}
      </form>
    </div>
  );
}

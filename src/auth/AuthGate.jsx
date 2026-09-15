import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase.js";
import AuthScreen from "./AuthScreen.jsx";
import "./auth.css";

const GUEST_KEY = "uk2:guest";
const readGuest = () => {
  try {
    return localStorage.getItem(GUEST_KEY) === "1";
  } catch {
    return false;
  }
};

/* Wraps the app. The app doesn't mount until the person is either signed in
   or has chosen to continue as a guest; the login / register screen stands
   in its place. Once past the gate, children render untouched, plus a small
   account button (sign out / delete account, or "sign in to save" for guests). */
export default function AuthGate({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [guest, setGuest] = useState(readGuest);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      return;
    }
    return onAuthStateChanged(auth, (u) => setUser(u || null));
  }, []);

  const enterGuest = () => {
    try {
      localStorage.setItem(GUEST_KEY, "1");
    } catch {
      /* ignore */
    }
    setGuest(true);
  };
  const leaveGuest = () => {
    try {
      localStorage.removeItem(GUEST_KEY);
    } catch {
      /* ignore */
    }
    setGuest(false);
  };

  if (!isFirebaseConfigured) return <AuthScreen configError />;

  if (user === undefined) {
    return (
      <div className="auth-boot">
        <div className="auth-spinner" />
      </div>
    );
  }

  if (user) {
    return (
      <>
        {children}
        <AccountButton user={user} />
      </>
    );
  }

  if (guest) {
    return (
      <>
        {children}
        <GuestButton onSignIn={leaveGuest} />
      </>
    );
  }

  return <AuthScreen onGuest={enterGuest} />;
}

function Fab({ open, setOpen, children, label }) {
  return (
    <button
      type="button"
      className="acct-fab"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-label={label}
      onClick={() => setOpen((v) => !v)}
    >
      {children}
    </button>
  );
}

function Scrim({ onClose }) {
  return (
    <button type="button" className="acct-scrim" aria-label="Close menu" onClick={onClose} />
  );
}

function AccountButton({ user }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const label = user.displayName || user.email || "";
  const initial = (label.trim() || "?").charAt(0).toUpperCase();

  const close = () => {
    setOpen(false);
    setConfirming(false);
    setErr("");
  };

  const doDelete = async () => {
    setBusy(true);
    setErr("");
    const uid = user.uid;
    try {
      // Nothing to unwind on the entitlement side: the subscription
      // belongs to the Apple ID via StoreKit, not to this Firebase
      // account, so deleting the account correctly leaves it untouched.
      // Someone who wants to stop paying cancels it from Settings ›
      // Manage subscription (or Apple's own subscriptions page) —
      // deleting their study progress here should not silently do that
      // for them.
      await deleteUser(user);
      try {
        localStorage.removeItem("uk2:all::" + uid);
      } catch {
        /* ignore */
      }
      // onAuthStateChanged swaps this screen for the auth screen.
    } catch (e) {
      if (e && e.code === "auth/requires-recent-login") {
        setErr("For your security, sign in again first — then you can delete the account.");
      } else {
        setErr("Couldn't delete the account. Please try again.");
      }
      setBusy(false);
    }
  };

  return (
    <div className="acct">
      {open && (
        <>
          <Scrim onClose={close} />
          <div className="acct-pop" role="menu">
            <p className="acct-label">Signed in as</p>
            <p className="acct-email">{user.email}</p>

            {err && <p className="acct-err">{err}</p>}

            {confirming ? (
              <>
                <p className="acct-warn">
                  This permanently deletes your account and its saved progress. This can't be undone.
                </p>
                <button
                  type="button"
                  className="acct-danger"
                  disabled={busy}
                  onClick={doDelete}
                >
                  {busy ? "Deleting…" : "Delete account permanently"}
                </button>
                <button
                  type="button"
                  className="acct-signout"
                  disabled={busy}
                  onClick={() => setConfirming(false)}
                >
                  Keep my account
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="acct-signout"
                  onClick={() => {
                    close();
                    signOut(auth);
                  }}
                >
                  Sign out
                </button>
                <button
                  type="button"
                  className="acct-danger-link"
                  onClick={() => {
                    setErr("");
                    setConfirming(true);
                  }}
                >
                  Delete account
                </button>
              </>
            )}
          </div>
        </>
      )}
      <Fab open={open} setOpen={setOpen} label="Account">
        {initial}
      </Fab>
    </div>
  );
}

function GuestButton({ onSignIn }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="acct">
      {open && (
        <>
          <Scrim onClose={() => setOpen(false)} />
          <div className="acct-pop" role="menu">
            <p className="acct-label">Studying as a guest</p>
            <p className="acct-email">Your progress is saved on this device only.</p>
            <button
              type="button"
              className="acct-signout"
              onClick={() => {
                setOpen(false);
                onSignIn();
              }}
            >
              Sign in to save progress
            </button>
          </div>
        </>
      )}
      <Fab open={open} setOpen={setOpen} label="Account">
        <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" fill="currentColor" />
        </svg>
      </Fab>
    </div>
  );
}

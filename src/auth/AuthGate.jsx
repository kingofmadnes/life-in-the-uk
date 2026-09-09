import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase.js";
import AuthScreen from "./AuthScreen.jsx";
import "./auth.css";

/* Wraps the app. Until a user is signed in, the app never mounts — the
   login / register screen stands in its place. Once signed in, children
   render untouched, plus a small account button for signing out. */
export default function AuthGate({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still checking

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      return;
    }
    return onAuthStateChanged(auth, (u) => setUser(u || null));
  }, []);

  if (!isFirebaseConfigured) return <AuthScreen configError />;

  if (user === undefined) {
    return (
      <div className="auth-boot">
        <div className="auth-spinner" />
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  return (
    <>
      {children}
      <AccountButton user={user} />
    </>
  );
}

function AccountButton({ user }) {
  const [open, setOpen] = useState(false);
  const label = user.displayName || user.email || "";
  const initial = (label.trim() || "?").charAt(0).toUpperCase();

  return (
    <div className="acct">
      {open && (
        <>
          <button
            type="button"
            className="acct-scrim"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="acct-pop" role="menu">
            <p className="acct-label">Signed in as</p>
            <p className="acct-email">{user.email}</p>
            <button
              type="button"
              className="acct-signout"
              onClick={() => {
                setOpen(false);
                signOut(auth);
              }}
            >
              Sign out
            </button>
          </div>
        </>
      )}
      <button
        type="button"
        className="acct-fab"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account"
        title={label}
        onClick={() => setOpen((v) => !v)}
      >
        {initial}
      </button>
    </div>
  );
}

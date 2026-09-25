import React from "react";
import "./privacy.css";

export default function PrivacyPolicy({ onBack }) {
  return (
    <div className="privacy-root">
      <div className="privacy-header">
        <button className="privacy-back" onClick={onBack}>
          ← Back
        </button>
        <h1>Privacy Policy</h1>
      </div>

      <div className="privacy-content">
        <p className="privacy-date">Last updated: 23 September 2026</p>

        <section>
          <h2>Data We Collect</h2>
          <h3>Authentication (Firebase)</h3>
          <ul>
            <li>Email address</li>
            <li>User ID</li>
            <li>Authentication credentials</li>
          </ul>

          <h3>App Usage</h3>
          <ul>
            <li>Quiz answers and progress</li>
            <li>Bookmarked questions</li>
            <li>Settings preferences</li>
            <li>Time spent on features</li>
          </ul>

          <h3>Advertising (AdMob)</h3>
          <ul>
            <li>Advertising ID (IDFA)</li>
            <li>Device information</li>
            <li>Ad interaction data</li>
          </ul>

          <h3>Payments (Apple StoreKit)</h3>
          <ul>
            <li>Purchase history</li>
            <li>Subscription status</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Data</h2>
          <ul>
            <li><strong>App Functionality</strong> — authenticate users, track progress, save preferences</li>
            <li><strong>Advertising</strong> — serve personalized ads via Google AdMob</li>
            <li><strong>Subscriptions</strong> — manage yearly subscription access to the Path</li>
            <li><strong>Service Improvement</strong> — understand which features are used</li>
          </ul>
        </section>

        <section>
          <h2>Third-Party Services</h2>

          <h3>Firebase (Google)</h3>
          <p>Authentication and database. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy Policy</a></p>

          <h3>Google AdMob</h3>
          <p>Ad serving. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy Policy</a></p>

          <h3>Apple App Store</h3>
          <p>Payment processing. <a href="https://www.apple.com/privacy/" target="_blank" rel="noopener">Privacy Policy</a></p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <ul>
            <li>Delete your account in the app (Settings → Account → Delete)</li>
            <li>Opt out of personalized ads in iOS Settings</li>
            <li>Contact us with any questions</li>
          </ul>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Questions? Email: <a href="mailto:mohamedrebah1995@gmail.com">mohamedrebah1995@gmail.com</a></p>
        </section>
      </div>
    </div>
  );
}

import Foundation
import UIKit
import Capacitor
import StoreKit

/// The purchase side of the app: one auto-renewable subscription with a
/// 3-day free trial. Apple only allows a card-gated free trial on a
/// subscription — never on a one-time purchase — so this is the only
/// route to "payment method required before the trial starts." Unless
/// cancelled inside the 3 days, it converts to one charge for a year of
/// the path with no ads; it renews yearly after that unless cancelled.
///
/// StoreKit 2 rather than a third-party SDK, because `Transaction` arrives
/// as a `VerificationResult` that Apple has already checked — there is no
/// receipt to validate, so there is no receipt server to get wrong.
///
/// Every method resolves. A store that cannot be reached reports "not
/// owned" and the app carries on in its free tier; it never strands the
/// caller on a spinner.
@objc(StoreKitPlugin)
public class StoreKitPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "StoreKitPlugin"
    public let jsName = "StoreKit"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "product", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "entitlement", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "manage", returnType: CAPPluginReturnPromise)
    ]

    private let productID = "com.kingofmadnes.lifeintheuk.path.annual"

    /// Transactions can also arrive from outside a purchase we started —
    /// the trial converting to a paid charge, a renewal, Ask to Buy
    /// approval, a purchase made on another device, a refund. Without
    /// this listener those would sit unfinished and StoreKit would keep
    /// re-delivering them.
    private var updates: Task<Void, Never>?

    override public func load() {
        updates = Task.detached { [weak self] in
            for await update in Transaction.updates {
                guard let self, case .verified(let transaction) = update else { continue }
                await transaction.finish()
                let current = await self.status()
                self.notifyListeners("entitlementChanged", data: current)
            }
        }
    }

    deinit {
        updates?.cancel()
    }

    // MARK: - Reading

    /// Owned = a live, unrevoked entitlement for this product — trial or
    /// paid, it is what opens the path. Trialing = that entitlement is
    /// currently the introductory offer rather than a real charge — it
    /// is what keeps ads showing. `transaction.offerType == .introductory`
    /// is how StoreKit marks a transaction as the trial itself.
    private func status() async -> [String: Any] {
        for await entitlement in Transaction.currentEntitlements {
            guard case .verified(let transaction) = entitlement else { continue }
            if transaction.productID == productID && transaction.revocationDate == nil {
                return ["owned": true, "trialing": transaction.offerType == .introductory]
            }
        }
        return ["owned": false, "trialing": false]
    }

    @objc func entitlement(_ call: CAPPluginCall) {
        Task {
            call.resolve(await status())
        }
    }

    /// Title, renewal price, and free-trial terms as the App Store gives
    /// them to us, already in the viewer's own currency — which is why
    /// the paywall never hard-codes "£3.99". `introEligible` is false
    /// once this Apple ID has already used the trial once, so a returning
    /// subscriber sees "Subscribe" rather than "Start free trial".
    @objc func product(_ call: CAPPluginCall) {
        Task {
            do {
                guard let product = try await Product.products(for: [productID]).first else {
                    call.resolve([:])
                    return
                }

                var payload: [String: Any] = [
                    "id": product.id,
                    "title": product.displayName,
                    "description": product.description,
                    "price": product.displayPrice
                ]

                if let subscription = product.subscription {
                    payload["introEligible"] = await subscription.isEligibleForIntroOffer
                    if let intro = subscription.introductoryOffer, intro.paymentMode == .freeTrial {
                        payload["introDays"] = intro.period.value
                        payload["introUnit"] = String(describing: intro.period.unit)
                    }
                }

                call.resolve(payload)
            } catch {
                // No store, no price — the paywall falls back to its own copy.
                call.resolve([:])
            }
        }
    }

    // MARK: - Buying

    /// `product.purchase()` starts the free trial automatically when this
    /// Apple ID is eligible for one and charges the renewal price
    /// immediately when it is not — StoreKit decides that, not this code.
    @objc func purchase(_ call: CAPPluginCall) {
        Task {
            do {
                guard let product = try await Product.products(for: [productID]).first else {
                    call.resolve(["result": "failed"])
                    return
                }

                let result = try await product.purchase()

                switch result {
                case .success(let verification):
                    guard case .verified(let transaction) = verification else {
                        // Signature didn't check out. Treat as a failure and
                        // do not unlock.
                        call.resolve(["result": "failed"])
                        return
                    }
                    await transaction.finish()
                    call.resolve(["result": "owned"])

                case .userCancelled:
                    call.resolve(["result": "cancelled"])

                case .pending:
                    // Ask to Buy, or a bank step. Apple finishes it later and
                    // the Transaction.updates listener above picks it up.
                    call.resolve(["result": "pending"])

                @unknown default:
                    call.resolve(["result": "failed"])
                }
            } catch {
                call.resolve(["result": "failed"])
            }
        }
    }

    /// Apple requires a restore path on any subscription. `AppStore.sync()`
    /// prompts for the password, so it only ever runs from the button.
    @objc func restore(_ call: CAPPluginCall) {
        Task {
            do {
                try await AppStore.sync()
            } catch {
                // A cancelled password prompt lands here. Fall through and
                // report whatever the entitlement store already knows.
            }
            call.resolve(await status())
        }
    }

    /// Apple's native "Manage Subscription" sheet — the required, built-in
    /// way to cancel during the trial or afterwards without leaving the
    /// app. Silently does nothing if there is no active scene to present
    /// from; the caller has nothing better to fall back to either way.
    @objc func manage(_ call: CAPPluginCall) {
        Task { @MainActor in
            guard let scene = UIApplication.shared.connectedScenes
                .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene
            else {
                call.resolve()
                return
            }
            try? await AppStore.showManageSubscriptions(in: scene)
            call.resolve()
        }
    }
}

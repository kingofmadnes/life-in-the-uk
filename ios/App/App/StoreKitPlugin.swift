import Foundation
import Capacitor
import StoreKit

/// The purchase side of the app: one non-consumable that unlocks the quiz
/// and turns the ads off permanently.
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
        CAPPluginMethod(name: "entitlement", returnType: CAPPluginReturnPromise)
    ]

    private let productID = "com.kingofmadnes.lifeintheuk.unlock"

    /// Transactions can also arrive from outside a purchase we started —
    /// an Ask to Buy approval, a purchase made on another device, a
    /// refund. Without this listener those would sit unfinished and
    /// StoreKit would keep re-delivering them.
    private var updates: Task<Void, Never>?

    override public func load() {
        updates = Task.detached { [weak self] in
            for await update in Transaction.updates {
                guard let self, case .verified(let transaction) = update else { continue }
                await transaction.finish()
                self.notifyListeners("entitlementChanged",
                                     data: ["owned": transaction.revocationDate == nil])
            }
        }
    }

    deinit {
        updates?.cancel()
    }

    // MARK: - Reading

    /// Does this Apple ID own the unlock? Reads the on-device entitlement
    /// store, so it is correct offline too.
    private func owned() async -> Bool {
        for await entitlement in Transaction.currentEntitlements {
            guard case .verified(let transaction) = entitlement else { continue }
            if transaction.productID == productID && transaction.revocationDate == nil {
                return true
            }
        }
        return false
    }

    @objc func entitlement(_ call: CAPPluginCall) {
        Task {
            call.resolve(["owned": await owned()])
        }
    }

    /// Title and price as the App Store gives them to us, already in the
    /// viewer's own currency — which is why the paywall never hard-codes
    /// a price.
    @objc func product(_ call: CAPPluginCall) {
        Task {
            do {
                guard let product = try await Product.products(for: [productID]).first else {
                    call.resolve([:])
                    return
                }
                call.resolve([
                    "id": product.id,
                    "title": product.displayName,
                    "description": product.description,
                    "price": product.displayPrice
                ])
            } catch {
                // No store, no price — the paywall falls back to its own copy.
                call.resolve([:])
            }
        }
    }

    // MARK: - Buying

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

    /// Apple requires a restore path on any non-consumable. `AppStore.sync()`
    /// prompts for the password, so it only ever runs from the button.
    @objc func restore(_ call: CAPPluginCall) {
        Task {
            do {
                try await AppStore.sync()
            } catch {
                // A cancelled password prompt lands here. Fall through and
                // report whatever the entitlement store already knows.
            }
            call.resolve(["owned": await owned()])
        }
    }
}

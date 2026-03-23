import { useCallback, useEffect, useState } from "react";
import type {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";
import Purchases from "react-native-purchases";

import {
  getCategoryEntitlementId,
  getCategoryPackageId,
  getPremiumQuestionsEntitlementId,
  getPremiumQuestionsPackageId,
  RC_PRO_ENTITLEMENT_ID,
  RC_PRO_PACKAGE_ID,
} from "@/constants/revenuecat";
import { initializeRevenueCat, isRevenueCatInitialized } from "@/lib/revenuecat";

function findPackage(
  offering: PurchasesOffering | null,
  packageId: string
): PurchasesPackage | null {
  if (!offering) return null;
  return (
    offering.availablePackages.find(
      (pkg) =>
        pkg.identifier === packageId || pkg.product.identifier === packageId
    ) ?? null
  );
}

export function useRevenueCatPurchases() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const refreshStatus = useCallback(async () => {
    try {
      await initializeRevenueCat();
      if (!isRevenueCatInitialized()) {
        return;
      }

      const [info, offerings] = await Promise.all([
        Purchases.getCustomerInfo(),
        Purchases.getOfferings(),
      ]);

      setCustomerInfo(info);
      setCurrentOffering(offerings.current ?? null);
    } catch (e) {
      console.log("RevenueCat: failed to refresh status", e);
      setCustomerInfo(null);
      setCurrentOffering(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const isEntitlementActive = useCallback(
    (entitlementId: string) =>
      !!customerInfo?.entitlements.active?.[entitlementId]?.isActive,
    [customerInfo]
  );

  const isPro = isEntitlementActive(RC_PRO_ENTITLEMENT_ID);

  const isCategoryUnlocked = useCallback(
    (categoryId: string) =>
      isPro || isEntitlementActive(getCategoryEntitlementId(categoryId)),
    [isPro, isEntitlementActive]
  );

  const isPremiumQuestionsUnlocked = useCallback(
    (categoryId: string) =>
      isPro || isEntitlementActive(getPremiumQuestionsEntitlementId(categoryId)),
    [isPro, isEntitlementActive]
  );

  const purchaseByPackageId = useCallback(
    async (packageId: string) => {
      await initializeRevenueCat();
      if (!isRevenueCatInitialized()) {
        return false;
      }

      const pkg = findPackage(currentOffering, packageId);
      if (!pkg) {
        const availablePackages =
          currentOffering?.availablePackages.map((p) => ({
            packageId: p.identifier,
            productId: p.product.identifier,
          })) ?? [];
        console.log(`RevenueCat: package not found for id "${packageId}"`, {
          currentOfferingId: currentOffering?.identifier ?? null,
          availablePackages,
        });
        return false;
      }

      try {
        const result = await Purchases.purchasePackage(pkg);
        setCustomerInfo(result.customerInfo);
        return true;
      } catch (e) {
        console.log(`RevenueCat: purchase failed for "${packageId}"`, e);
        return false;
      }
    },
    [currentOffering]
  );

  const unlockPremium = useCallback(
    async () => purchaseByPackageId(RC_PRO_PACKAGE_ID),
    [purchaseByPackageId]
  );

  const unlockCategory = useCallback(
    async (categoryId: string) =>
      purchaseByPackageId(getCategoryPackageId(categoryId)),
    [purchaseByPackageId]
  );

  const unlockPremiumQuestionsForCategory = useCallback(
    async (categoryId: string) =>
      purchaseByPackageId(getPremiumQuestionsPackageId(categoryId)),
    [purchaseByPackageId]
  );

  const resetPurchases = useCallback(async () => {
    // RevenueCat purchases are server-side.
    // For testing, switch to a new app user id to get a clean customer profile.
    try {
      await initializeRevenueCat();
      if (!isRevenueCatInitialized()) {
        return;
      }
      const nextAppUserId = `test_reset_${Date.now()}`;
      const { customerInfo } = await Purchases.logIn(nextAppUserId);
      setCustomerInfo(customerInfo);
      const offerings = await Purchases.getOfferings();
      setCurrentOffering(offerings.current ?? null);
    } catch (e) {
      console.log("RevenueCat: failed to reset test customer", e);
    }
  }, []);

  return {
    isPro,
    loading,
    isCategoryUnlocked,
    isPremiumQuestionsUnlocked,
    refreshProStatus: refreshStatus,
    unlockPremium,
    unlockCategory,
    unlockPremiumQuestionsForCategory,
    resetPurchases,
  };
}

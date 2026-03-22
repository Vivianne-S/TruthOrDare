/**
 * RevenueCat naming conventions for Test Store products/entitlements.
 *
 * Configure RevenueCat so identifiers match these helpers:
 * - Pro package identifier: "pro"
 * - Category package identifier: "category_<category_id>"
 * - Premium-questions package identifier: "premium_questions_<category_id>"
 *
 * Entitlements:
 * - Pro entitlement id: "pro"
 * - Category entitlement id: "category_<category_id>"
 * - Premium-questions entitlement id: "premium_questions_<category_id>"
 */

export const RC_PRO_ENTITLEMENT_ID = "pro";
export const RC_PRO_PACKAGE_ID = "pro";

function sanitizeIdentifierPart(value: string) {
  return value.trim().replace(/[^a-zA-Z0-9_]/g, "_");
}

export function getCategoryEntitlementId(categoryId: string) {
  return `category_${sanitizeIdentifierPart(categoryId)}`;
}

export function getPremiumQuestionsEntitlementId(categoryId: string) {
  return `premium_questions_${sanitizeIdentifierPart(categoryId)}`;
}

export function getCategoryPackageId(categoryId: string) {
  return `category_${sanitizeIdentifierPart(categoryId)}`;
}

export function getPremiumQuestionsPackageId(categoryId: string) {
  return `premium_questions_${sanitizeIdentifierPart(categoryId)}`;
}

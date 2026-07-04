import type { Business, Offer } from "../types";

export function getOfferDisplayBusiness(offer: Offer, businesses: Business[]) {
  if (offer.businessId) {
    const directMatch = businesses.find((business) => business.id === offer.businessId);
    if (directMatch) {
      return directMatch;
    }
  }

  if (offer.previewBusinessId) {
    return businesses.find((business) => business.id === offer.previewBusinessId);
  }

  return undefined;
}

export function isOfferBusinessPreviewContext(offer: Offer, business?: Business) {
  if (!business) {
    return true;
  }

  return offer.previewBusinessId === business.id || business.trustLevel === "fictional_seed";
}

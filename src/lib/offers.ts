import type { Business, Offer } from "../types";

export function getOfferDisplayBusiness(offer: Offer, businesses: Business[]) {
  if (offer.businessId) {
    const attachedBusiness = businesses.find((business) => business.id === offer.businessId);
    if (attachedBusiness) {
      return attachedBusiness;
    }
  }

  if (offer.previewBusinessId) {
    return businesses.find((business) => business.id === offer.previewBusinessId);
  }

  return undefined;
}

export function isOfferBusinessPreviewContext(offer: Offer, business?: Business) {
  if (!business) return false;
  return Boolean(offer.previewBusinessId) && offer.previewBusinessId === business.id && offer.businessId !== business.id;
}

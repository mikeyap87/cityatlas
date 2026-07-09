import type { BusinessProspect } from "../types";

const partnerAnchorCategoryPattern =
  /\b(restaurant|bar|gallery|museum|market|attraction|hotel|cafe|venue|event|wellness|spa|service|repair|clean(?:er|ing)?|detail(?:ing)?|auto(?:motive)?|mechanic|car\s+(?:wash|care|repair)|home\s+service|plumber|electrician|handyman|moving|pet\s+care)\b/i;

type PartnerAnchorProspectLike = Pick<
  BusinessProspect,
  "sourceType" | "contactReadiness" | "category" | "segment"
>;

export function hasPartnerAnchorCategory(value: string) {
  return partnerAnchorCategoryPattern.test(value);
}

export function shouldTreatProspectAsPartnerAnchor(
  prospect: PartnerAnchorProspectLike,
) {
  if (prospect.sourceType !== "source_backed_place") {
    return true;
  }

  return (
    prospect.contactReadiness !== "needs_research"
    || hasPartnerAnchorCategory(`${prospect.category} ${prospect.segment}`)
  );
}

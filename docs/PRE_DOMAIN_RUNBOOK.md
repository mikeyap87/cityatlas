# Pre-Domain Runbook

## Current Recommended Sequence

1. Review the local app at `http://127.0.0.1:5178/`.
2. Confirm brand and target domain direction.
3. Verify domain availability and legal/trademark comfort.
4. Approve Vercel/project hosting target.
5. Keep `/admin` hidden on hosted builds with `VITE_CITYATLAS_ENABLE_HOSTED_ADMIN=false` unless a separate protected-access layer is approved.
6. Deploy a private preview using demo labels intact.
7. Review public copy and mobile layout on the private preview.
8. Approve real-data sourcing policy.
9. Review the Founder CRM Date Night candidate queue.
10. Save an AI Brain Run in `/admin` as the pre-outreach baseline.
11. Approve exact candidates and private-preview route language.
12. Prepare 10 to 20 manually reviewed Vancouver founding partner preview pages.
13. Keep `/private-preview/date-night` hidden on hosted builds with `VITE_CITYATLAS_ENABLE_HOSTED_PRIVATE_PREVIEW=false` unless the deployment is protected and the sharing list is approved.
14. Approve outreach message, channel, sender account, send count, and reply log.
15. Log manual replies locally and review objections before any automation.
16. Save a second AI Brain Run after replies/no-replies are logged.
17. Approve Stripe/payment terms only after the first partner package is validated.

## Cutover Notes

- Keep `VITE_CITYATLAS_ENABLE_LIVE_PAYMENTS=false` until payment approval.
- Keep `VITE_CITYATLAS_ENABLE_REAL_PROVIDER_IMPORTS=false` until data-source approval.
- Keep `VITE_CITYATLAS_ENABLE_AUTOMATED_OUTREACH=false` until compliance approval.
- Keep `VITE_CITYATLAS_ENABLE_HOSTED_ADMIN=false` and `VITE_CITYATLAS_ENABLE_HOSTED_PRIVATE_PREVIEW=false` before any public hosted preview.
- Preserve demo labels until real source records replace fictional seed data.
- Keep real-business candidate names inside owner/admin review until source, preview, and outreach gates are approved.
- Do not expose `/admin` publicly with founder CRM records unless Vercel/deployment-level protection and hosted admin access are explicitly approved.
- Keep AI Brain Runs local until analytics, CRM, and AI-provider data policies are approved.

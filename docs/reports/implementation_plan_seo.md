# Implementation Plan: SEO Technical Fixes

Address the remaining "Yellow" and "Red" issues from the SEO report to improve search engine visibility and reduce reliance on limited free-tier services.

## Proposed Changes

### [Component] SEO Configuration
#### [MODIFY] [sitemap.xml](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/sitemap.xml)
- Add the English version of the homepage (`/?lang=en`) to the sitemap.
- Update `lastmod` to the current date.

### [Component] Website Structure
#### [MODIFY] [index.html](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/index.html)
- Refine `<title>` and `<meta name="description">` to better highlight "Bali" and specific services.
- Ensure all `hreflang` tags point to the current production URL.

### [Component] Contact & Conversion
#### [MODIFY] [main.js](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/main.js)
- Implement a fallback mechanism: If Formspree fails (due to limits or errors), show a clear "Contact via WhatsApp" button immediately to avoid losing the lead.

## Verification Plan
### Automated Verification
- Run `curl` or a linter on `sitemap.xml` to ensure valid XML structure.
- Check `index.html` head section for correct `hreflang` and meta tags.

### Manual Verification
- Test the contact form with a simulated failure to ensure the WhatsApp fallback appears.
- Verify that clicking different language links in the browser search results (if indexed) would correctly map to the `lang` parameter.

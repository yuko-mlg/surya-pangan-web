# Finalize Decap CMS Configuration

The user has successfully set up the OAuth backend, as evidenced by the screenshot showing a successful callback. This plan focuses on cleaning up the configuration and ensuring the CMS is fully operational.

## Proposed Changes

### [Component Name] CMS Frontend

#### [MODIFY] [index.html](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/public/admin/index.html)
- Remove the redundant Netlify Identity widget script as it's not needed for the GitHub backend setup.

#### [MODIFY] [config.yml](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/public/admin/config.yml)
- Add `site_url` for completeness.
- Verify `base_url` settings.

## Verification Plan

### Manual Verification
1.  **Access Admin Panel**: Navigate to `https://surya-pangan-web.vercel.app/admin/`.
2.  **Login Flow**: Click the GitHub login button.
3.  **Verify Redirect**: The callback window should open, show "Authentication successful!", and then close.
4.  **CMS Access**: The main CMS window should refresh and show the collections (Berita & Artikel).
5.  **Test Edit**: Try editing a news item and saving/publishing to verify the token has correct permissions.

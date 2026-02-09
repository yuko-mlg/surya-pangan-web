# Fix CMS Collection Visibility and Media Configuration

The user reported they cannot access the "Berita" section. This likely because it's nested under a "Data" menu and potentially due to incorrect media folder configuration.

## Proposed Changes

### CMS Configuration

#### [MODIFY] [config.yml](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/public/admin/config.yml)
- Flatten the collection structure: Move "Berita & Artikel" to the top level.
- Fix `media_folder` and `public_folder` to use a valid directory (e.g., `assets/images`).
- Update `branch` if necessary (already correct as `main`).

## Verification Plan

### Manual Verification
1.  **Access Admin Panel**: Navigate to `https://surya-pangan-web.vercel.app/admin/`.
2.  **Sidebar Check**: Verify that "Berita & Artikel" is now visible in the main sidebar.
3.  **Editor Check**: Click it and ensure the news items load correctly.
4.  **Save Test**: Try changing a title and saving to verify it updates the repository.

# Implementation Plan: Update Product Logos to WebP

Replace the current product brand logos in the "Products" section with the new WebP versions to improve performance and SEO.

## User Review Required
> [!IMPORTANT]
> **Locating Files**: I am currently unable to find the `.webp` files in the project workspace or common user directories. Please specify the folder where the files were uploaded.

## Proposed Changes
### [Component] Frontend Assets
#### [NEW] .webp Assets
- Sync all `.webp` files from `C:\Users\Yuko\Documents\GH\surya-pangan-web\assets\images` to the project's `assets/images` directory.
- This includes product logos (`Logo_GandumMas.webp`, `Logo_Wilmar.webp`, etc.) and section backgrounds (`hero_bg.webp`, `ingredients.webp`, etc.).

### [Component] Website Structure
#### [MODIFY] [index.html](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/index.html)
- Update product logos in the "Products" section (lines 270-291) to use `.webp` versions:
    - Anchor (`Logo_Anchor.webp`)
    - Forisa (`Logo_Forisa.webp`)
    - Colatta (`Logo Colatta.webp`)
    - Upfield (`logo_Upfield.webp`)
    - Gandum Mas (`Logo_GandumMas.webp`)
    - Prambanan Kencana (`Logo_PrambananKencana.webp`)
    - Sasa (`Logo_Sasa.webp`)
    - Wilmar (`Logo_Wilmar.webp`)
- Update background and sectional images to use `.webp` versions:
    - Hero background (line 137)
    - About image (line 174)
    - Coverage map (line 305)
    - Gallery images (lines 378, 384, 390)
    - Footer logo (line 467)

## Verification Plan
### Manual Verification
- Open the website and verify that all 8 brand logos in the "Produk" section are displayed correctly.
- Inspect the images in the browser to confirm they are using the `.webp` format.

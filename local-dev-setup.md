# Local Development Setup

## Work Without Store Connection

1. **Edit theme files directly** in your code editor
2. **Preview changes** by opening `.liquid` files in browser (limited functionality)
3. **Use a local server** for static assets

## Simple Local Server

```bash
# Navigate to theme directory
cd fineyst-jacket-shopify-store

# Start simple HTTP server (Python)
python -m http.server 8000

# Or using Node.js
npx http-server -p 8000
```

## Alternative: Create New Development Store

1. Go to https://partners.shopify.com
2. Create partner account (free)
3. Create development store
4. Use that store for theme development

## Upload Theme Manually

1. Zip the theme folder
2. Go to Shopify Admin > Online Store > Themes
3. Upload zip file
4. Customize in theme editor
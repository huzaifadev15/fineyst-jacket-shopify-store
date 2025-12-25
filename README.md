# Fineyst Jackets - Shopify Theme

A premium Shopify 2.0 theme designed for leather jacket stores, featuring a modern aesthetic with bold typography and a sophisticated color palette.

## Features

- **Fully Responsive Design** - Optimized for all devices from mobile to desktop
- **Shopify 2.0 Compatible** - Uses JSON templates and section architecture
- **Premium Aesthetics** - Dark header, elegant typography, and smooth animations
- **Performance Optimized** - Lazy loading images, minimal JavaScript
- **Customizable** - All sections are customizable via the Shopify theme editor

## Theme Structure

```
├── assets/
│   ├── base.css              # Base styles and utilities
│   ├── component-header.css  # Header component styles
│   ├── sections.css          # Section-specific styles
│   └── global.js             # JavaScript functionality
├── config/
│   ├── settings_schema.json  # Theme settings schema
│   └── settings_data.json    # Default settings values
├── layout/
│   └── theme.liquid          # Main layout file
├── locales/
│   └── en.default.json       # English translations
├── sections/
│   ├── header.liquid         # Site header
│   ├── footer.liquid         # Site footer
│   ├── hero.liquid           # Hero banner
│   ├── welcome.liquid        # Welcome section
│   ├── featured-collection.liquid
│   ├── categories.liquid
│   ├── testimonials.liquid
│   ├── newsletter.liquid
│   └── ... (other sections)
├── snippets/
│   ├── product-card.liquid   # Product card component
│   └── meta-tags.liquid      # SEO meta tags
└── templates/
    ├── index.json            # Homepage template
    ├── product.json          # Product page template
    ├── collection.json       # Collection page template
    └── ... (other templates)
```

## Installation

### Option 1: Using Shopify CLI

1. Install Shopify CLI:
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. Navigate to the theme directory:
   ```bash
   cd fineyst-jacket-shopify-store
   ```

3. Connect to your Shopify store:
   ```bash
   shopify theme dev --store your-store.myshopify.com
   ```

4. Push the theme to your store:
   ```bash
   shopify theme push
   ```

### Option 2: Manual Upload

1. Zip the entire theme folder
2. Go to your Shopify admin > Online Store > Themes
3. Click "Add theme" > "Upload zip file"
4. Upload the zipped theme

## Customization

### Theme Settings

Access the theme customizer via **Online Store > Themes > Customize** to modify:

- **Logo** - Upload your logo image
- **Colors** - Primary, secondary, accent, and background colors
- **Typography** - Heading and body fonts
- **Social Media** - Add your social media links
- **Chat Widget** - Enable/disable the chat button

### Sections

Each section can be customized in the theme editor:

#### Hero Banner
- Background image or video
- Title text
- Category links (Men/Women)

#### Welcome Section
- Title and description
- Feature blocks with icons

#### Featured Collection
- Select collection to display
- Number of products
- View all button

#### Categories
- Category images
- Titles and links

### Navigation

1. Go to **Online Store > Navigation**
2. Create a menu called `main-menu` for the header navigation
3. Create submenus for dropdowns

## Theme Sections Available

| Section | Purpose |
|---------|---------|
| Hero | Full-screen hero banner with image/video |
| Welcome | Introduction section with feature icons |
| Featured Collection | Display products from a collection |
| Categories | Image cards linking to categories |
| Testimonials | Customer reviews slider |
| Newsletter | Email signup form |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari
- Android Chrome

## Credits

- Font: [Oswald](https://fonts.google.com/specimen/Oswald) for headings
- Font: [Assistant](https://fonts.google.com/specimen/Assistant) for body text
- Icons: Custom SVG icons

## License

This theme is provided as-is for use with Shopify stores.

---

**Fineyst Jackets** - Premium Leather Jackets


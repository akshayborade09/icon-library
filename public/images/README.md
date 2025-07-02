# Public Images Folder

This folder contains static image assets that can be accessed directly via URL.

## Usage

### In HTML/JSX:
```jsx
<img src="/images/your-image.jpg" alt="Description" />
```

### In CSS:
```css
background-image: url('/images/your-image.jpg');
```

## File Organization

- `icons/` - Icon files (SVG, PNG)
- `logos/` - Logo images
- `backgrounds/` - Background images
- `thumbnails/` - Thumbnail images

## Supported Formats

- SVG (recommended for icons and logos)
- PNG (for images with transparency)
- JPG/JPEG (for photos and complex images)
- WebP (for optimized web images)

## Notes

- Images in this folder are served statically
- They don't get processed by Webpack
- Always use absolute paths starting with `/images/` 
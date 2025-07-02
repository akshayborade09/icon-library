# Assets Images Folder

This folder contains image assets that are imported directly into React components.

## Usage

### Import and use in components:
```jsx
import logoImage from '../assets/images/logo.png';
import iconImage from '../assets/images/icons/icon.svg';

function MyComponent() {
  return (
    <div>
      <img src={logoImage} alt="Logo" />
      <img src={iconImage} alt="Icon" />
    </div>
  );
}
```

### With dynamic imports:
```jsx
const [imageSrc, setImageSrc] = useState(null);

useEffect(() => {
  import('../assets/images/dynamic-image.jpg')
    .then(image => setImageSrc(image.default));
}, []);
```

## File Organization

- `icons/` - Component-specific icons
- `logos/` - Brand logos and company images
- `ui/` - UI elements and decorative images
- `avatars/` - User avatars and profile images

## Benefits

- Images get processed by Webpack
- Automatic optimization and compression
- Cache busting with unique hashes
- TypeScript support for imports
- Better tree shaking (unused images won't be bundled)

## Supported Formats

- SVG (as React components or images)
- PNG, JPG, JPEG, WebP
- GIF (for animations) 
# Personal Academic Website

A modern, professional academic website with a clean design and easy-to-update structure.

## Structure

- `index.html` - Main HTML structure
- `data.json` - All content data including publications (easy to update)
- `css/style.css` - Modern CSS styling
- `js/main.js` - JavaScript for dynamic content loading

## How to Update Content

### Easy Updates via `data.json`

Most content can be updated by editing `data.json`:

1. **Personal Information**: Update name, title, email, photo, social links
2. **Bio**: Update education and research descriptions
3. **News**: Add/remove news items in the `news` array
4. **Experience**: Update work experience in the `experience` array
5. **Talks**: Update invited talks in the `talks` array
6. **Service**: Update conference service in the `service` array

### Example: Adding a News Item

```json
{
  "date": "2024.01",
  "text": "New paper accepted!",
  "important": false
}
```

### Example: Adding an Experience

```json
{
  "period": "Jan 2024 - Present",
  "title": "Research Scientist",
  "organization": "Company Name",
  "hosts": [
    {
      "name": "Host Name",
      "link": "https://host-website.com"
    }
  ]
}
```

## Updating Publications

Publications are stored in `data.json` under the `publications` array. Simply add new publication entries following the existing format:

```json
{
  "year": "2025",
  "venue": "Conference Name Year",
  "venueClass": "venue-custom",
  "authors": [
    "Author 1",
    "Author 2",
    "Jiao Sun"
  ],
  "title": "Paper Title",
  "url": "https://paper-url.com",
  "tags": [
    "Tag 1",
    "Tag 2"
  ],
  "links": {
    "GitHub": "https://github.com/...",
    "Video": "https://video-url.com"
  }
}
```

The `js/main.js` script will automatically group these by year and render them prominently.

## Customization

### Colors

Edit CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #7c3aed;
    /* ... */
}
```

### Fonts

The site uses:
- **Inter** for body text (modern, clean)
- **Crimson Text** for headings (elegant, academic)

Change fonts in `css/style.css` by updating the `@import` statements and font-family declarations.

## Features

- ✅ Responsive design (mobile-friendly)
- ✅ Smooth scrolling navigation
- ✅ Modern, professional design
- ✅ Easy content updates via JSON
- ✅ Semantic HTML structure
- ✅ Accessible (ARIA labels, proper headings)
- ✅ Fast loading (minimal dependencies)

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## License

Personal website - feel free to use as a template for your own site!


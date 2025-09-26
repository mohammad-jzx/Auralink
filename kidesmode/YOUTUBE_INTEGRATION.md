# YouTube Stories Integration

This document describes the YouTube integration for the Kids Stories section.

## Features

- **Dual Mode Support**: Works with or without YouTube Data API key
- **Server-side Proxy**: API calls are made server-side to protect API keys
- **Client-side Caching**: 12-hour localStorage cache for better performance
- **Accessibility**: Full WCAG AA compliance with RTL support
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Environment Setup

### With YouTube API Key (Recommended)

1. Get a YouTube Data API v3 key from [Google Cloud Console](https://console.developers.google.com/)
2. Enable YouTube Data API v3 for your project
3. Add to your server environment:
   ```bash
   YOUTUBE_API_KEY=your_api_key_here
   ```

### Without API Key (Fallback Mode)

The system will automatically fall back to embedded playlist iframes when no API key is provided.

## API Endpoints

### GET /api/yt/playlist/:id/brief
Returns playlist metadata:
```json
{
  "id": "PL3CC0DF43F5C8814F",
  "title": "قصص تعليمية 1",
  "count": 10,
  "thumbUrl": "https://..."
}
```

### GET /api/yt/playlist/:id/items
Returns playlist items:
```json
{
  "id": "PL3CC0DF43F5C8814F",
  "items": [
    {
      "videoId": "JSdIyxPD1rw",
      "title": "Video Title",
      "thumbUrl": "https://...",
      "position": 1
    }
  ]
}
```

## Caching

- **Server**: In-memory cache for 12 hours
- **Client**: localStorage cache for 12 hours
- Cache keys: `brief_${playlistId}` and `items_${playlistId}`

## Playlists

Currently configured playlists:
1. `PL3CC0DF43F5C8814F` - قصص تعليمية 1
2. `PLC26PqZoC0AkS5f-GnxIzYs1yiBK7c4wW` - قصص تعليمية 2

## Usage

1. Visit the "قصصي" tab in the Kids section
2. Click on any playlist card to open the player
3. With API key: Navigate through individual videos with sidebar
4. Without API key: Use YouTube's built-in playlist controls

## Accessibility Features

- RTL layout support (`dir="rtl" lang="ar"`)
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader announcements for video changes
- Focus management in modals
- High contrast button states

## Error Handling

- Graceful fallback when API calls fail
- Loading states for all async operations
- Error messages in Arabic
- Retry mechanisms for failed requests

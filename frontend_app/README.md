# Angular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.1.

## Harmony Music Frontend

This app implements a Spotify-like UI using the "Ocean Professional" theme:
- Sidebar navigation (Home, Search, Your Library)
- Top bar with search input and user actions
- Main content area for feature pages
- Persistent bottom player bar

### Environment variables and API selection

The app reads NG_APP_* variables (when exposed on `window`) to determine backend availability:
- NG_APP_API_BASE
- NG_APP_BACKEND_URL
- NG_APP_WS_URL
- NG_APP_NODE_ENV
- NG_APP_FEATURE_FLAGS
- NG_APP_EXPERIMENTS_ENABLED

If NG_APP_API_BASE and NG_APP_BACKEND_URL are both missing, the app automatically uses a MockApiService with sample data.

To switch to real APIs in the future, set either:
- NG_APP_API_BASE, or
- NG_APP_BACKEND_URL

and implement a real ApiService (then update `provideApiService(false)` in app.component providers to point to the real implementation).

### Running locally

```bash
npm install
npm run start
# App serves on http://localhost:3000 (see angular.json serve options)
```

### Accessibility

Controls include aria-labels, focus rings, and keyboard support:
- Enter on track rows plays a track
- Player provides aria labels for seek/volume/mute

### Project structure

- src/app/core: environment, theme, audio, API services, playback state
- src/app/shared: reusable UI components (sidebar, topbar, grid, track list, player)
- src/app/features: feature pages (home, search, library, playlist)
- CSS variables define theme colors and spacing

For more Angular CLI information, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

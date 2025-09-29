# FloatChat

FloatChat is a multi-modal oceanographic AI chat interface prototype built with React + Vite + Tailwind CSS. It showcases three interaction modes:

1. Standard Query – Textual analytical responses
2. Visual Discovery – Generates simple exploratory charts
3. Deep Search – Renders synthetic geospatial sampling points

All AI logic is mocked locally in `src/utils/getFloatChatResponse.js`.

## Features
- React functional components with hooks
- Tailwind CSS utility-first styling
- Responsive, hover-expand & pin-able sidebar
- Mode-aware chat interface with dynamic structured blocks
- Recharts line chart visualization
- Synthetic SVG-based geospatial mock map
- Accessible keyboard submission (Enter to send, Shift+Enter newline)

## Project Structure
```
/src
  components/   # UI components
  utils/        # Mock AI logic
  styles/       # Tailwind entry CSS
  assets/       # (placeholder for images)
```

## Getting Started

Install dependencies and run the dev server:

```powershell
npm install
npm run dev
```

Then open the printed local URL (default http://localhost:5173).

## Build
```powershell
npm run build
npm run preview
```

## Customization Ideas
- Integrate real model/API calls inside `getFloatChatResponse`
- Add persistent conversation storage (localStorage or backend)
- Replace SVG mock map with Mapbox/Leaflet/Deck.gl
- Add authentication & user profiles
- Extend chart library usage (bar, heatmaps, multi-axes)

## License
Prototype code – adapt freely for internal experimentation.

# Cities on Focus

Spatial Research Hub and interactive WebGIS platform for urban dynamics, spatial analysis, and remote sensing.

Merumuskan persoalan ruang menjadi peluang penataan kawasan.

This document is the development plan. Spatial processing stays in QGIS. The website only publishes what you export: GeoJSON or XYZ tiles, one case study at a time.

## 1. What the site is

A static site. No database and no build step.

- **Home** introduces the hub and scrolls to the case-study list.
- **Case studies** are the main content. Each one is a card on the home page and its own map page.
- Studies are added one by one. The list grows by adding a folder and one catalog entry. Nothing else on the home page needs to be rewritten.

## 2. Folder structure

```text
Cities-on-Focus/
├── index.html                      Home: hero + case-study list
├── style.css                       Shared styles
├── js/
│   └── main.js                     Reads the catalog and builds the cards
├── data/
│   └── case-studies.json           The list of studies
├── case-studies/
│   └── _template/                  Copy this folder for each new study
│       ├── index.html              That study's map page
│       ├── map.js                  Map center, GeoJSON path, or tile path
│       ├── data/                   GeoJSON export from QGIS
│       └── tiles/                  XYZ tiles: {z}/{x}/{y}.png
├── images/
│   ├── logo.png
│   └── cities.jpg
└── README.md
```

`_template` is a starter, not a published study. The home page lists only entries in `data/case-studies.json` with `"status": "published"`.

Use relative paths (`images/logo.png`, `case-studies/slug/index.html`). Absolute paths that start with `/` break when the site is hosted in a subfolder, which is how GitHub project pages work.

## 3. Home page

Keep the current hero. Change the layout so the hero is the first screen and the case-study list sits below it, not inside the same centered flex box. The city photo stays on the hero. The list uses the dark page background so the cards read clearly.

**Explore Case Studies** links to `#case-studies`.

- `scroll-behavior: smooth` on `html` does the scroll.
- `scroll-margin-top` on `#case-studies` keeps the sticky header from covering the title.
- Respect `prefers-reduced-motion` by turning smooth scroll off for people who ask the browser for less motion.

The section heading stays **Spatial Narratives**, with the line *Kumpulan studi kasus analisis spasial*.

## 4. Case-study cards

`js/main.js` fetches `data/case-studies.json` and draws one box per published study.

Each card shows:

- title
- location and year
- a short summary of the spatial question
- tags (for example GeoJSON, remote sensing, urban)
- a link, **Open WebGIS**, to that study's page

If the catalog is empty, the section still exists (so the button has somewhere to scroll) and shows a short note that studies will appear as they are published.

`fetch` only works through a web server such as Live Server. Opening `index.html` as a file will not load the catalog.

Catalog shape:

```json
[
  {
    "title": "Study title",
    "location": "City",
    "year": "2026",
    "summary": "What spatial question this map answers.",
    "tags": ["GeoJSON", "Urban"],
    "href": "case-studies/study-slug/index.html",
    "status": "published"
  }
]
```

`"status": "draft"` keeps a study off the home page until the map is ready.

## 5. One map page per study

Copy `case-studies/_template` to a new folder. The folder name is the URL slug: lowercase, hyphens, no spaces (`kampung-river-edge`).

The page is a simple Leaflet map:

- dark CARTO basemap, so it matches the site
- then either a GeoJSON layer or an XYZ tile layer from QGIS
- a link back to `index.html#case-studies`

`map.js` holds only the settings for that study: center `[latitude, longitude]`, zoom, and one of:

- `geojson: "data/study.geojson"`
- `tiles: "tiles/{z}/{x}/{y}.png"`

After a GeoJSON layer loads, fit the map to its bounds.

## 6. QGIS to the website

Leaflet's map is Web Mercator (EPSG:3857).

| Export | Use when | CRS | Where it goes |
| --- | --- | --- | --- |
| GeoJSON | Boundaries, points, and other vectors that are not huge | EPSG:4326 | `case-studies/<slug>/data/study.geojson` |
| XYZ tiles | Styled rasters, imagery, or a layer too heavy to send as vectors | EPSG:3857 | `case-studies/<slug>/tiles/{z}/{x}/{y}.png` |

GeoJSON: set the layer to EPSG:4326, then **Export → Save Features As… → GeoJSON**.

XYZ: **Processing Toolbox → Generate XYZ tiles (Directory)**. Export only the zoom levels the study needs (for example 10–16). More levels multiply the number of files. Point `map.js` at `tiles/{z}/{x}/{y}.png` and set `maxZoom` to the highest level you exported.

If a tile overlay is shifted up or down, the folder used TMS row order. Set `tms: true` in `map.js`.

A full-city tile pyramid is often too large for Git. Commit a modest zoom range, or host the `tiles` folder elsewhere and put that URL in `map.js`. A tiles URL on another domain must allow this site (CORS).

## 7. Order of work

1. Fix the home layout so the hero and the case-study section stack, and point the button at `#case-studies`.
2. Add `data/case-studies.json` (start with `[]`) and `js/main.js` to render cards.
3. Add `case-studies/_template` with Leaflet, `map.js`, and empty `data/` and `tiles/` folders.
4. Publish the first real study by copying the template, exporting from QGIS, and appending one catalog object.
5. Repeat step 4 for each next study.
6. Deploy when the first study is worth showing.

## 8. Preview

1. Install the Live Server extension in Cursor or VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. Open `http://127.0.0.1:5500` (the port may differ).
4. Click **Explore Case Studies** and confirm the page scrolls to Spatial Narratives.
5. Open a study card and confirm the layer sits on the basemap.

The same check from this folder:

```bash
python -m http.server 5500
```

## 9. Deployment

The site is static files: HTML, CSS, JavaScript, JSON, images, GeoJSON, and tiles.

### GitHub Pages

1. Push `main` to GitHub.
2. Repository → **Settings** → **Pages**.
3. **Build and deployment** → **Deploy from a branch**.
4. Branch: `main`. Folder: **/ (root)**. Save.
5. When the Pages workflow finishes, the site is at `https://<github-username>.github.io/Cities-on-Focus/`.
6. Check the home page, the scroll, and one map. A 404 on an image or on `case-studies.json` usually means a link starts with `/` instead of a relative path.

Later pushes to `main` update the live site after Pages rebuilds. Large tile folders make those pushes slow.

### Netlify

1. Create a site from the GitHub repository, or drag this folder onto Netlify.
2. Build command: empty. Publish directory: `.` (the repository root).
3. Deploy. Netlify provides the HTTPS URL.

## 10. What does not go on the site

QGIS projects, scratch layers, and intermediate rasters stay off the website. Each study page receives only the export you want people to read, plus the short text on its card.

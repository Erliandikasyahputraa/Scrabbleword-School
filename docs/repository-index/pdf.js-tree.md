# PDF.js - Repository Tree & Overview

## Folder Tree
```
pdf.js/
├── LICENSE
├── package.json
├── gulpfile.mjs
├── tsconfig.json
├── docs/
├── examples/
│   ├── components/
│   ├── learning/
│   └── svgviewer/
├── extensions/
├── external/
├── l10n/
├── src/
│   ├── display/
│   │   ├── api.js
│   │   ├── canvas.js
│   │   └── text_layer.js
│   ├── shared/
│   └── core/
├── test/
└── web/
    ├── app.js
    ├── app_options.js
    ├── pdf_page_view.js
    ├── pdf_viewer.js
    ├── toolbar.js
    ├── viewer.css
    ├── viewer.html
    └── viewer.js
```

## Important Directories
- **`src/`**: Core library files divided into `display` (canvas rendering, API layers), `core` (low-level parsing, font engines), and `shared`.
- **`web/`**: Code for Mozilla's default HTML/CSS PDF viewer interface.
- **`examples/`**: Useful sample applications using the library.

## Important Files
- **`web/viewer.html`**: The HTML scaffold for the visual viewer UI.
- **`web/app.js`**: Core orchestration layer (`PDFViewerApplication`) managing page viewports, sidebars, histories, and searches.
- **`web/pdf_viewer.js`**: Orchestration logic for layout, scrolling, and rendering.
- **`src/display/api.js`**: Document loader, page grabber, metadata readers, and other API definitions.

## Entry Points
- **Production API**: `src/display/api.js`
- **Default Browser Viewer**: `web/viewer.html`

## Dependencies
- Pure vanilla Javascript in core.
- Localization: `@fluent/bundle`, `@fluent/dom` for UI localizations.
- Build dependencies: `gulp`, `webpack`, `babel` for transpilation.

## Build Flow
- Configured using Gulp.
- Run `gulp generic` to bundle files into generic builds, which generates `build/generic/build/pdf.js` and `build/generic/web/viewer.html`.

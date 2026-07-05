# Repository Analysis - pdf.js

## 1. Repository Overview
- **Repository Name**: pdf.js
- **Purpose**: Low-level HTML5 PDF reader and viewer engine by Mozilla.
- **License**: Apache-2.0 License
- **Technology Stack**: Vanilla JavaScript (ES Modules), HTML5, CSS3, Gulp, Webpack, Babel
- **Dependencies**: `@fluent/bundle`, `@fluent/dom` (UI translation/i18n), canvas engine configurations
- **Build System**: Gulp (`gulpfile.mjs`) + Webpack
- **Folder Structure**: Structured core monorepo. Low-level core engines in `src/`, UI viewer logic in `web/`, extension components in `extensions/`.
- **Entry Point**: `src/display/api.js` (core API loader) / `web/viewer.html` (visual viewer UI)
- **Important Directories**: `src/`, `web/`, `examples/`
- **Important Files**: `web/viewer.js`, `web/app.js`, `src/display/api.js`, `src/display/canvas.js`
- **Estimated Complexity**: High (extremely large library handling complex binary decoding, canvas rendering, text mapping, and DOM virtualization).

## 2. Purpose
Provides a client-side solution to open, parse, extract, and render PDF documents directly in browsers. It avoids relying on native PDF browser plug-ins, enabling custom overlays, text selections, search highlights, and zoom levels.

## 3. Technology Stack
- **Languages**: Vanilla ES6 JavaScript, HTML5 Canvas, CSS.
- **Localization**: Fluent API (`@fluent/bundle`) for internationalized layouts.
- **Build**: Gulp task suites compiling modular files into transpiled bundles.

## 4. Folder Structure
- `src/core/`: PDF document parses, decryptors, font compilers.
- `src/display/`: Canvas rendering pipelines, text layout layer builders, viewports.
- `web/`: The complete viewer application (toolbar, zoom selectors, sidebar thumbnails).

## 5. Architecture
The architecture separates parsing from rendering:
- **Core Worker Thread**: Runs parsing in a Web Worker thread to keep the main thread responsive.
- **Display Layer**: Receives drawing instructions from the worker and renders them on an HTML5 canvas (`src/display/canvas.js`).
- **Text Layer**: Renders an invisible HTML text overlay exactly on top of the canvas, enabling native copy-paste and text search (`src/display/text_layer.js`).
- **Viewer App Layer** (`web/app.js`): Coordinates viewer state (active document, current page, zoom level, outline sidebar).

## 6. Design Patterns
- **Worker/Main Separated Threading Pattern**: Uses background Web Workers to run heavy parsing operations asynchronously.
- **Observer Pattern**: Simple event dispatching (`event_utils.js`) notifying toolbar elements, page indicators, and sidebars of scroll and page updates.
- **State Machine Pattern**: Handles viewport scaling and loading states (Document Loading, Page Rendering, Completed).

## 7. Components
- **Toolbar**: Houses pagination buttons, zoom toggles, and presentation modes.
- **Thumbnail Viewer** (`pdf_thumbnail_viewer.js`): Lazy-loaded scroll list of page previews.
- **Find Bar** (`pdf_find_bar.js`): UI and logic for highlight-on-match text search.

## 8. Utilities
- `ui_utils.js`: Viewport boundaries, scroll tracking, CSS helpers.
- `pdf_find_controller.js`: Matches regex sequences within extracted text layer streams.

## 9. Engineering Decisions
- **Page Virtualization**: Renders only pages currently inside (or close to) the viewport. Pages scrolled out of view are unrendered to save memory.
- **Web Canvas Layering**: Draws lines and text vectors to canvas first, then overlays matching transparent DOM spans for text selection.

## 10. Strengths
- **Fully Featured**: Rich viewer with text selection, sidebar thumbnails, find options, and responsive scaling.
- **Highly Optimised**: Web Worker execution and DOM virtualization allow it to handle very large PDFs.
- **Cross-Browser Compatibility**: Renders reliably across all modern browsers.

## 11. Weaknesses
- **Monolithic & Heavy**: The codebase is large and has tight internal coupling. It is difficult to split or customize.
- **Complex Integration**: Embedding the full viewer is challenging because it relies on specific path layouts and Web Worker files.
- **Styling**: The default styling is dated and uses complex global CSS, making it hard to match a modern UI layout.

## 12. Complexity
- **High**. Requires deep knowledge of PDF binary syntax, canvas coordinate mapping, and browser memory optimization.

## 13. Recommended Reuse
- **React-PDF / PDFJS-dist Wrapper**: We should use the bundled core (`pdfjs-dist`) rather than copying raw source files.
- **Text Selection & Canvas Layout**: Reuse the dual-layer rendering strategy (Canvas background + HTML text overlay) for clean document display.

## 14. Things Not To Reuse
- The default viewer (`web/viewer.html` and `web/viewer.js`) should not be copied directly. It is too heavy and has a dated design. Instead, build a custom UI wrapper using TailwindCSS and React, and bind it to the core library APIs.

## 15. Overall Evaluation
The industry-standard PDF rendering engine. We should use `pdfjs-dist` to load and render pages, but build a custom, modern PDF viewer using React, TailwindCSS, and lucide-react to match the dashboard's design.

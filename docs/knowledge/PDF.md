# PDF Rendering & Navigation Knowledge Base

This document synthesizes PDF rendering, zoom, navigation, and text-selection overlay strategies.

## 1. Dual-Layer Canvas Rendering
- **Concept**: Render PDF pages onto HTML5 Canvases for sharp visual displays, and overlay transparent HTML text elements on top to enable native text selection and copy-paste.
- **Implementation**:
  - **Visual Layer**: `pdfjs-dist` loads document data and renders vectors directly onto an HTML5 `<canvas>` element.
  - **Text Selection Layer**: `TextLayerBuilder` extracts font coordinates and renders invisible text spans exactly over the canvas elements.
  - **Annotation Layer**: `AnnotationLayerBuilder` overlays interactive links, form inputs, and custom annotations over the matching canvas areas.

## 2. Dynamic Viewport Scaling (Zoom)
- **Concept**: Calculate page dimensions dynamically to adjust zoom levels while keeping the layout sharp.
- **Implementation**:
  - Page views accept a `scale` factor (e.g. `1.0` for 100% size) or page width constraints (e.g. `page-width`, `page-fit`, `auto`).
  - The API scales the PDF viewport dynamically:
    ```javascript
    const viewport = pdfPage.getViewport({ scale: currentScale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    ```
  - This resizes the canvas container while maintaining the correct aspect ratio.

## 3. Virtualized Navigation & Lazy Loading
- **Concept**: Render only pages within or close to the viewport to optimize browser memory when viewing large PDF documents.
- **Implementation**:
  - The viewer monitors scroll positions (`pdf_rendering_queue.js` / `pdf_viewer.js`).
  - Pages scrolled out of view are marked as `IDLE` and their canvas structures are cleared from memory.
  - Pages entering the viewport are marked as `RUNNING` and queued for rendering.
  - Generates low-resolution thumbnail views on the sidebar (`pdf_thumbnail_viewer.js`) for quick document navigation.

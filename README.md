# Konayuki PDF

[Open Konayuki PDF](https://simonpaulboehm.github.io/mdconverter/)

A browser-based tool that converts HTML and Markdown files into beautifully themed, print-ready PDFs, no backend required.

## Technologies

---

- `React 19`
- `Vite`
- `marked` — Markdown parsing
- `gh-pages` — GitHub Pages deployment

## Features

---

- **Drag & drop or browse** to upload `.html`, `.htm`, or `.md` files
- **Paste content** directly into the editor — switch between HTML and Markdown input modes
- **Live preview** — side-by-side editor and rendered preview
- **Built-in themes** — Konayuki Light and Konayuki Dark, both print-optimized
- **Custom CSS themes** — upload any Typora-compatible stylesheet; a template is provided to download
- **Document metadata** — set a title and date displayed in optional header/footer bars
- **Print / Save PDF** — opens the browser print dialog with full-bleed color support

## Keyboard Shortcuts

---

```
No custom shortcuts — use browser-native shortcuts (e.g. Ctrl/Cmd+P to print)
```

## The Process

---

The app takes HTML or Markdown input and wraps it in a full HTML document with an injected CSS theme. When printing, the browser renders the themed document exactly as it appears in the preview — including background colors and custom fonts — by setting `print-color-adjust: exact`. Markdown is parsed client-side via `marked` before being handed off to the same rendering pipeline.

Custom themes follow the Typora CSS spec: styles target a `#write` container, and optional `.kh`/`.kf` classes control header and footer bars.

## What I Learned

---

- How to use the browser's `window.print()` API to generate styled PDFs without any server-side tooling
- How `print-color-adjust: exact` and `@media print` rules let you preserve background colors and custom fonts in printed output
- How to build a drag-and-drop file loader with `FileReader` and React refs
- How to dynamically inject CSS into an `<iframe>` `srcDoc` for live theming

## Running the Project

---

[Open Konayuki PDF](https://simonpaulboehm.github.io/mdconverter/)


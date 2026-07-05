# Crossword Layout Generator - Repository Tree & Overview

## Folder Tree
```
Crossword-Layout-Generator/
├── LICENSE
├── README.md
├── index.html
├── layout_generator.js
└── example_images/
    ├── crossword_search.png
    └── crossword_search_small.png
```

## Important Directories
- **`example_images/`**: Contains visual previews of generated crossword layouts and word searches.

## Important Files
- **`layout_generator.js`**: Core algorithm code containing matrix initialization, word placement, conflict detection, score calculations, and cleanup.
- **`index.html`**: Demonstration page providing a textarea for word input, buttons to run the generator, and display blocks for the output HTML, JSON, and word search.

## Entry Points
- **Browser**: [index.html](file:///c:/Mine/JOKI/scrabblewordseser/references/Crossword-Layout-Generator/index.html)
- **Node.js**: [layout_generator.js](file:///c:/Mine/JOKI/scrabblewordseser/references/Crossword-Layout-Generator/layout_generator.js) (exports `generateLayout`)

## Dependencies
- None. Pure vanilla Javascript.

## Build Flow
- No build system. The file runs directly in the browser or via Node.js require.

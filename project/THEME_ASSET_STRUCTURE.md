# Theme Asset Structure

## Folder Hierarchy

The themes for the application are stored in the following directory:
`frontend/public/assets/themes/`

## Expected Image Filenames

The following JPEG files are expected to be present in the directory:
- `balloon-valley.jpeg`
- `school-adventure.jpeg`
- `fantasy-portal.jpeg`
- `watercolor-hills.jpeg`
- `dreamy-sky.jpeg`
- `sunset-valley.jpeg`

## Purpose of Each Asset

These assets will serve as the core background imagery for the dynamic theme system. Each file visually transforms the entire Crossword Workspace layout, setting the mood and aesthetics based on user preference.

## Naming Convention

- Use lowercase text.
- Use hyphens (`-`) for spaces.
- Extension MUST be `.jpeg`.

## Future Implementation Notes

- **DO NOT** commit these images into Git at this moment. The images are intentionally excluded from Git until manually copied by the project owner.
- The dynamic theme system will programmatically reference these filenames to apply inline CSS background images to the workspace wrapper.
- Further configuration (such as scaling, opacity, background attachment) will be handled separately in the React components after images are confirmed present.

## Theme Mapping

| Theme | Image |
|--------|-------------------------|
| Sunset Valley | `sunset-valley.jpeg` |
| School Adventure | `school-adventure.jpeg` |
| Fantasy Portal | `fantasy-portal.jpeg` |
| Dreamy Sky | `dreamy-sky.jpeg` |
| Watercolor Hills | `watercolor-hills.jpeg` |
| Balloon Valley | `balloon-valley.jpeg` |

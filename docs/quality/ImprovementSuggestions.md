# Knowledge Base Improvement Suggestions

This document lists suggestions for improving our internal documentation, codebase patterns, and reference audits.

## 1. Documentation Enhancements
- **Laravel API Layout Guides**:
  - We should create API contract guides that define the JSON response schemas for the crossword generator and student history endpoints. This will make it easier to integrate the Laravel backend with our React frontend.
- **Tailwind v3 vs v4 Mapping**:
  - The references (`magicui`, `shadcn-admin`, `shadcn-table`) use TailwindCSS v4 configurations. If our project workspace uses TailwindCSS v3, we should write class mapping rules to ensure component styling is consistent.

## 2. Recommended Code Audits
- **PDF.js Worker Setup**:
  - Inspect standard Webpack worker loading configurations (like `worker-loader`) to determine the cleanest way to bundle PDF.js workers in our React environment.
- **Zod Schema Reusability**:
  - Define shared schemas for validating crossword inputs (word lists, lengths, clues) on both the React frontend and Laravel backend.

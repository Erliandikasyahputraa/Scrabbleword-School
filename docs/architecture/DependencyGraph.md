# Architecture Module Dependency Graph

This document visualizes dependencies and relationships between the application's backend and frontend modules.

## Module Dependency Chart

```mermaid
graph TD
    subgraph Frontend ["Frontend Modules (React 19 SPA)"]
        F_Auth["Auth Module"]
        F_Dash["Dashboard Shell Layout"]
        F_Course["Course Module"]
        F_Material["Material Module"]
        F_PDF["PDF Viewer"]
        F_Crossword["Crossword Grid Fitter"]
        
        F_Dash --> F_Auth
        F_Course --> F_Auth
        F_Material --> F_Course
        F_PDF --> F_Material
        F_Crossword --> F_Material
    end

    subgraph Backend ["Backend Modules (Laravel REST API)"]
        B_Auth["Sanctum Auth Module"]
        B_Course["Course Module"]
        B_Material["Material Module"]
        B_Grading["Grading Service"]
        B_Submission["Submission Module"]
        
        B_Course --> B_Auth
        B_Material --> B_Course
        B_Submission --> B_Auth
        B_Submission --> B_Material
        B_Submission --> B_Grading
    end

    F_Auth <-->|API tokens| B_Auth
    F_Course <-->|Fetch/create courses| B_Course
    F_Material <-->|Upload PDF & clues| B_Material
    F_Crossword -->|Submit scores| B_Submission
```

- **Authentication Dependency**: All secure frontend modules depend on the Auth Module to provide access tokens for secure API requests.
- **Material Dependency**: Both the PDF Viewer and Crossword modules depend on the Material Module to load the PDF files and crossword clue configurations.
- **Submissions Dependency**: The backend Submission module coordinates with the Grading Service and Material module to grade student attempts and save results.

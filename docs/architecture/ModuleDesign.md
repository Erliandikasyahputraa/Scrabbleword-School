# Module Architecture Design

This document defines responsibilities, dependencies, and interfaces for each core software module in the Scrabble Wordseser MVP.

---

## 1. Authentication Module
- **Responsibility**: Manages user login, registration, and logout operations. Distributes secure tokens to authenticated users.
- **Dependencies**: None.
- **Public Interfaces**:
  - `POST /api/auth/register`: Register new users.
  - `POST /api/auth/login`: Authenticate credentials and return token.
  - `POST /api/auth/logout`: Invalidate user tokens.

---

## 2. Dashboard Module
- **Responsibility**: Serves as the home portal, displaying course summaries, user metrics, and navigation links.
- **Dependencies**: Course Module, Submission Module.
- **Public Interfaces**:
  - `GET /api/dashboard/summary`: Return statistics (total courses, completed material, average scores).

---

## 3. Course Module
- **Responsibility**: Manages courses and student enrollments.
- **Dependencies**: Authentication Module.
- **Public Interfaces**:
  - `GET /api/courses`: List active courses.
  - `POST /api/courses` (Teacher only): Create new courses.
  - `DELETE /api/courses/{id}` (Teacher only): Archive courses.

---

## 4. Material Module
- **Responsibility**: Manages study materials attached to courses, coordinating PDF files and crossword keys.
- **Dependencies**: Course Module.
- **Public Interfaces**:
  - `GET /api/courses/{courseId}/materials`: List materials inside a course.
  - `POST /api/courses/{courseId}/materials` (Teacher only): Upload a new material (multipart/form-data PDF + JSON clues/answers).

---

## 5. PDF Viewer Module
- **Responsibility**: Renders PDF pages onto canvas viewports inside the React client app.
- **Dependencies**: Material Module.
- **Public Interfaces**:
  - Frontend component `<PdfViewer fileUrl={url} />` exposing navigation hooks (next/prev pages) and scaling modifiers (zoom).

---

## 6. Crossword Module
- **Responsibility**: Generates crossword grid layouts from answer keys, manages interactive crossword inputs, and checks solutions.
- **Dependencies**: Material Module.
- **Public Interfaces**:
  - TypeScript algorithm `generateLayout(clues: Clue[]): LayoutResult` (generating grid coordinates client-side).
  - Frontend component `<CrosswordGrid layout={layout} onComplete={submitAnswer} />`.

---

## 7. Submission & Score Module
- **Responsibility**: Grades crossword puzzles and saves student attempts to the score history.
- **Dependencies**: Authentication, Crossword, and Material Modules.
- **Public Interfaces**:
  - `POST /api/materials/{materialId}/submissions`: Grade attempt and save score details.
  - `GET /api/submissions/history`: List completed attempts and scores for the current user.

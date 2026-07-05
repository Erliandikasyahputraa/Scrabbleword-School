# File Generation Blueprint Plan

This document lists all frontend components and backend code files to build during the implementation phase.

---

## 1. Authentication Module

### Backend Files
- **Controller**: `app/Http/Controllers/AuthController.php` (login, registration, logout requests)
- **Requests**:
  - `app/Http/Requests/RegisterRequest.php`
  - `app/Http/Requests/LoginRequest.php`
- **Tests**: `tests/Feature/AuthTest.php`

### Frontend Files
- **Views**:
  - `src/features/auth/components/LoginForm.tsx`
  - `src/features/auth/components/RegisterForm.tsx`
- **Store**: `src/stores/authStore.ts` (manages auth state and access tokens)

---

## 2. Dashboard Shell Layout Module

### Frontend Files
- **Components**:
  - `src/components/layout/AppSidebar.tsx` (collapsible sidebar)
  - `src/components/layout/Header.tsx` (sticky top bar)
  - `src/components/layout/AuthenticatedLayout.tsx` (authenticated dashboard shell)
- **Store**: `src/stores/sidebarStore.ts` (manages sidebar open/collapsed state)

---

## 3. Course Management Module

### Backend Files
- **Controller**: `app/Http/Controllers/CourseController.php` (list, create, delete courses)
- **Model**: `app/Models/Course.php`
- **Request**: `app/Http/Requests/CourseCreateRequest.php`
- **Policy**: `app/Policies/CoursePolicy.php`
- **Migration**: `database/migrations/xxxx_xx_xx_create_courses_table.php`
- **Tests**: `tests/Feature/CourseTest.php`

### Frontend Files
- **Views**:
  - `src/features/courses/components/CourseList.tsx` (course dashboard grid)
  - `src/features/courses/components/CourseCreateDialog.tsx` (teacher creation modal)

---

## 4. Material Upload & Learning Portal Module

### Backend Files
- **Controller**: `app/Http/Controllers/MaterialController.php` (list materials, upload files)
- **Model**: `app/Models/Material.php`
- **Request**: `app/Http/Requests/MaterialUploadRequest.php`
- **Service**: `app/Services/FileStorageService.php` (handles PDF file saves)
- **Migration**: `database/migrations/xxxx_xx_xx_create_materials_table.php`
- **Tests**: `tests/Feature/MaterialTest.php`

### Frontend Files
- **Components**:
  - `src/features/pdf-viewer/components/PdfPageViewer.tsx` (renders page content onto canvas)
  - `src/features/pdf-viewer/components/PdfToolbar.tsx` (zoom controls, pagination toggles)
  - `src/features/crossword/components/CrosswordCell.tsx` (individual crossword input cell)
  - `src/features/crossword/components/CrosswordGrid.tsx` (renders interactive clue matrix)
- **Utility**: `src/features/crossword/utils/layoutGenerator.ts` (TypeScript port of crossword layout generator algorithm)
- **Views**:
  - `src/features/courses/components/MaterialLearnPortal.tsx` (split-pane learning dashboard)
  - `src/features/courses/components/MaterialUploadDialog.tsx` (teacher upload form modal)

---

## 5. Submissions & Score History Module

### Backend Files
- **Controller**: `app/Http/Controllers/SubmissionController.php` (grade submissions, fetch history)
- **Model**: `app/Models/Submission.php`
- **Request**: `app/Http/Requests/SubmissionRequest.php`
- **Service**: `app/Services/GradingService.php` (compares answers and calculates scores)
- **Migration**: `database/migrations/xxxx_xx_xx_create_submissions_table.php`
- **Tests**: `tests/Feature/SubmissionTest.php`

### Frontend Files
- **Views**:
  - `src/features/dashboard/components/StudentHistoryTable.tsx` (score log view)

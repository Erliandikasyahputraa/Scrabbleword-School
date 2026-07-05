# Security Framework Design

This document outlines the security policies, input validation rules, and threat prevention strategies for the Scrabble Wordseser MVP.

## 1. Authentication & Session Security
- **API Token Security**: Uses Laravel Sanctum for API token authentication. Tokens are transmitted in the HTTP Authorization header (`Authorization: Bearer <token>`) and verified on the server.
- **Token Invalidation**: Logging out invalidates the token on the server immediately:
  ```php
  $user->currentAccessToken()->delete();
  ```

---

## 2. Authorization Rules
- **Role-Based Access Control (RBAC)**: Exposes two primary roles: `teacher` and `student`.
- **Policy Enforcement**: Secure operations (like creating courses or uploading materials) are protected by Laravel policies that restrict access to users with the `'teacher'` role.

---

## 3. Data Integrity & Validation

### File Upload Validation
- Restricts uploaded material files to the PDF format:
  ```php
  'pdf_file' => 'required|file|mimes:pdf|max:10240' // Limit size to 10MB
  ```
- Store PDFs in secure storage directories:
  ```php
  Storage::disk('public')->putFile('materials', $request->file('pdf_file'));
  ```

### Input Validation
- Validate all incoming request payloads against strict schemas using Laravel Form Requests.
- Sanitize user input on both the frontend and backend to protect against security risks:
  - **SQL Injection**: Use Laravel's Eloquent ORM, which automatically uses PDO parameter binding to prevent SQL injection.
  - **Cross-Site Scripting (XSS)**: Sanitize HTML inputs and escape output tags.
  - **Cross-Site Request Forgery (CSRF)**: Protect web application endpoints with standard CSRF token checks.
  - **Rate Limiting**: Apply Laravel's rate limiting middleware (`throttle:api`) to auth and submission endpoints to prevent brute-force attacks.

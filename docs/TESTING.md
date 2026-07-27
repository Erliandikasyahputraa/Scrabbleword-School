# Testing Strategy

## Automated Testing
*Due to shared hosting constraints, unit/feature tests run only in local development.*
- Run PHPUnit/Pest: `php artisan test`

## Manual Verification Checklist
When deploying or finalizing a feature, manually verify:
- [ ] **Login:** Retrieve Bearer Token via `/api/auth/login`.
- [ ] **Role Testing:** Ensure Student cannot access Teacher endpoints (403).
- [ ] **Material Upload:** Upload a PDF and ensure it saves correctly without symlinks.
- [ ] **Crossword Engine:** Verify JSON crossword data generation and validation.
- [ ] **Submissions:** Ensure a student can submit a crossword score and it reflects in the DB.
- [ ] **API Console:** Visit `/` and verify health indicators are Green/Operational.

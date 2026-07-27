# InfinityFree Deployment

## FTP Folder

- **core** -> upload ke `/` (berada di luar htdocs)
- **htdocs** -> upload ke `/htdocs` (isi file dari htdocs dipindahkan ke dalam `/htdocs` server)

## Database

Import:
`database.sql` ke dalam database InfinityFree menggunakan phpMyAdmin.

## Environment

Isi variabel berikut di dalam file `.env`:
- APP_URL
- DB_HOST
- DB_DATABASE
- DB_USERNAME
- DB_PASSWORD
- FRONTEND_URL
- SANCTUM_STATEFUL_DOMAINS

## Vercel

Update Environment Variable:
- VITE_API_URL

## Verification

- [ ] Login
- [ ] Dashboard
- [ ] Admin
- [ ] Teacher
- [ ] Student
- [ ] Upload PDF
- [ ] Streaming PDF
- [ ] Crossword
- [ ] Submission
- [ ] History

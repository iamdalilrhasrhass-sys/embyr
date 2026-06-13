# Embir API Documentation

Base URL: `https://embir.xyz/api`

## Authentication
Most endpoints require a JWT token in the `Authorization` header.

### POST /auth/send-code
Send SMS verification code.
```json
{ "phone": "+33612345678" }
```
Response: `{ "ok": true, "expiresIn": 300 }`

### POST /auth/verify-code
Verify code and create session.
```json
{ "phone": "+33612345678", "code": "123456" }
```
Response: `{ "token": "jwt...", "user": { ... } }`

### POST /auth/register
Complete registration.
```json
{ "email": "user@example.com", "password": "...", "name": "..." }
```
Response: `{ "ok": true, "user": { ... } }`

## Users

### GET /profiles
List profiles with filters.
Query: `?gender=HOMME&lookingFor=RENCONTRE_SERIEUSE&city=paris`

### GET /profiles/[id]
Get a specific profile.

### PATCH /profiles/[id]
Update profile. Requires auth.

## Messages

### GET /messages?userId=X
List messages with a user. Requires auth.

### POST /messages
Send a message. Requires auth.
```json
{ "toUserId": "...", "content": "Hello!" }
```

## Analytics (Admin)

### POST /analytics/track
Track an event (from frontend).
```json
{ "event": "page_view", "properties": {}, "timestamp": 1234567890, "page": "/", "language": "en" }
```
Response: `{ "ok": true }`

### GET /admin/analytics
Admin analytics dashboard (requires admin role).
Returns page with real-time stats.

## Feedback

### POST /feedback
Submit user feedback.
```json
{ "type": "bug", "message": "Button not working", "userEmail": "user@example.com", "pageUrl": "/settings" }
```
Response: `{ "ok": true }`

### GET /feedback
List feedback (admin). Query: `?status=new&limit=50`

## Blog
Blog content is served as static pages. No API endpoint needed.
- `/blog` — Blog index
- `/blog/[slug]` — Individual article

## Error Format
All errors follow:
```json
{ "error": "Error message" }
```

## Rate Limiting
- Auth endpoints: 5 requests/minute per IP
- General API: 100 requests/minute per IP
- Analytics: No rate limit (fire-and-forget)

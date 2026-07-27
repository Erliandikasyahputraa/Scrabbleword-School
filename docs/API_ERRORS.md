# API Error Responses

All API errors return a standard JSON structure with the appropriate HTTP status code.

```json
{
    "success": false,
    "message": "Human-readable error description",
    "errors": {
        "field_name": ["Validation failure reason"]
    }
}
```

## Standard Status Codes
- `400 Bad Request`: Malformed syntax or invalid request structure.
- `401 Unauthorized`: Missing, invalid, or expired Bearer Token.
- `403 Forbidden`: Authenticated, but lacking role permissions (e.g., Student trying to create a course).
- `404 Not Found`: The requested resource (endpoint or database record) does not exist.
- `422 Unprocessable Entity`: Validation failed. Look at the `errors` object for details.
- `429 Too Many Requests`: Rate limiting engaged.
- `500 Internal Server Error`: An unexpected exception occurred on the backend.

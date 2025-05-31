
# API Documentation - Current & Future State

## Overview
This document provides comprehensive API documentation for the current Supabase implementation and the planned Azure/MongoDB migration.

## Current API Architecture (Supabase)

### Base URL
- **Development**: `https://gmnieeynahbakhgisxof.supabase.co`
- **Authentication**: Bearer token in Authorization header
- **Content-Type**: `application/json`

### Authentication Endpoints

#### User Registration
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "data": {
    "full_name": "John Doe",
    "company_name": "Acme Corp"
  }
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe",
      "company_name": "Acme Corp"
    }
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

#### User Login
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### User Logout
```http
POST /auth/v1/logout
Authorization: Bearer {access_token}
```

### Data Endpoints (REST API)

#### Reports Management

##### Get Reports
```http
GET /rest/v1/reports?select=*&order=created_at.desc
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `select`: Fields to return (`*` for all)
- `order`: Sorting (`created_at.desc`)
- `limit`: Number of records
- `offset`: Pagination offset

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "project": "Project Alpha",
    "week": "2024-01-15",
    "report": "Weekly progress report content...",
    "title": "Week 3 Progress",
    "description": "Completed features X, Y, Z",
    "category": "development",
    "priority": "medium",
    "status": "pending",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

##### Create Report
```http
POST /rest/v1/reports
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "project": "Project Alpha",
  "week": "2024-01-15",
  "report": "Weekly progress report content...",
  "title": "Week 3 Progress",
  "description": "Completed features X, Y, Z",
  "category": "development",
  "priority": "medium"
}
```

##### Update Report
```http
PATCH /rest/v1/reports?id=eq.{report_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "status": "approved",
  "priority": "high"
}
```

#### Analysis Results

##### Get Analysis Results
```http
GET /rest/v1/analysis_results?report_id=eq.{report_id}
Authorization: Bearer {access_token}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "report_id": "uuid",
    "score": 85,
    "status": "validated",
    "flags": 2,
    "summary": "Good quality report with minor improvements needed",
    "detailed_feedback": {
      "strengths": ["Clear communication", "Specific examples"],
      "improvements": ["More detail on blockers", "Include metrics"],
      "feedback": "Overall solid report..."
    },
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

#### User Management

##### Get User Profile
```http
GET /rest/v1/profiles?id=eq.{user_id}
Authorization: Bearer {access_token}
```

##### Get User Role
```http
GET /rest/v1/user_roles?user_id=eq.{user_id}
Authorization: Bearer {access_token}
```

### Edge Functions

#### Analyze Report
```http
POST /functions/v1/analyze-report
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "reportId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "analysisId": "uuid",
  "message": "Analysis completed successfully"
}
```

#### Create Account
```http
POST /functions/v1/create-account
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "email": "newuser@example.com",
  "full_name": "New User",
  "company_name": "Company Inc",
  "role": "contractor"
}
```

## Future API Architecture (Azure/MongoDB)

### Base URL Structure
- **Production**: `https://eye-of-jasper-api.azurewebsites.net`
- **Staging**: `https://eye-of-jasper-api-staging.azurewebsites.net`
- **Development**: `https://eye-of-jasper-api-dev.azurewebsites.net`

### Authentication (Azure AD B2C + JWT)

#### SSO Login
```http
GET /auth/login
```
Redirects to Azure AD B2C login page

#### Token Refresh
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "refresh_token"
}
```

#### User Profile
```http
GET /auth/profile
Authorization: Bearer {jwt_token}
```

### API Endpoints (Express.js + MongoDB)

#### Base Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:00:00Z",
  "requestId": "uuid"
}
```

#### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "timestamp": "2024-01-15T10:00:00Z",
  "requestId": "uuid"
}
```

### Reports API v2

#### List Reports
```http
GET /api/v1/reports
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `status`: Filter by status
- `category`: Filter by category
- `project`: Filter by project
- `search`: Search in title/content
- `sortBy`: Sort field (created_at, title, status)
- `sortOrder`: asc/desc

**Response:**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "_id": "ObjectId",
        "userId": "ObjectId",
        "name": "John Doe",
        "email": "john@example.com",
        "project": "Project Alpha",
        "week": "2024-01-15T00:00:00Z",
        "report": "Weekly progress content...",
        "title": "Week 3 Progress",
        "category": "development",
        "priority": "medium",
        "status": "pending",
        "metrics": {
          "hoursWorked": 40,
          "tasksCompleted": 5,
          "blockers": ["API rate limiting"],
          "achievements": ["Completed user auth"]
        },
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 95,
      "itemsPerPage": 20,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

#### Create Report
```http
POST /api/v1/reports
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "Week 3 Progress Report",
  "project": "Project Alpha",
  "week": "2024-01-15",
  "category": "development",
  "priority": "medium",
  "report": "Detailed progress content...",
  "metrics": {
    "hoursWorked": 40,
    "tasksCompleted": 5,
    "blockers": ["API rate limiting"],
    "achievements": ["Completed user authentication"]
  }
}
```

#### Get Report Details
```http
GET /api/v1/reports/{reportId}
Authorization: Bearer {jwt_token}
```

#### Update Report
```http
PUT /api/v1/reports/{reportId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "approved",
  "priority": "high"
}
```

#### Delete Report
```http
DELETE /api/v1/reports/{reportId}
Authorization: Bearer {jwt_token}
```

### Analysis API v2

#### Trigger Analysis
```http
POST /api/v1/reports/{reportId}/analyze
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "aiModel": "gemini-pro",
  "analysisType": "comprehensive"
}
```

#### Get Analysis Results
```http
GET /api/v1/reports/{reportId}/analysis
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "reportId": "ObjectId",
    "overallScore": 850,
    "qualityScore": 900,
    "completenessScore": 800,
    "clarityScore": 850,
    "status": "validated",
    "flags": [
      {
        "type": "length",
        "severity": "low",
        "message": "Report could be more detailed",
        "confidence": 0.75
      }
    ],
    "summary": "Well-structured report with clear progress indicators",
    "detailedFeedback": {
      "strengths": [
        "Clear milestone tracking",
        "Specific technical details",
        "Good problem identification"
      ],
      "improvements": [
        "Include more quantitative metrics",
        "Elaborate on solution approaches"
      ],
      "suggestions": [
        "Consider adding charts for visual progress",
        "Include links to relevant documentation"
      ],
      "tone": "professional",
      "sentiment": 0.7
    },
    "aiModel": {
      "provider": "gemini",
      "model": "gemini-pro",
      "version": "1.0",
      "processingTime": 2340
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### User Management API v2

#### Get User Profile
```http
GET /api/v1/users/profile
Authorization: Bearer {jwt_token}
```

#### Update User Profile
```http
PUT /api/v1/users/profile
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "fullName": "John Smith",
  "companyName": "New Company Inc",
  "profile": {
    "timezone": "America/Vancouver",
    "preferences": {
      "notifications": true,
      "emailUpdates": false,
      "dashboardView": "list"
    }
  }
}
```

#### Get Users (Admin Only)
```http
GET /api/v1/admin/users
Authorization: Bearer {jwt_token}
```

#### Create User Account (Admin Only)
```http
POST /api/v1/admin/users
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "email": "newuser@example.com",
  "fullName": "New User",
  "companyName": "Company Inc",
  "role": "contractor",
  "permissions": ["read_reports", "create_reports"]
}
```

### Analytics API v2

#### Dashboard Statistics
```http
GET /api/v1/analytics/dashboard
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalReports": 156,
    "reportsThisWeek": 12,
    "averageScore": 782,
    "completionRate": 94.5,
    "topCategories": [
      {"category": "development", "count": 89},
      {"category": "testing", "count": 34},
      {"category": "deployment", "count": 23}
    ],
    "trends": {
      "weeklySubmissions": [8, 12, 15, 12, 9],
      "averageScores": [750, 780, 790, 785, 782]
    }
  }
}
```

#### Export Reports
```http
GET /api/v1/analytics/export
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `format`: csv/xlsx/json
- `dateFrom`: Start date
- `dateTo`: End date
- `includeAnalysis`: true/false

### Real-time Updates (WebSocket)

#### Connection
```javascript
const ws = new WebSocket('wss://eye-of-jasper-api.azurewebsites.net/ws');
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'authenticate',
    token: 'jwt_token'
  }));
};
```

#### Subscribe to Updates
```javascript
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'reports',
  filters: {
    userId: 'current_user_id'
  }
}));
```

#### Event Types
- `report_created`
- `report_updated`
- `analysis_completed`
- `notification_created`

## Rate Limiting

### Current Limits
- **Authentication**: 10 requests/minute
- **API Endpoints**: 100 requests/minute
- **File Uploads**: 5 requests/minute
- **Analytics**: 20 requests/minute

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642780800
```

## Error Codes

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Rate Limited
- `500`: Internal Server Error

### Custom Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED_ACCESS`: Invalid or expired token
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `AI_ANALYSIS_FAILED`: AI processing error
- `DATABASE_ERROR`: Database operation failed

---

**Document Version**: 1.0  
**API Version**: v1  
**Last Updated**: [Current Date]  
**Authentication**: Azure AD B2C + JWT  
**Base Technology**: Express.js + MongoDB

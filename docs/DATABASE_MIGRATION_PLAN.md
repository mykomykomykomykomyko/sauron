
# Database Migration Plan: PostgreSQL to MongoDB

## Overview
This document outlines the comprehensive plan for migrating from Supabase PostgreSQL to Azure Cosmos DB (MongoDB API).

## Current State Analysis

### PostgreSQL Schema Summary
- **6 Tables**: profiles, user_roles, reports, analysis_results, notifications, accounts
- **Relationships**: Foreign key constraints and RLS policies
- **Data Volume**: Estimated production data volumes
- **Indexes**: Automatic indexing via Supabase

### Migration Challenges
1. **Relational to Document**: Converting normalized tables to document collections
2. **UUID to ObjectId**: Changing primary key strategy
3. **RLS to Application Logic**: Moving security from database to application layer
4. **Foreign Keys to Embedded/Referenced**: Restructuring relationships

## Target MongoDB Schema Design

### Users Collection (Consolidated)
```javascript
// Combines profiles + user_roles + partial accounts data
{
  _id: ObjectId(),
  azureAdId: String,      // For SSO integration
  email: String,          // Primary identifier
  fullName: String,
  companyName: String,
  role: String,           // 'admin' | 'contractor'
  isActive: Boolean,
  permissions: [String],   // Granular permissions array
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date,
  
  // Embedded profile data
  profile: {
    avatar: String,       // URL to profile image
    timezone: String,
    preferences: {
      notifications: Boolean,
      emailUpdates: Boolean,
      dashboardView: String
    }
  }
}
```

### Reports Collection
```javascript
{
  _id: ObjectId(),
  userId: ObjectId,       // Reference to Users collection
  
  // Basic report data
  name: String,
  email: String,          // Denormalized for faster queries
  project: String,
  week: Date,
  report: String,         // Main report content
  
  // Enhanced fields
  title: String,
  description: String,
  category: String,       // 'development' | 'testing' | 'deployment' etc.
  priority: String,       // 'low' | 'medium' | 'high' | 'critical'
  status: String,         // 'pending' | 'in_review' | 'approved' | 'rejected'
  
  // Metadata
  submissionMethod: String, // 'web' | 'api' | 'mobile'
  ipAddress: String,       // For audit purposes
  userAgent: String,       // For audit purposes
  
  // Embedded user data for faster queries
  submitter: {
    name: String,
    email: String,
    role: String
  },
  
  // Analytics data
  metrics: {
    hoursWorked: Number,
    tasksCompleted: Number,
    blockers: [String],
    achievements: [String]
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  submittedAt: Date
}
```

### AnalysisResults Collection
```javascript
{
  _id: ObjectId(),
  reportId: ObjectId,     // Reference to Reports collection
  
  // Analysis scores (0-1000 scale for precision)
  overallScore: Number,
  qualityScore: Number,
  completenessScore: Number,
  clarityScore: Number,
  
  // Status and flags
  status: String,         // 'validated' | 'review' | 'flagged' | 'pending'
  flags: [{
    type: String,         // 'quality' | 'completeness' | 'tone' | 'length'
    severity: String,     // 'low' | 'medium' | 'high'
    message: String,
    confidence: Number    // AI confidence level
  }],
  
  // AI Analysis results
  summary: String,
  detailedFeedback: {
    strengths: [String],
    improvements: [String],
    suggestions: [String],
    tone: String,         // 'positive' | 'neutral' | 'concerning'
    sentiment: Number     // -1 to 1 sentiment score
  },
  
  // AI Model information
  aiModel: {
    provider: String,     // 'gemini' | 'openai' | 'azure'
    model: String,        // Model version used
    version: String,      // Analysis version
    processingTime: Number // Milliseconds
  },
  
  // Validation data
  humanReview: {
    reviewerId: ObjectId,
    reviewerName: String,
    reviewDate: Date,
    overrideReason: String,
    finalScore: Number
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### Notifications Collection
```javascript
{
  _id: ObjectId(),
  userId: ObjectId,       // Reference to Users collection
  
  // Notification content
  title: String,
  message: String,
  type: String,           // 'info' | 'warning' | 'error' | 'success'
  category: String,       // 'report' | 'system' | 'reminder' | 'achievement'
  
  // Status and priority
  isRead: Boolean,
  priority: String,       // 'low' | 'medium' | 'high'
  
  // Scheduling
  dueDate: Date,
  scheduledFor: Date,     // For future notifications
  
  // Action data
  actionRequired: Boolean,
  actionUrl: String,      // Deep link to relevant page
  actionText: String,     // Button text
  
  // Metadata
  createdBy: ObjectId,    // User who created notification
  createdByName: String,  // Denormalized for performance
  source: String,         // 'system' | 'admin' | 'ai_analysis'
  
  // Delivery tracking
  deliveryAttempts: Number,
  deliveredAt: Date,
  readAt: Date,
  
  createdAt: Date,
  expiresAt: Date
}
```

### AuditLogs Collection (New)
```javascript
{
  _id: ObjectId(),
  userId: ObjectId,
  action: String,         // 'create' | 'read' | 'update' | 'delete'
  resource: String,       // 'report' | 'user' | 'analysis'
  resourceId: ObjectId,
  
  // Request details
  details: {
    changes: Object,      // What changed (for updates)
    oldValues: Object,    // Previous values
    newValues: Object,    // New values
    reason: String        // User-provided reason
  },
  
  // Context
  ipAddress: String,
  userAgent: String,
  sessionId: String,
  
  // Results
  success: Boolean,
  errorMessage: String,
  
  timestamp: Date
}
```

## Data Migration Scripts

### Migration Strategy
1. **Export Phase**: Extract data from PostgreSQL
2. **Transform Phase**: Convert to MongoDB document structure
3. **Validate Phase**: Ensure data integrity
4. **Import Phase**: Insert into MongoDB
5. **Verify Phase**: Cross-reference data accuracy

### PostgreSQL Export Scripts
```sql
-- Export Users (profiles + user_roles)
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.company_name,
  ur.role,
  p.created_at,
  p.updated_at
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id;

-- Export Reports
SELECT * FROM reports ORDER BY created_at;

-- Export Analysis Results
SELECT 
  ar.*,
  r.user_id as report_user_id
FROM analysis_results ar
JOIN reports r ON ar.report_id = r.id;

-- Export Notifications
SELECT * FROM notifications ORDER BY created_at;

-- Export Accounts
SELECT * FROM accounts ORDER BY created_at;
```

### MongoDB Import Scripts
```javascript
// User migration function
async function migrateUsers(postgresUsers) {
  const mongoUsers = postgresUsers.map(user => ({
    azureAdId: null, // Will be populated during SSO setup
    email: user.email,
    fullName: user.full_name,
    companyName: user.company_name,
    role: user.role || 'contractor',
    isActive: true,
    permissions: generatePermissions(user.role),
    lastLogin: null,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at || user.created_at),
    profile: {
      avatar: null,
      timezone: 'America/Edmonton', // Default for Alberta
      preferences: {
        notifications: true,
        emailUpdates: true,
        dashboardView: 'grid'
      }
    }
  }));
  
  return await db.collection('users').insertMany(mongoUsers);
}

// Report migration function
async function migrateReports(postgresReports, userMapping) {
  const mongoReports = postgresReports.map(report => ({
    userId: userMapping[report.user_id],
    name: report.name,
    email: report.email,
    project: report.project,
    week: new Date(report.week),
    report: report.report,
    title: report.title,
    description: report.description,
    category: report.category || 'general',
    priority: report.priority || 'medium',
    status: report.status || 'pending',
    submissionMethod: 'web',
    submitter: {
      name: report.name,
      email: report.email,
      role: 'contractor' // Default, will be updated
    },
    metrics: {
      hoursWorked: extractHours(report.report),
      tasksCompleted: extractTasks(report.report),
      blockers: extractBlockers(report.report),
      achievements: extractAchievements(report.report)
    },
    createdAt: new Date(report.created_at),
    updatedAt: new Date(report.created_at),
    submittedAt: new Date(report.created_at)
  }));
  
  return await db.collection('reports').insertMany(mongoReports);
}
```

## Index Strategy

### MongoDB Indexes
```javascript
// Users Collection Indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "azureAdId": 1 }, { sparse: true, unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "isActive": 1 });
db.users.createIndex({ "createdAt": -1 });

// Reports Collection Indexes
db.reports.createIndex({ "userId": 1 });
db.reports.createIndex({ "status": 1 });
db.reports.createIndex({ "category": 1 });
db.reports.createIndex({ "week": -1 });
db.reports.createIndex({ "createdAt": -1 });
db.reports.createIndex({ "project": 1, "week": -1 });
db.reports.createIndex({ "email": 1, "createdAt": -1 });

// Analysis Results Indexes
db.analysisResults.createIndex({ "reportId": 1 });
db.analysisResults.createIndex({ "status": 1 });
db.analysisResults.createIndex({ "overallScore": -1 });
db.analysisResults.createIndex({ "createdAt": -1 });

// Notifications Indexes
db.notifications.createIndex({ "userId": 1, "isRead": 1 });
db.notifications.createIndex({ "dueDate": 1 });
db.notifications.createIndex({ "createdAt": -1 });
db.notifications.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

// Audit Logs Indexes
db.auditLogs.createIndex({ "userId": 1 });
db.auditLogs.createIndex({ "action": 1 });
db.auditLogs.createIndex({ "resource": 1 });
db.auditLogs.createIndex({ "timestamp": -1 });
```

## Data Validation Rules

### MongoDB Schema Validation
```javascript
// Users collection validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "fullName", "role", "isActive", "createdAt"],
      properties: {
        email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" },
        fullName: { bsonType: "string", minLength: 1 },
        role: { enum: ["admin", "contractor"] },
        isActive: { bsonType: "bool" }
      }
    }
  }
});
```

## Migration Timeline

### Week 1: Preparation
- Set up Azure Cosmos DB instance
- Create migration scripts
- Set up data validation procedures

### Week 2: Data Export & Transform
- Export all data from PostgreSQL
- Transform data to MongoDB format
- Validate transformed data

### Week 3: Import & Verification
- Import data into MongoDB
- Run data integrity checks
- Performance testing on new schema

### Week 4: Rollback Planning
- Create rollback procedures
- Document migration results
- Prepare for application layer updates

## Risk Mitigation

### Data Integrity Measures
1. **Checksums**: Verify data integrity during transfer
2. **Row Counts**: Ensure no data loss
3. **Relationship Validation**: Verify foreign key equivalents
4. **Business Logic Validation**: Ensure business rules are maintained

### Rollback Strategy
1. **Snapshot Creation**: Before starting migration
2. **Parallel Running**: Keep PostgreSQL running during testing
3. **Quick Switch**: Ability to revert to PostgreSQL rapidly
4. **Data Sync**: Procedures to sync any new data created during migration

---

**Document Version**: 1.0  
**Estimated Effort**: 4 weeks  
**Risk Level**: Medium  
**Dependencies**: Azure infrastructure setup

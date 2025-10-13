# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the NIFCA (Nairobi International Finance Center) backend API server built with Node.js and Express. The system manages two distinct user types (internal users and external clients) with separate authentication mechanisms, content management, and an application submission/review workflow.

## Development Commands

### Start the server
```bash
npm start
```
Runs the server using `node server.js` on port 3000 (or PORT from .env)

### Database setup
SQL schema files are located in `src/sql/`:
- `db_table_creation.sql` - Main database schema
- `company_trigger.sql` - Database triggers
- `query.sql` - Additional queries

Run these manually against your MySQL database to set up the schema.

### Testing
```bash
npm test
```
Note: Tests are not yet implemented (exits with error)

### Development utilities
- `src/tests/test_db.js` - Database connection testing
- `src/tests/hashPassword.js` - Password hashing utility

## Architecture Overview

### Dual Authentication System

This system has **two separate authentication architectures** that must not be confused:

1. **Internal Users (Admin/Staff)**: JWT-based authentication
   - Routes: `/api/auth/*`, `/api/users/*`
   - Middleware: `authMiddleware.js` (JWT validation)
   - Model: `userModel.js`
   - Roles: admin, super_user, news, press_release, media, events
   - Stored in `users` table with `user_tokens` table for token management
   - Admin-only operations protected by `adminMiddleware.js` (role_id === 1)

2. **External Clients**: Session-based authentication
   - Routes: `/api/client/*`
   - Middleware: `clientAuthMiddleware.js` (session validation)
   - Model: `clientModel.js`
   - Stored in `clients` table
   - Sessions managed via MySQL session store (express-mysql-session)
   - Session middleware only applies to paths starting with `/api/client`

### Key Architectural Patterns

**MVC Structure**:
- **Models** (`src/models/`): Database queries and business logic
  - `userModel.js` - Internal users (JWT)
  - `clientModel.js` - External clients (sessions)
  - `applicationModel.js` - Application submissions
  - `contentModel.js` - CMS content (news, press releases, events, gallery)

- **Controllers** (`src/controllers/`): Request handling and validation
  - `authController.js` - Internal user auth
  - `clientController.js` - Client auth and management
  - `applicationController.js` - Admin reviews applications
  - `clientApplicationController.js` - Clients submit/manage applications
  - `contentController.js` - CMS operations
  - `userController.js` - User management

- **Routes** (`src/routes/`): API endpoint definitions with validation
  - Uses `express-validator` for input validation
  - Separate route files for each major feature

**Middleware Chain**:
- CORS configured for frontend origin (default: http://localhost:5173)
- Session middleware conditionally applied only to `/api/client` routes
- `authMiddleware` validates JWT for internal users
- `clientAuthMiddleware` validates sessions for clients
- `adminMiddleware` restricts to role_id = 1 (admin)

**Audit Logging**:
- User actions logged in `user_audit_log` table
- Application actions logged in `application_audit_log` table
- Always log: action type, performed_by, old_data, new_data

### Database Connection

- MySQL2 with connection pooling (`src/config/db.js`)
- Promisified for async/await support
- Config from environment variables:
  - DB_HOST, DB_USER, DB_PASS (note: not DB_PASSWORD), DB_NAME

### Email System

- Nodemailer configured in `src/config/mailer.js`
- Two email templates:
  - `sendVerificationEmail(email, token, userType, password)` - Email verification
  - `sendPasswordResetEmail(email, token)` - Password reset
- Includes NIFCA branding with logo attachment from `src/assets/nifca.png`
- Config: EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASS

### Static Assets

- News images stored in `src/assets/news/`
- Event images stored in `src/assets/events/`
- Gallery media stored in `src/assets/gallery/`
- Served via `/assets` route configured in `src/app.js`
- NIFCA logo at `src/assets/nifca.png` used in emails

### Social Media Integration (Optional)

- **Optional feature** - disabled by default with zero performance impact
- Supports automatic posting to Twitter/X and LinkedIn
- Service: `src/services/socialMediaService.js`
- Non-blocking async posting - doesn't slow down content creation
- Optional parameters on content creation: `post_to_twitter`, `post_to_linkedin`
- See `SOCIAL_MEDIA_SETUP.md` for detailed setup instructions
- Environment variables (only needed if enabled):
  - `TWITTER_ENABLED`, `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_SECRET`
  - `LINKEDIN_ENABLED`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_ACCESS_TOKEN`

## Important Implementation Details

### User Account Lifecycle (Internal Users)

1. **Registration** (`POST /api/auth/register`):
   - Requires JWT (must be authenticated to create users)
   - Creates user with status='inactive', enabled=0
   - Generates verification_token
   - Sends verification email with temporary password
   - Logs to user_audit_log

2. **Email Verification** (`GET /api/auth/verify?token=...`):
   - Sets verified_at, clears verification_token
   - Changes status to 'active'

3. **First Login**:
   - User enabled=0 until they change password
   - JWT issued but operations may be restricted

4. **Password Change** (`POST /api/auth/change-password`):
   - Sets enabled=1 on first password change
   - Requires oldPassword and newPassword

### Client Account Lifecycle

1. **Registration** (`POST /api/client/auth/register`):
   - Creates client with status='inactive', enabled=0
   - Generates verification_token
   - Sends verification email

2. **Email Verification** (`GET /api/client/auth/verify?token=...`):
   - Sets verified_at, clears verification_token
   - Does NOT automatically enable account

3. **Account Activation** (`POST /api/client/auth/activate`):
   - Separate step where client sets their password
   - Sets enabled=TRUE, status='active'

4. **Login** (`POST /api/client/auth/login`):
   - Creates session stored in MySQL
   - Session data: userId, username, email

5. **Password Reset Flow**:
   - Request: `POST /api/client/auth/request-password-reset`
   - Reset: `POST /api/client/auth/reset-password` with token

### Application Workflow

**Client submits application**:
- `POST /api/client/applications` - Submit new application
- `GET /api/client/applications` - View own applications
- `POST /api/client/applications/:id/cancel` - Cancel pending application

**Admin reviews application**:
- `GET /api/applications` - View all applications
- `GET /api/applications/:id` - View specific application
- `POST /api/applications/:id/review` - Review (approve/reject with comments)

Application statuses: 'pending', 'approved', 'rejected', 'cancelled'

### Content Management

Content types with full CRUD operations:
- **News**: title, content, picture, created_by
  - Paginated listing with limit/offset
- **Press Releases**: title, content, created_by
- **Events**: title, description, event_date, location, created_by
- **Gallery Media**: type, url, caption, created_by

All content routes under `/api/content/*` and protected by `authMiddleware`.

## Environment Variables

Required in `.env` file:
```
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=nifca

# Authentication
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=noreply@example.com
EMAIL_PASS=email-password

# Social Media (Optional - disabled by default)
TWITTER_ENABLED=false
LINKEDIN_ENABLED=false
# Only add these if enabling Twitter:
# TWITTER_API_KEY=your_key
# TWITTER_API_SECRET=your_secret
# TWITTER_ACCESS_TOKEN=your_token
# TWITTER_ACCESS_SECRET=your_token_secret
# Only add these if enabling LinkedIn:
# LINKEDIN_CLIENT_ID=your_client_id
# LINKEDIN_CLIENT_SECRET=your_client_secret
# LINKEDIN_ACCESS_TOKEN=your_access_token
```

## Common Development Patterns

### Creating New Protected Routes

For internal users:
```javascript
router.post('/endpoint', authMiddleware, validationArray, controller.method);
```

For admin-only:
```javascript
router.post('/endpoint', authMiddleware, adminMiddleware, validationArray, controller.method);
```

For clients:
```javascript
router.post('/endpoint', clientAuthMiddleware, validationArray, controller.method);
```

### Adding Audit Logs

Always log significant actions (create, update, delete, status changes):
```javascript
await db.query(
  "INSERT INTO user_audit_log (user_id, action, performed_by, old_data, new_data) VALUES (?, ?, ?, ?, ?)",
  [userId, 'action_name', performedBy, JSON.stringify(oldData), JSON.stringify(newData)]
);
```

### Token Management (Internal Users)

- Store tokens in `user_tokens` table with expiration
- Validate tokens exist and haven't expired in `authMiddleware`
- Clear tokens on logout or account deletion
- Check token validity: `userModel.isTokenValid(userId, token)`

## Git Information

Current branch: `cms_features`
Main branch: Not specified (check with team)

Recent work focuses on:
- Adding news section pictures
- SQL schema updates
- Temporary password in user emails
- Application functionality

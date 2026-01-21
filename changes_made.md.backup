# Changes Made to KifiApp

## Session Date: January 2, 2026

### 1. Port Configuration Change
**File**: `docker-compose.yml`
- **Change**: Modified frontend port mapping from `80:80` to `8080:80`
- **Reason**: Port 80 requires elevated privileges and was causing "Site can't be reached" errors
- **Impact**: Frontend now accessible at `http://localhost:8080` instead of `http://localhost`

### 2. Branding Update (TaniTrack → KifiApp)
**Status**: Frontend branding already correct in source code
- **Files Checked**: 
  - `frontend/src/components/layout/Sidebar.tsx` - Shows "KifiApp"
  - `frontend/src/pages/Login.tsx` - Shows "KifiApp"
  - `frontend/src/utils/pdfGenerator.ts` - Uses "KifiApp" in reports
- **Action Taken**: Forced rebuild of frontend Docker container to update stale cached image
- **Commands**:
  ```bash
  docker-compose build --no-cache frontend
  docker-compose up -d --force-recreate frontend
  ```

### 3. Data Migration (Host → Docker)
**Problem**: User data existed on host machine database but not in Docker database

**Files/Databases Affected**:
- Host Database: `tanitrack_db` on `localhost:5432`
- Docker Database: `tanitrack` in `tanitrack-db` container

**Actions Taken**:
1. Created backup of host database:
   ```bash
   pg_dump -h localhost -U aminua -d tanitrack_db -F c -b -v -f host_backup.dump
   ```

2. Wiped Docker database schema to prevent conflicts:
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   ```

3. Restored host data into Docker database:
   ```bash
   pg_restore -U tanitrack_user -d tanitrack < host_backup.dump
   ```

**Result**: Successfully migrated 4 users and all associated data from host to Docker

### 4. JWT Secret Synchronization
**File**: `docker-compose.yml`
- **Change**: Updated `JWT_SECRET` from `your-super-secret-jwt-key-change-this-in-production` to `supersecretkey_change_me_in_production`
- **Reason**: Match the JWT secret used in `backend/.env` for consistency

### 5. Admin Password Reset
**Database**: `tanitrack` database in Docker
- **Action**: Reset password for `admin` user to `password123`
- **SQL Command**:
  ```sql
  UPDATE users SET password_hash = '$2b$10$OT3GH7ogmRvNbLpRgVwUTOjAe9X5hD.CVgZjTtgZ.DBkUs2C2eCNG' WHERE username = 'admin';
  ```

### 6. Nginx API Proxy Configuration
**File**: `frontend/nginx.conf`
- **Change**: Added new `location /api/` block to proxy API requests to backend
- **Configuration Added**:
  ```nginx
  location /api/ {
      proxy_pass http://backend:3000/api/;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_cache_bypass $http_upgrade;
  }
  ```
- **Reason**: Frontend was unable to communicate with backend API because Nginx wasn't forwarding `/api/*` requests
- **Action**: Rebuilt frontend container to apply changes

## Current System State

### Accessible URLs
- **Frontend**: `http://localhost:8080`
- **Backend API**: `http://localhost:3000`
- **Database**: `localhost:5433` (mapped from container port 5432)

### Login Credentials
- **Username**: `admin`
- **Password**: `password123`

### Database Users (4 total)
1. `admin` - System Administrator (role: owner)
2. `amina` - Amina Aliyu Aminu (role: junior_assistant)
3. `aminaaliyu` - Amina Aliyu Aminu (role: junior_assistant)
4. `unique_tester_123` - (role: junior_assistant)

## Files Modified Summary
1. `docker-compose.yml` - Port mapping, JWT secret
2. `frontend/nginx.conf` - API proxy configuration
3. Database: `tanitrack` - Data migration, password reset

## Known Issues
- **Note**: Files `docker-compose.yml` and `frontend/nginx.conf` were deleted by user after changes were made
- These files need to be restored with the changes documented above

## Backup Files Created
- `host_backup.dump` - Full backup of host database (located in project root)

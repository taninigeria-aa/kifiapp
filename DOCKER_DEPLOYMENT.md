# TaniTrack - Docker Compose Deployment Guide

## Quick Start

### Prerequisites
- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)

### Deploy in 3 Commands

```bash
# 1. Navigate to project directory
cd "/home/aminua/Documents/Tani Nigeria Ltd/Antigravity/KifiApp"

# 2. Build and start all services
docker-compose up -d --build

# 3. Check status
docker-compose ps
```

**That's it!** 🎉

Access the application at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

---

## Detailed Commands

### Start Services

```bash
# Build and start in background
docker-compose up -d --build

# Start without rebuilding
docker-compose up -d

# Start and view logs
docker-compose up
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data!)
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Check Status

```bash
# List running containers
docker-compose ps

# Check resource usage
docker stats
```

---

## Database Management

### Access PostgreSQL

```bash
# Connect to database
docker-compose exec postgres psql -U tanitrack_user -d tanitrack

# Inside psql:
\dt              # List tables
\d users         # Describe users table
SELECT * FROM users;
\q               # Quit
```

### Backup Database

```bash
# Create backup
docker-compose exec postgres pg_dump -U tanitrack_user tanitrack > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U tanitrack_user -d tanitrack < backup.sql
```

### Reset Database

```bash
# Stop services
docker-compose down

# Remove volumes
docker volume rm kifiapp_postgres_data

# Start fresh
docker-compose up -d --build
```

---

## Development Workflow

### Make Code Changes

1. **Edit code** in your editor
2. **Rebuild affected service**:
   ```bash
   # Backend changes
   docker-compose up -d --build backend
   
   # Frontend changes
   docker-compose up -d --build frontend
   ```

### Hot Reload (Development Mode)

For development with hot reload, use docker-compose.dev.yml:

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev
    
  frontend:
    build:
      context: ./frontend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev
```

Run with:
```bash
docker-compose -f docker-compose.dev.yml up
```

---

## Troubleshooting

### Port Already in Use

**Error**: `Bind for 0.0.0.0:80 failed: port is already allocated`

**Solution**:
```bash
# Find process using port
sudo lsof -i :80

# Kill process or change port in docker-compose.yml
ports:
  - "3001:80"  # Use port 3001 instead
```

### Database Connection Failed

**Solution**:
```bash
# Check if postgres is healthy
docker-compose ps

# View postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Build Fails

**Solution**:
```bash
# Clean build
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Container Keeps Restarting

**Solution**:
```bash
# Check logs for errors
docker-compose logs backend

# Common issues:
# - Database not ready (wait a bit)
# - Missing dependencies (rebuild)
# - Port conflicts (change ports)
```

---

## Environment Variables

### Customize Settings

Edit `docker-compose.yml` to change:

```yaml
environment:
  # Database
  POSTGRES_DB: your_db_name
  POSTGRES_USER: your_user
  POSTGRES_PASSWORD: your_password
  
  # Backend
  JWT_SECRET: your-secret-key
  ALLOWED_ORIGINS: http://localhost,http://yourdomain.com
  
  # Frontend
  VITE_API_URL: http://localhost:3000
```

### Use .env File

Create `.env` in project root:

```bash
# Database
POSTGRES_DB=tanitrack
POSTGRES_USER=tanitrack_user
POSTGRES_PASSWORD=secure_password

# Backend
JWT_SECRET=your-super-secret-key
NODE_ENV=production

# Frontend
VITE_API_URL=http://localhost:3000
```

Update docker-compose.yml:
```yaml
environment:
  POSTGRES_DB: ${POSTGRES_DB}
  POSTGRES_USER: ${POSTGRES_USER}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

---

## Production Deployment

### Security Checklist

- [ ] Change default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS (add nginx-proxy)
- [ ] Limit exposed ports
- [ ] Set up firewall rules
- [ ] Regular backups
- [ ] Monitor logs

### Add HTTPS

Use nginx-proxy and Let's Encrypt:

```yaml
services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - certs:/etc/nginx/certs
      
  letsencrypt:
    image: nginxproxy/acme-companion
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - certs:/etc/nginx/certs
```

---

## Monitoring

### Resource Usage

```bash
# Real-time stats
docker stats

# Disk usage
docker system df
```

### Health Checks

```bash
# Backend health
curl http://localhost:3000/health

# Frontend
curl http://localhost

# Database
docker-compose exec postgres pg_isready
```

---

## Cleanup

### Remove Stopped Containers

```bash
docker-compose down
```

### Remove Images

```bash
# Remove project images
docker-compose down --rmi all

# Remove all unused images
docker image prune -a
```

### Free Up Space

```bash
# Remove everything unused
docker system prune -a --volumes

# Warning: This removes ALL unused Docker data!
```

---

## Tips & Best Practices

1. **Always use `-d` flag** for background execution
2. **Check logs regularly** with `docker-compose logs`
3. **Backup database** before major changes
4. **Use `.dockerignore`** to reduce build time
5. **Tag images** for version control
6. **Monitor resources** with `docker stats`
7. **Clean up regularly** with `docker system prune`

---

## Common Tasks

### Add New User

```bash
# Access database
docker-compose exec postgres psql -U tanitrack_user -d tanitrack

# Insert user (password: admin123)
INSERT INTO users (username, password_hash, full_name, role) 
VALUES ('admin', '$2b$10$...', 'Admin User', 'admin');
```

### View Application Logs

```bash
# Last 100 lines
docker-compose logs --tail=100

# Follow logs
docker-compose logs -f backend

# Specific time range
docker-compose logs --since 30m
```

### Update Single Service

```bash
# Pull latest code
git pull

# Rebuild and restart backend only
docker-compose up -d --build backend
```

---

## Success Criteria

Deployment successful when:

- ✅ All 3 containers running: `docker-compose ps`
- ✅ Frontend accessible at http://localhost
- ✅ Backend responds at http://localhost:3000/health
- ✅ Can login to application
- ✅ Database has all tables
- ✅ No errors in logs

---

## Next Steps

1. Test all features
2. Create test data
3. Invite users for testing
4. Monitor performance
5. Set up backups
6. Plan production deployment

**Enjoy your Dockerized TaniTrack!** 🐳

# Manual Testing Guide - KifiApp

## Application Status

### ✅ Frontend
- **Status**: Running successfully
- **URL**: http://localhost:5173
- **Screenshot**: Login page displays correctly with modern UI

![Login Page](file:///home/aminua/.gemini/antigravity/brain/fd25fa83-2411-49d5-b7ec-16a517ba5be7/login_page_1768979980190.png)

### ⚠️ Backend
- **Status**: Waiting for database configuration
- **Port**: 3000
- **Issue**: Database credentials need to be configured in `.env` file

---

## Required Setup

### Database Configuration

The backend `.env` file has been created but needs your actual database credentials:

**File**: `/home/aminua/Documents/Tani Nigeria Ltd/Antigravity/KifiApp/backend/.env`

**Update these values**:
```bash
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/tanitrack_db
```

Replace:
- `YOUR_USERNAME` with your PostgreSQL username
- `YOUR_PASSWORD` with your PostgreSQL password
- `tanitrack_db` with your database name (if different)

After updating, the backend will restart automatically (nodemon is watching).

---

## Manual Testing Checklist

Once the backend is connected, perform these tests:

### 1. Authentication ✓
- [ ] Navigate to http://localhost:5173
- [ ] Verify login page displays correctly ✅ (Already verified)
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials (should show error)
- [ ] Test "Remember me" checkbox
- [ ] Test logout functionality
- [ ] Verify token persistence (refresh page while logged in)

### 2. Dashboard
- [ ] Verify dashboard loads after login
- [ ] Check all statistics display correctly
- [ ] Verify charts render properly
- [ ] Test date range filters

### 3. Production Module
#### Spawns
- [ ] View spawns list
- [ ] Create new spawn
- [ ] Edit existing spawn
- [ ] Delete spawn
- [ ] Verify form validation

#### Batches
- [ ] View batches list
- [ ] Create new batch
- [ ] Edit existing batch
- [ ] View batch details
- [ ] Delete batch
- [ ] Verify batch-spawn relationship

### 4. Tanks Module
- [ ] View tanks list
- [ ] Create new tank
- [ ] Edit tank details
- [ ] View tank details
- [ ] Verify tank capacity validation

### 5. Feed Management
- [ ] View feed inventory
- [ ] Record new feed purchase
- [ ] Edit feed item
- [ ] View feed log
- [ ] Verify calculations (cost per kg, total value)

### 6. Financial Module
- [ ] View expenses list
- [ ] Add new expense
- [ ] Edit expense
- [ ] Delete expense
- [ ] View financial dashboard
- [ ] Verify charts (expense distribution, trends)
- [ ] Test expense categories

### 7. People Module
#### Suppliers
- [ ] View suppliers list
- [ ] Add new supplier
- [ ] Edit supplier
- [ ] Delete supplier

#### Workers
- [ ] View workers list
- [ ] Add new worker
- [ ] Edit worker
- [ ] Delete worker

### 8. Sales Module
- [ ] View sales list
- [ ] Record new sale
- [ ] View customers list
- [ ] Add new customer

### 9. Offline Functionality
- [ ] Disconnect from network
- [ ] Create/edit records offline
- [ ] Verify offline indicator appears
- [ ] Reconnect to network
- [ ] Verify data syncs automatically
- [ ] Check sync status indicator

### 10. Reports & Export
- [ ] Generate PDF reports
- [ ] Verify PDF content
- [ ] Test different report types

### 11. Navigation & UX
- [ ] Test all sidebar menu items
- [ ] Verify browser back/forward buttons work
- [ ] Test 404 page (navigate to invalid route)
- [ ] Verify responsive design on different screen sizes
- [ ] Test form validation messages
- [ ] Verify loading states

### 12. PWA Features
- [ ] Install app as PWA (if supported)
- [ ] Test offline capabilities
- [ ] Verify service worker registration

---

## Known Issues & Warnings

### ESLint Warnings (Acceptable)
The following 4 warnings are expected and acceptable:
1. React Hook Form `watch()` incompatible library warning
2-4. Missing dependency warnings in tank pages (intentional design)

### Build Warning
- Large chunk size warning (>500 kB) - can be optimized later with code splitting

### Security Vulnerabilities
- 5 frontend vulnerabilities (3 high, 2 critical)
- 5 backend vulnerabilities (1 low, 4 high)
- Run `npm audit fix` to address non-breaking issues

---

## Testing Tips

1. **Open Browser DevTools**: Monitor console for errors
2. **Check Network Tab**: Verify API calls are successful
3. **Test Error Scenarios**: Try invalid inputs, empty forms, etc.
4. **Test Edge Cases**: Large numbers, special characters, long text
5. **Cross-Browser Testing**: Test in Chrome, Firefox, Safari
6. **Mobile Testing**: Use DevTools device emulation

---

## Reporting Issues

If you find any issues during testing, note:
- What you were trying to do
- What happened (actual behavior)
- What you expected to happen
- Steps to reproduce
- Browser and OS information
- Screenshots if applicable

---

## Next Steps After Testing

1. Address any bugs found
2. Run `npm audit fix` for security updates
3. Consider major version upgrades (Express 5, React Router 7)
4. Add unit tests
5. Set up CI/CD pipeline
6. Deploy to staging environment

# ============================================================================
# TaniTrack: Hatchery Management System
# PRODUCT REQUIREMENTS DOCUMENT (PRD) v1.0
# Created: December 2024
# Company: Tani Nigeria Ltd
# ============================================================================

---

## 1. PROJECT OVERVIEW

### **Product Name:** TaniTrack

### **Version:** 1.0 (MVP - Minimum Viable Product)

### **Company:** Tani Nigeria Ltd

### **Product Type:** Progressive Web App (PWA)

### **Target Users:** 
Internal use for Tani's catfish hatchery operations in Abuja, Nigeria. Designed for farm staff with varying levels of technical expertise.

### **Production Capacity:** 
345,000 fingerlings per year across 24 tanks (6 IBC totes + 3 tarpaulin tanks + 15 top-loading tanks)

### **Platform:** 
- Progressive Web App (mobile-first design)
- Works on any device with a web browser
- No app store required
- Offline-capable for farm locations with poor connectivity

### **Timeline:** 
- Development: 6-8 weeks
- Testing & Training: 2 weeks
- Total to Launch: 8-10 weeks

### **Budget Consideration:** 
- Open source technology stack
- Self-hosted initially on local server or VPS
- No licensing costs
- Minimal infrastructure requirements

---

## 2. BUSINESS OBJECTIVES

### **Primary Goal**
Digitize and optimize hatchery operations to improve survival rates, profitability tracking, decision-making, and operational efficiency.

### **Specific Objectives**

**1. Improve Survival Rates**
- Current: Variable (15-25% to market size)
- Target: 30%+ to market size
- Method: Data-driven insights on feeding, stocking density, water quality

**2. Enable Profitability Tracking**
- Track costs per batch (feed, labor, utilities)
- Calculate profit margins per batch
- Identify best-performing batches and replicate success factors
- ROI analysis on each spawning cycle

**3. Data-Driven Decision Making**
- Historical data on spawn success rates
- Growth rate tracking by batch
- Best breeding pairs identification
- Optimal feed conversion ratios (FCR)
- Sales patterns and customer preferences

**4. Operational Efficiency**
- Reduce manual paperwork by 80%
- Eliminate duplicate data entry
- Real-time visibility into all operations
- Faster reporting and analysis
- Automated calculations (FCR, survival rates, profit margins)

### **Success Metrics**

**Adoption Metrics (First 2 Months):**
- 100% of spawns recorded digitally
- 90% reduction in missing/incomplete records
- Staff adoption rate >85%
- Zero data loss incidents

**Business Impact Metrics (First 6 Months):**
- 5%+ improvement in survival rates
- 10%+ reduction in feed waste (improved FCR)
- Ability to calculate per-batch profitability in real-time
- 50% reduction in time spent on manual reporting

**Technical Metrics:**
- 99%+ uptime
- <3 second page load times
- Works offline for critical functions
- Mobile-responsive on all devices

---

## 3. USER ROLES & PERMISSIONS

### **Role 1: Owner/Manager**
**User:** You (farm owner)
**Access Level:** Full administrative access

**Capabilities:**
- Full access to all modules
- View all financial data (revenue, costs, profits)
- Generate all reports and analytics
- Configure system settings
- Manage user accounts and permissions
- Export data (Excel, PDF)
- Edit and delete any records
- Set targets and thresholds

### **Role 2: Senior Assistant**
**Access Level:** Operational management

**Capabilities:**
- Create and edit spawning records
- Update daily production logs
- Record sales transactions
- Manage customer information
- Log feeding activities
- Record health observations
- View (but not edit) financial summaries
- Generate operational reports
- Cannot: Delete financial records, manage users, see detailed costs

### **Role 3: Junior Assistant**
**Access Level:** Limited operational access

**Capabilities:**
- View tank assignments
- Log daily feeding activities (assigned tanks only)
- Report health observations
- View batch information (read-only)
- Cannot: Edit any records, view financial data, access reports

### **Role 4: Guest/Investor (Optional)**
**Access Level:** Read-only dashboard

**Capabilities:**
- View dashboard statistics
- See production metrics (fish count, batches)
- View growth trends
- Cannot: See customer data, detailed financials, edit anything

---

## 4. CORE FEATURES & MODULES

### **Module 1: User Management & Authentication**

**Features:**
- Secure login (phone number + password)
- JWT-based authentication
- Role-based access control (RBAC)
- Password reset functionality
- User profile management
- Activity logging (audit trail)

**Technical Requirements:**
- Phone number as username (Nigerian format: 080XXXXXXXX)
- Password hashing (bcrypt)
- Session management (24-hour token expiry)
- "Remember me" option (7-day token)

---

### **Module 2: Dashboard (Home Screen)**

**Overview Stats:**
- Total fish count (all active batches)
- Active batches count
- Sales this week (₦ amount)
- Spawns this week (count)
- Pending tasks count

**Today's Tasks:**
- Spawns due for stripping
- Scheduled transfers
- Low feed stock alerts
- Pending deliveries
- Health issues requiring attention

**Quick Actions:**
- New Spawn (button)
- Record Sale (button)
- Log Feeding (button)
- Transfer Fish (button)

**Active Tanks Widget:**
- List of 2-3 most utilized tanks
- Stocking density visualization
- Quick navigation to tank details

**Recent Activity Feed:**
- Last 5 activities across all modules
- Timestamped with user attribution

---

### **Module 3: Spawning Management**

**3.1 Spawn Records**
Create and track spawning cycles from hormone injection to fry swim-up stage.

**Data Captured:**
- Spawn date and time
- Broodstock used (2 females, 2 males)
- Hormone type and dosage
- Injection time
- Expected stripping time (auto-calculated +10 hours)
- Actual stripping time
- Egg count (estimated and actual)
- Fertilization rate (%)
- Hatching time and rate (%)
- Swim-up stage reached date
- Total fry count
- Mortality at each stage
- Batch created from spawn (link)
- Notes and observations
- Photos (optional)

**Key Calculations:**
- Estimated eggs = Female weight × 50,000 eggs/kg
- Fertilization rate = (Fertilized eggs / Total eggs) × 100
- Hatch rate = (Hatched fry / Fertilized eggs) × 100
- Survival to swim-up = (Swim-up fry / Hatched fry) × 100

**Workflow:**
1. Create spawn record (injection time)
2. Update at stripping (10 hours later)
3. Update at fertilization check (12 hours after stripping)
4. Update at hatching (24-36 hours after fertilization)
5. Update at swim-up (3-5 days after hatching)
6. Create batch from spawn

**List Views:**
- All spawns
- Active spawns (not yet completed)
- By date range
- By broodstock
- By success rate

**Search & Filters:**
- Spawn code
- Date range
- Broodstock ID
- Status (active, hatched, completed, failed)

---

### **Module 4: Broodstock Management**

**Broodstock Records:**
- Unique ID (e.g., BF-001, BM-001)
- Sex (Female/Male)
- Source (farm bred, purchased, wild)
- Date acquired
- Initial weight
- Current weight
- Age (months)
- Current tank/location
- Spawning history (number of uses)
- Last spawn date
- Next eligible spawn date (45-day rest period)
- Average success rate (%)
- Health status
- Notes
- Photos

**Features:**
- Track rest periods (prevent overuse)
- Calculate productivity (eggs/spawns over lifetime)
- Identify best performers
- Retirement tracking (after X spawns or age)

**Breeding Pair Analysis:**
- Track which male-female combinations produce best results
- Hatch rate by pair
- Fry survival by pair
- Genetic diversity recommendations

---

### **Module 5: Tank Management**

**Tank Inventory:**
- Tank code/ID (e.g., IBC-1, TOP-5, TAR-2)
- Tank type (IBC tote, Tarpaulin, Top-loading)
- Capacity (liters)
- Location (section of farm)
- Status (Active, Empty, Maintenance, Retired)
- Current batch stocked (if any)
- Stocking density (%)
- Days in current use
- Last cleaned date
- Maintenance history
- Water parameters (temp, pH, DO, ammonia)

**Tank Types:**
- IBC Tote Sections (600L each, 6 units)
- Tarpaulin Ponds (1,500L each, 3 units)
- Top-Loading Tanks (800L each, 15 units)

**Capacity Management:**
- Visual indicator of stocking density
- Alerts when >80% capacity
- Optimal stocking guidelines by fish size
- Automatic capacity calculations

**Maintenance Tracking:**
- Cleaning schedule
- Last maintenance date
- Next scheduled maintenance
- Repairs needed
- Equipment checks (aerators, filters)

**Water Quality Logs:**
- Temperature readings
- pH levels
- Dissolved oxygen (DO)
- Ammonia levels
- TDS (Total Dissolved Solids)
- Timestamp and user

---

### **Module 6: Production Tracking (Batches)**

**Batch Records:**
A batch is created when fry from a spawn are transferred to grow-out tanks.

**Core Data:**
- Batch code (e.g., BATCH-2024-046)
- Source spawn (linked)
- Creation date
- Initial count
- Current count
- Current average weight (grams)
- Current tank
- Growth stage (Fry, Fingerling, Juvenile, Market-size)
- Days in production
- Feed type currently used
- Feeding rate (% body weight per day)
- Feed Conversion Ratio (FCR)
- Survival rate (%)
- Target market size (grams)
- Estimated days to market
- Status (Active, Ready for sale, Sold, Dead)

**Growth Sampling:**
- Sample date
- Sample size (number of fish weighed)
- Total sample weight
- Average weight per fish
- Weight gain since last sample
- Daily weight gain (grams/day)
- Photos of sample

**Batch Movements:**
- Date moved
- From tank → To tank
- Reason (size, stocking density, water quality)
- Fish count at transfer
- Notes

**Stage Progression:**
- Fry (0-1g)
- Fingerling (1-5g)
- Juvenile (5-15g)
- Market-size (15g+)

**Mortality Tracking:**
- Date
- Count of dead fish
- Estimated cause
- Action taken
- Impact on survival rate

**Financial Tracking per Batch:**
- Total feed cost
- Labor allocation
- Utilities (water, electricity)
- Other costs
- Total cost per batch
- Cost per fish
- Revenue (when sold)
- Profit margin

---

### **Module 7: Feed Management**

**7.1 Feed Inventory**

**Commercial Feed Types:**
- Feed type/brand
- Pellet size (0.5mm, 1mm, 2mm, 3mm, etc.)
- Protein content (%)
- Current stock (kg)
- Reorder level (kg)
- Cost per kg (₦)
- Supplier
- Last purchase date
- Expiry date

**Live Feed Types:**
- Artemia (brine shrimp)
- Moina
- Tubifex worms
- Daphnia
- Stock levels and source

**Plant-Based Feed:**
- Duckweed
- Azolla
- Growing locations (which feed beds)
- Harvest schedule
- Estimated yield per harvest

**Stock Alerts:**
- Automatic notification when below reorder level
- Usage rate tracking (kg per week)
- Projected days until stock-out

**7.2 Feeding Logs**

**Daily Feeding Records:**
- Date and time
- Tank/batch fed
- Feed type used
- Amount fed (kg or grams)
- Feeding rate (% of body weight)
- Who fed (user)
- Observations (feeding response, etc.)

**Feeding Schedule:**
- Predefined feeding times (e.g., 8am, 2pm, 6pm)
- Reminders for staff
- Track completion

**Feed Conversion Ratio (FCR):**
- Formula: Total feed given (kg) / Total weight gain (kg)
- Track by batch
- Industry target: 1.2-1.5 for catfish
- Alert if FCR >1.8 (inefficient)

**7.3 Plant Feed Production**

**Duckweed & Azolla Beds:**
- Bed ID
- Size/capacity
- Current coverage (%)
- Growth stage (ready, growing, just harvested)
- Last harvest date
- Harvest yield (kg)
- Next harvest date (estimated)

**Harvest Records:**
- Date harvested
- Amount (kg)
- Which bed
- Quality notes
- Usage (which batches fed)

---

### **Module 8: Sales & Customer Management**

**8.1 Customer Database**

**Customer Information:**
- Customer name
- Phone number(s)
- Email (optional)
- Address/location
- Customer type (Retailer, Farm, Restaurant, Direct)
- Preferred fish size
- Typical order quantity
- Payment terms (Cash, Transfer, Credit)
- Credit limit (if applicable)
- Outstanding balance
- Total lifetime purchases (₦)
- Number of orders
- Last purchase date
- Notes

**Customer Tiers:**
- Regular (1-5 purchases)
- VIP (6+ purchases or ₦2M+ lifetime value)
- Inactive (no purchase in 6+ months)

**8.2 Sales Records**

**Sale Transaction Data:**
- Sale ID (auto-generated: SALE-2024-157)
- Date of sale
- Customer (linked to customer database)
- Batch(es) sold from (linked)
- Quantity sold (number of fish)
- Average weight per fish (grams)
- Total weight (kg)
- Price per fish (₦)
- Total amount (₦)
- Payment method (Cash, Bank Transfer, POS)
- Payment status (Paid, Pending, Partial)
- Amount paid
- Balance due
- Delivery date (if scheduled)
- Delivery status (Pending, Delivered)
- Delivery location
- Notes

**Sales Workflow:**
1. Create sale (select customer and batch)
2. Enter quantity and price
3. Record payment
4. Schedule delivery (optional)
5. Mark as delivered
6. Update batch inventory (reduce fish count)

**Sales Reports:**
- Daily sales summary
- Weekly sales by customer
- Monthly revenue
- Sales by fish size
- Top customers
- Payment collection status

---

### **Module 9: Financial Management**

**9.1 Expense Tracking**

**Expense Categories:**
- Feed purchases
- Labor (salaries, casual workers)
- Utilities (electricity, water)
- Maintenance & repairs
- Equipment purchases
- Hormone & medications
- Transport & logistics
- Administrative costs
- Other operational expenses

**Expense Record:**
- Date
- Category
- Description
- Amount (₦)
- Payment method
- Vendor/recipient
- Receipt/invoice number
- Related to (batch, tank, etc.)
- Approved by (user)

**Budget Tracking:**
- Set monthly budget by category
- Track spending against budget
- Alerts when approaching limit
- Variance analysis

**9.2 Batch Costing**

**Cost Allocation:**
- Automatically allocate costs to active batches
- Feed costs (from feeding logs)
- Labor (proportional allocation)
- Utilities (proportional to tank usage)
- Other direct costs

**Profitability Analysis:**
- Total cost per batch
- Revenue from batch (sales)
- Gross profit (₦)
- Profit margin (%)
- Return on investment (ROI)
- Cost per fish produced
- Cost per kg of fish

**9.3 Financial Dashboard**

**Key Metrics:**
- Total revenue (week, month, year)
- Total expenses (by category)
- Net profit
- Profit margin (%)
- Cash flow status
- Outstanding receivables
- Upcoming expenses

**Charts & Graphs:**
- Revenue trend (line chart)
- Expense breakdown (pie chart)
- Profitability by batch (bar chart)
- Monthly comparison (year-over-year)

---

### **Module 10: Health & Observations**

**Health Monitoring:**

**Health Logs:**
- Date and time
- Tank/batch affected
- Observation type (Mortality, Disease, Behavior, Water Quality)
- Severity (Low, Medium, High, Critical)
- Symptoms observed
- Estimated count affected
- Mortality count (if applicable)
- Suspected cause
- Action taken
- Treatment applied
- Medication used (type, dosage)
- Cost of treatment
- Follow-up date
- Resolution status
- Photos
- Notes

**Common Issues Database:**
- White spot disease (Ichthyophthirius)
- Bacterial infections (Columnaris, Aeromonas)
- Fungal infections
- Parasites (Anchor worm, fish lice)
- Low dissolved oxygen
- Ammonia toxicity
- pH stress
- Overfeeding
- Stocking density issues

**Treatment Protocols:**
- Standard treatments for common diseases
- Dosage calculations
- Quarantine procedures
- Water exchange protocols

**Water Quality Trends:**
- Track parameters over time
- Identify patterns before problems
- Correlate with mortality events

---

### **Module 11: Reports & Analytics**

**11.1 Standard Reports**

**Production Reports:**
- Spawn success rate (overall and by broodstock)
- Batch performance summary
- Growth rate trends
- Survival rates by stage
- Tank utilization rates
- Stocking density analysis

**Financial Reports:**
- Profit & Loss Statement (P&L)
- Revenue by period
- Expense breakdown
- Batch profitability ranking
- Cost per fish analysis
- FCR efficiency report

**Sales Reports:**
- Sales summary (by day, week, month)
- Customer purchase history
- Top customers by value
- Sales by fish size
- Payment collection status
- Outstanding receivables

**Operational Reports:**
- Feeding efficiency (FCR by batch)
- Feed consumption trends
- Tank maintenance schedule
- Staff activity log
- Health incident summary

**11.2 Custom Date Ranges**
- All reports can be filtered by date range
- Compare periods (this month vs last month)
- Year-to-date views
- Custom date selection

**11.3 Export Options**
- PDF (formatted reports)
- Excel (raw data for further analysis)
- CSV (data export)

**11.4 Dashboards**

**Owner Dashboard:**
- High-level KPIs
- Financial summary
- Production metrics
- Alerts and notifications

**Operations Dashboard:**
- Daily tasks
- Tank status overview
- Feeding schedule
- Growth sampling due

---

### **Module 12: System Configuration & Settings**

**Farm Settings:**
- Farm name and address
- Contact information
- Capacity limits (total tanks, max fish)
- Default parameters (stocking density, feeding rates)
- Currency settings (₦ NGN)
- Date format (DD/MM/YYYY)

**Tank Configuration:**
- Add/edit tank details
- Set capacity and type
- Define sections/locations

**Feed Configuration:**
- Add/edit feed types
- Set reorder levels
- Configure feeding schedules

**User Management:**
- Add/edit users
- Assign roles and permissions
- Reset passwords
- Deactivate users

**Notification Settings:**
- Email alerts (if configured)
- In-app notifications
- Alert thresholds (low stock, high mortality, etc.)

**Data Management:**
- Backup database
- Export all data
- Import historical data

---

## 5. TECHNICAL REQUIREMENTS

### **5.1 Platform & Architecture**

**Frontend:**
- Progressive Web App (PWA)
- Mobile-first responsive design
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Minimum screen size: 320px (small phones)
- Maximum screen size: Unlimited (desktop monitors)

**Backend:**
- RESTful API architecture
- JWT-based authentication
- Stateless server design
- API documentation (OpenAPI/Swagger)

**Database:**
- PostgreSQL (recommended) or MySQL
- Normalized schema (avoid data redundancy)
- Foreign key constraints
- Indexes on frequently queried fields
- Automated backups (daily)

**Technology Stack Recommendation:**
- Frontend: React 18+ with Vite
- Backend: Node.js with Express or Fastify
- Database: PostgreSQL 14+
- Styling: TailwindCSS
- State Management: Zustand or Redux Toolkit
- API Calls: React Query (with caching)
- Forms: React Hook Form
- Charts: Recharts
- Icons: Lucide React
- Date Handling: date-fns

### **5.2 Performance Requirements**

**Speed:**
- Initial page load: <3 seconds (on 3G)
- Page transitions: <300ms
- API response time: <500ms (95th percentile)
- Smooth scrolling (60fps)

**Offline Capability:**
- Critical features work without internet:
  - View dashboard
  - View batch and tank lists
  - Log feeding (queued for sync)
  - View recent records
- Auto-sync when connection restored
- Clear online/offline status indicator

**Data Usage:**
- Minimize data transfer (<5MB per session)
- Compress images
- Cache static assets
- Lazy load non-critical content

### **5.3 Security Requirements**

**Authentication:**
- Secure password storage (bcrypt, min 10 rounds)
- JWT tokens (short-lived: 24 hours)
- Refresh tokens (7 days)
- Password complexity requirements (min 6 characters)
- Forgot password flow with SMS verification (future)

**Authorization:**
- Role-based access control (RBAC)
- Endpoint-level permissions
- Row-level security (users see only their farm's data)

**Data Protection:**
- HTTPS only (SSL/TLS)
- SQL injection prevention (parameterized queries)
- XSS protection (input sanitization)
- CSRF tokens
- Rate limiting (prevent abuse)

**Audit Trail:**
- Log all create, update, delete operations
- Track user activity
- Timestamp all actions
- Cannot delete logs (append-only)

### **5.4 Mobile & Responsive Design**

**Breakpoints:**
- Mobile: 320px - 767px (default, primary design)
- Tablet: 768px - 1023px
- Desktop: 1024px+

**Touch Optimization:**
- Minimum touch target: 44×44px
- Adequate spacing between interactive elements
- Swipe gestures for navigation (optional)
- No hover-only interactions

**Keyboard Navigation:**
- All features accessible via keyboard
- Tab order follows logical flow
- Focus indicators visible

**Accessibility:**
- WCAG 2.1 AA compliance
- Screen reader support (semantic HTML, ARIA labels)
- Color contrast ratios (4.5:1 for text)
- Alternative text for images
- Keyboard navigation

---

## 6. USER INTERFACE DESIGN PRINCIPLES

### **6.1 Mobile-First Design**

**Why Mobile-First:**
- Farm staff primarily use phones
- Internet connectivity often limited
- Need for quick data entry in field
- Works on any device (no app store needed)

**Design Principles:**
- Large, thumb-friendly buttons (minimum 44×44px)
- Simple navigation (bottom nav bar for main sections)
- Minimal text entry (use dropdowns, number pickers)
- Progressive disclosure (show details on demand)
- Clear visual hierarchy
- High contrast for outdoor visibility

### **6.2 Nigerian Context**

**Localization:**
- Currency: Nigerian Naira (₦) with comma separators (₦1,500,000)
- Date format: DD/MM/YYYY (02/12/2024)
- Time format: 24-hour clock (14:30)
- Phone numbers: Nigerian format (080XXXXXXXX)
- Language: English
- Local terminology (e.g., "fingerlings" not "juveniles")

**Network Considerations:**
- Assume 3G connection speed
- Minimize image sizes
- Compress all assets
- Cache aggressively
- Work offline where possible

### **6.3 Color Scheme**

**Primary Colors:**
- Primary Blue: #0066CC (Trust, water, professional)
- Primary Green: #22C55E (Growth, health, success)
- Warning Orange: #F97316 (Alerts, attention)
- Danger Red: #DC2626 (Critical issues, errors)

**Neutral Colors:**
- Dark Gray: #1F2937 (Primary text)
- Medium Gray: #6B7280 (Secondary text)
- Light Gray: #F3F4F6 (Backgrounds)
- White: #FFFFFF (Cards, containers)

**Status Colors:**
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Error: Red (#EF4444)
- Info: Blue (#3B82F6)

### **6.4 Typography**

**Font Family:**
- Sans-serif: 'Inter' or system font stack
- Monospace (for codes): 'Roboto Mono'

**Font Sizes:**
- Headers: 24px, 20px, 18px
- Body: 16px (default), 14px (secondary)
- Small: 12px (captions, labels)
- Buttons: 16px (easy to tap)

**Font Weights:**
- Regular: 400 (body text)
- Medium: 500 (labels)
- Semi-bold: 600 (headings)
- Bold: 700 (emphasis)

---

## 7. DATA MIGRATION & ONBOARDING

### **7.1 Initial Data Setup**

**Tank Configuration:**
- Pre-configure all 24 tanks based on your farm design
  - 6 IBC tote sections (600L each)
  - 3 tarpaulin ponds (1,500L each)
  - 15 top-loading tanks (800L each)

**Broodstock:**
- Input existing broodstock (6 fish initially)
- Historical spawning data (if available)

**Feed Inventory:**
- Current stock levels
- Supplier information
- Reorder levels

**User Accounts:**
- Create admin account (you)
- Set up assistant accounts
- Configure permissions

### **7.2 Historical Data Import**

**Spawning Records:**
- Import last 3-6 months of spawns (if manual records exist)
- Use CSV template for bulk upload
- Link to broodstock

**Batch Records:**
- Import currently active batches
- Current locations and weights
- Estimated start dates

**Sales History:**
- Past 6 months of sales (optional)
- Customer information
- Helps with customer database

### **7.3 Training Materials**

**For Owner/Manager:**
- Complete system walkthrough (video)
- How to generate reports
- How to manage users
- Troubleshooting guide

**For Assistants:**
- How to log daily activities
- Spawning workflow
- Feeding logs
- Sales entry

**Quick Reference Cards:**
- Printed guides for common tasks
- Laminated for field use
- Icons and minimal text

---

## 8. INTEGRATION & FUTURE FEATURES

### **8.1 MVP Exclusions (Phase 1)**

These features are intentionally excluded from v1.0 to keep scope manageable:

- SMS notifications
- WhatsApp integration
- Payment gateway integration
- Mobile app (native iOS/Android)
- Automated water parameter logging (IoT sensors)
- Multi-farm support
- SaaS (Software as a Service) for other farms
- Marketplace/e-commerce features
- Advanced AI/ML predictions

### **8.2 Phase 2 Features (Post-MVP)**

**After successful 3-6 month deployment:**
- Photo uploads (document health issues, growth samples)
- SMS alerts for critical events
- Export to accounting software (QuickBooks, etc.)
- Advanced analytics (predictive growth rates)
- Mobile app (optional, if PWA insufficient)
- Multi-currency support (for export sales)

### **8.3 Phase 3 Features (Long-term Vision)**

**Expand to serve other hatcheries:**
- Multi-tenant architecture
- Subscription model (SaaS)
- White-label options
- Marketplace features (connect hatcheries with buyers)
- Financial services integration (loans, insurance)
- Industry benchmarking

### **8.4 API & Integration Points**

**External Integrations (future):**
- Payment processors (Paystack, Flutterwave)
- SMS gateways (Twilio, AfricasTalking)
- WhatsApp Business API
- Google Drive (auto-backup)
- QuickBooks/Accounting software
- Weather APIs (environmental factors)

---

## 9. SUCCESS CRITERIA & METRICS

### **9.1 MVP Launch Criteria (Week 6-8)**

**Functional Requirements:**
- ✅ All 10 core modules functional and tested
- ✅ 3 user roles configured with proper permissions
- ✅ 100+ historical spawn records migrated (if available)
- ✅ Mobile-responsive on phones, tablets, and desktop
- ✅ Basic reports generating correctly
- ✅ Data can be exported (Excel, PDF)
- ✅ Offline mode works for critical features

**Training & Adoption:**
- ✅ Owner fully trained (can use all features)
- ✅ Assistants trained on daily tasks
- ✅ User guide/documentation available
- ✅ Support contact established

### **9.2 Post-Launch Success Metrics**

**2 Months Post-Launch:**
- 90% of spawns recorded digitally
- 90% reduction in missing/incomplete records
- Zero data loss incidents
- Staff adoption rate >85%
- <10 bugs reported (none critical)

**6 Months Post-Launch:**
- 5%+ improvement in survival rates (from data-driven insights)
- 10%+ reduction in feed waste (improved FCR tracking)
- Ability to calculate per-batch profitability in real-time
- 50% reduction in time spent on manual reporting
- ROI calculation showing time/cost savings

**12 Months Post-Launch:**
- System is indispensable to operations
- 100% of records digital
- Historical data enables trend analysis
- Business decisions routinely based on system data
- Interest from other farms in the system

---

## 10. DEVELOPMENT PRIORITIES

### **Must Have (Weeks 1-4):**
Critical features required for MVP launch:

1. **User authentication & role management**
   - Login system
   - User roles (Owner, Senior, Junior)
   - Permissions enforcement

2. **Dashboard**
   - Overview statistics
   - Today's tasks
   - Quick actions

3. **Spawning records**
   - Create spawn
   - Track spawn stages
   - Link to batches

4. **Tank management**
   - Tank inventory
   - Current stocking
   - Capacity tracking

5. **Production tracking (basic)**
   - Create batches from spawns
   - Record growth samples
   - Track movements

6. **Sales records**
   - Create sale
   - Link to batches
   - Customer management (basic)

### **Should Have (Weeks 5-6):**
Important features that enhance functionality:

7. **Feed management**
   - Feed inventory
   - Feeding logs
   - FCR calculation

8. **Financial tracking**
   - Expense logging
   - Batch costing
   - Basic profitability

9. **Broodstock management**
   - Broodstock records
   - Spawning history
   - Rest period tracking

10. **Basic reports**
    - Production summary
    - Sales summary
    - Financial overview

### **Nice to Have (Post-MVP):**
Can be added in subsequent releases:

- Health observations module (detailed)
- Photo uploads
- Advanced offline mode
- Export to Excel (advanced)
- SMS notifications
- WhatsApp integration
- Advanced analytics
- Predictive insights

---

## 11. RISKS & MITIGATION

### **Risk 1: Low Staff Adoption**
**Impact:** High - System useless if staff won't use it

**Mitigation:**
- Involve staff in design (get feedback early)
- Make it EASY (large buttons, minimal typing)
- Show immediate value (easier than paper)
- Provide hands-on training
- Offer incentives (recognition for complete records)
- Start with one assistant as "champion"

### **Risk 2: Internet Connectivity Issues**
**Impact:** High - Farm location may have poor connectivity

**Mitigation:**
- Offline-first design (critical features work without internet)
- Local data storage with background sync
- Clear online/offline indicators
- Consider local server on-premises (if needed)

### **Risk 3: Data Loss**
**Impact:** Critical - Losing production records is devastating

**Mitigation:**
- Automated daily backups
- Backup to multiple locations (local + cloud)
- Transaction integrity (database constraints)
- Regular backup testing (restore drills)
- Export data regularly (Excel backup)

### **Risk 4: Scope Creep**
**Impact:** Medium - Delays launch, increases cost

**Mitigation:**
- Strict MVP definition (this PRD)
- Resist adding features during development
- Use "Phase 2" parking lot for good ideas
- Focus on core workflows first
- Time-box development (6-8 weeks firm)

### **Risk 5: Over-Complexity**
**Impact:** Medium - System too hard to use

**Mitigation:**
- User testing with actual farm staff
- Simplify UI at every opportunity
- Provide defaults for all inputs
- Clear error messages
- In-app help and tooltips

---

## 12. NEXT STEPS FOR DEVELOPMENT

### **For Claude Code:**

This PRD is ready for Claude Code. To start development:

1. **Copy this entire PRD** to Claude Code
2. **Also provide:**
   - Database Schema (`TaniTrack_Database_Schema.sql`)
   - API Specifications (`TaniTrack_API_Specifications.md`)
   - Wireframe Descriptions (`TaniTrack_Complete_Wireframe_Descriptions.md`)

3. **Start with this prompt:**
   "Build a Progressive Web App for TaniTrack based on this PRD. Start with the authentication system and dashboard. Use React + Vite for the frontend, Node.js + Express for the backend, and PostgreSQL for the database. Follow the database schema and API specifications provided. Make it mobile-first with TailwindCSS."

4. **Iterative development approach:**
   - Build module-by-module
   - Test each module before moving to next
   - Start with must-have features (Weeks 1-4)
   - Then add should-have features (Weeks 5-6)
   - Leave nice-to-have for post-MVP

5. **Technology Stack:**
   - **Frontend:** React 18+ with Vite
   - **Backend:** Node.js with Express or Fastify
   - **Database:** PostgreSQL 14+
   - **Styling:** TailwindCSS
   - **State Management:** Zustand or Redux Toolkit
   - **API Calls:** React Query (with caching)
   - **Forms:** React Hook Form
   - **Charts:** Recharts
   - **Icons:** Lucide React
   - **Date Handling:** date-fns

---

## 13. APPENDICES

### **Appendix A: Glossary of Terms**

- **Fingerling:** Young fish (1-5g) ready for stocking or sale
- **Fry:** Newly hatched fish (0-1g)
- **Spawn:** A single breeding event producing eggs
- **Batch:** A group of fish from one spawn, tracked together
- **Broodstock:** Adult fish kept for breeding
- **FCR (Feed Conversion Ratio):** kg of feed / kg of fish growth (lower is better)
- **Stocking Density:** Number of fish per liter of water
- **Swim-up Stage:** When fry start swimming and feeding (3-5 days after hatching)
- **Juvenile:** Mid-size fish (5-15g)
- **Market-size:** Fish ready for sale (typically 15g+ for fingerlings)
- **IBC Tote:** Intermediate Bulk Container (600L plastic tank)
- **Tarpaulin Pond:** Large waterproof fabric-lined pond
- **DO (Dissolved Oxygen):** Amount of oxygen in water (critical for fish health)

### **Appendix B: Nigerian Catfish Production Context**

**Species:** *Clarias gariepinus* (African Catfish)

**Market Sizes:**
- Fingerlings: 3-5g (for fish farmers)
- Table-size: 1kg+ (for consumption)

**Typical Survival Rates:**
- Eggs to fry: 60-70%
- Fry to fingerling: 30-40%
- Fingerling to market: 70-80%
- Overall (egg to market): 15-25% is common, 30%+ is excellent

**Growth Rates:**
- Fingerling stage: 0.5-1g per day
- Juvenile: 1-2g per day
- Market-size: 2-3g per day

**Feed Conversion Ratio (FCR):**
- Good: 1.2-1.5
- Average: 1.5-1.8
- Poor: >2.0

**Economic Data:**
- Fingerling price: ₦35-50 per piece (3-5g)
- Feed cost: ₦500-800 per kg (varies by pellet size)
- Hormone (Ovaprim): ₦3,000-5,000 per spawn
- Electricity (backup generator): Significant cost

---

## END OF PRODUCT REQUIREMENTS DOCUMENT

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Status:** Ready for Development  
**Author:** Tani Nigeria Ltd  

**For Questions or Clarifications:**  
Refer to the accompanying documents:
- Database Schema (SQL tables and relationships)
- API Specifications (REST endpoint documentation)
- Wireframe Descriptions (UI/UX specifications)

This PRD provides complete business and functional requirements for building TaniTrack v1.0 (MVP).

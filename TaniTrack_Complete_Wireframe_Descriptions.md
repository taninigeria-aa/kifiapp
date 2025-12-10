# ============================================================================
# TaniTrack: Hatchery Management System
# COMPLETE WIREFRAME DESCRIPTIONS & UI SPECIFICATIONS v1.0
# Created: December 2024
# Company: Tani Nigeria Ltd
# ============================================================================

## TABLE OF CONTENTS

### PART 1: DESIGN FOUNDATION
1. Design Philosophy
2. Design System (Colors, Typography, Spacing, Components)
3. Navigation Structure
4. Common UI Patterns

### PART 2: SCREEN SPECIFICATIONS
5. Authentication Screens (Login, Forgot Password)
6. Dashboard & Home
7. Production Module (Spawns, Batches, Tanks)
8. Sales Module (Sales List, New Sale, Sale Details)
9. Customers Module
10. Feed Management Module
11. Financial Module (Expenses, Reports)
12. Broodstock Module
13. Health & Observations Module
14. Reports & Analytics
15. Settings & User Management

### PART 3: IMPLEMENTATION GUIDE
16. Component Library
17. Data Flow & States
18. Responsive Breakpoints
19. Performance Considerations
20. Accessibility Requirements

---

# ============================================================================
# PART 1: DESIGN FOUNDATION
# ============================================================================

## 1. DESIGN PHILOSOPHY

**Mobile-First Approach:**
- All screens designed for mobile phones first (320px+)
- Progressive enhancement for tablets (768px+) and desktop (1024px+)
- Touch-optimized with minimum 44×44px tap targets
- Thumb-friendly navigation (important controls within reach)

**Nigerian Market Context:**
- Currency: Nigerian Naira (₦) with thousands separator (₦1,500,000)
- Date format: DD/MM/YYYY (02/12/2024)
- Time format: 24-hour (14:30)
- Phone numbers: Nigerian format (080XXXXXXXX, 081XXXXXXXX)
- Language: English (with local fish farming terminology)

**Farm-Friendly Design:**
- High contrast for outdoor visibility (readable in sunlight)
- Large text and controls (farmworkers may have limited tech experience)
- Minimal text input (prefer dropdowns, toggles, number spinners)
- Clear visual feedback (success/error states)
- Works with gloves (large touch targets)

**Offline-First Capabilities:**
- Critical features work without internet connection
- Local data storage with background sync
- Clear online/offline indicators
- Graceful degradation when offline

**Performance Goals:**
- Initial load: <3 seconds on 3G
- Page transitions: <300ms
- Smooth scrolling (60fps)
- Bundle size: <500KB gzipped

---

## 2. DESIGN SYSTEM

### 2.1 Color Palette

**Primary Colors:**
```
Primary Blue:     #0066CC (Trust, Water, Professional)
Primary Green:    #22C55E (Growth, Health, Success)
Warning Orange:   #F97316 (Alerts, Attention needed)
Danger Red:       #DC2626 (Critical issues, Errors)
Info Cyan:        #06B6D4 (Information, Neutral alerts)
```

**Neutral Palette:**
```
Gray-900:  #1F2937 (Primary text, Headers)
Gray-700:  #374151 (Secondary text)
Gray-500:  #6B7280 (Tertiary text, Icons)
Gray-300:  #D1D5DB (Borders, Dividers)
Gray-100:  #F3F4F6 (Backgrounds, Disabled states)
Gray-50:   #F9FAFB (Page backgrounds)
White:     #FFFFFF
```

**Semantic Colors:**
```
Success:        #10B981 (Completed actions, Good metrics)
Warning:        #F59E0B (Caution, Low stock)
Error:          #EF4444 (Failed actions, Critical issues)
Info:           #3B82F6 (Neutral information)
```

**Background Colors:**
```
Page Background:     #F9FAFB (Gray-50)
Card Background:     #FFFFFF
Hover State:         #F3F4F6 (Gray-100)
Selected State:      #DBEAFE (Blue-100)
Disabled:            #F3F4F6 (Gray-100)
```

### 2.2 Typography

**Font Family:**
```
Primary: 'Inter', system-ui, -apple-system, sans-serif
Monospace: 'Roboto Mono', 'Courier New', monospace (for codes, numbers)
```

**Type Scale:**
```
Display Large:    32px / 700 weight / 40px line-height (Page titles)
Display Medium:   28px / 700 weight / 36px line-height (Section headers)
Heading Large:    24px / 600 weight / 32px line-height (Card titles)
Heading Medium:   20px / 600 weight / 28px line-height (Subsections)
Heading Small:    18px / 600 weight / 24px line-height (List headers)
Body Large:       16px / 400 weight / 24px line-height (Primary text)
Body Medium:      14px / 400 weight / 20px line-height (Secondary text)
Body Small:       12px / 400 weight / 16px line-height (Captions, Labels)
Label:            14px / 500 weight / 20px line-height (Form labels)
Button:           16px / 500 weight / 24px line-height (Button text)
```

**Text Colors:**
```
Primary:     Gray-900 (#1F2937)
Secondary:   Gray-700 (#374151)
Tertiary:    Gray-500 (#6B7280)
Disabled:    Gray-400 (#9CA3AF)
Inverse:     White on dark backgrounds
Link:        Primary Blue (#0066CC)
```

### 2.3 Spacing System

**Base Unit: 4px**
```
xs:   4px   (0.25rem)  - Tight element spacing
sm:   8px   (0.5rem)   - Component internal padding
md:   16px  (1rem)     - Default spacing
lg:   24px  (1.5rem)   - Section spacing
xl:   32px  (2rem)     - Major section breaks
2xl:  48px  (3rem)     - Page section separation
3xl:  64px  (4rem)     - Large section breaks
```

**Layout Grid:**
```
Mobile (320px+):   16px edge margins, 8px gutters
Tablet (768px+):   24px edge margins, 16px gutters
Desktop (1024px+): 32px edge margins, 24px gutters
Max Width:         1280px (centered)
```

### 2.4 Elevation & Shadows

**Shadow Levels:**
```
Shadow-sm:    0 1px 2px rgba(0,0,0,0.05)      (Subtle cards)
Shadow-md:    0 4px 6px rgba(0,0,0,0.07)      (Raised cards)
Shadow-lg:    0 10px 15px rgba(0,0,0,0.1)     (Modals, Dropdowns)
Shadow-xl:    0 20px 25px rgba(0,0,0,0.1)     (Popovers)
```

### 2.5 Border Radius

```
None:    0px       (Straight edges)
sm:      4px       (Buttons, Inputs, Tags)
md:      8px       (Cards, Containers)
lg:      12px      (Prominent cards)
xl:      16px      (Modal dialogs)
full:    9999px    (Circular buttons, Pills)
```

### 2.6 Icons

**Icon Library:** Lucide Icons (https://lucide.dev)
**Sizes:**
```
xs:  16px  (Inline icons)
sm:  20px  (Form field icons)
md:  24px  (Standard UI icons)
lg:  32px  (Feature icons)
xl:  48px  (Empty state icons)
```

**Common Icons:**
```
Navigation:     home, fish, dollar-sign, bar-chart, menu
Actions:        plus, edit, trash-2, save, x, check
Status:         alert-circle, check-circle, info, alert-triangle
Data:           calendar, clock, user, users, settings
Production:     droplet, thermometer, scale, beaker
Finance:        trending-up, trending-down, wallet, credit-card
```

---

## 3. NAVIGATION STRUCTURE

### 3.1 Bottom Navigation (Mobile Primary Navigation)

**Position:** Fixed at bottom of screen (always visible)
**Height:** 64px (large touch targets)
**Background:** White with top border
**Items:** 5 navigation items

```
┌─────────────────────────────────────────┐
│  🏠      🐟      💰      📊      ⋯     │
│  Home  Production Sales  Reports  More  │
└─────────────────────────────────────────┘
```

**Navigation Items:**
1. **Home** (`/dashboard`)
   - Icon: home
   - Label: "Home"
   - Color: Primary Blue when active

2. **Production** (`/production`)
   - Icon: fish
   - Label: "Production"
   - Submenu: Spawns, Batches, Tanks

3. **Sales** (`/sales`)
   - Icon: dollar-sign
   - Label: "Sales"
   - Direct to sales list

4. **Reports** (`/reports`)
   - Icon: bar-chart
   - Label: "Reports"
   - Dashboard with report categories

5. **More** (`/more`)
   - Icon: menu
   - Label: "More"
   - Opens drawer with additional options

**Active State:**
- Icon color changes to Primary Blue
- Label becomes bold (600 weight)
- Optional underline or background pill

### 3.2 Top App Bar

**Height:** 56px
**Background:** White with bottom shadow
**Layout:** 3-section (left, center, right)

```
┌─────────────────────────────────────────┐
│ ☰  TaniTrack              🔔(3)  ⚙️    │
└─────────────────────────────────────────┘
```

**Left Section:**
- Hamburger menu icon (opens navigation drawer on tablet/desktop)
- OR Back arrow (when inside nested screen)

**Center Section:**
- App logo/name "TaniTrack"
- OR Screen title (on detail screens)

**Right Section:**
- Notification bell (with badge count if unread)
- Settings gear icon
- User avatar (on desktop)

### 3.3 Side Drawer (Tablet/Desktop)

**Width:** 280px
**Background:** White
**Position:** Left side, collapsible

**Contents:**
```
┌──────────────────────┐
│  TaniTrack Logo      │
│                      │
│  Admin User          │
│  admin@tani.ng       │
│                      │
│  🏠 Dashboard        │
│  🐟 Production    ▾  │
│    • Spawns          │
│    • Batches         │
│    • Tanks           │
│  💰 Sales            │
│  👥 Customers        │
│  📦 Feed Inventory   │
│  💵 Financials       │
│  📊 Reports          │
│  🔬 Broodstock       │
│  ⚕️ Health Logs      │
│  ⚙️ Settings         │
│                      │
│  [Logout]            │
└──────────────────────┘
```

---

## 4. COMMON UI PATTERNS

### 4.1 Cards

**Standard Card:**
```css
Background: White
Border: 1px solid Gray-300
Border Radius: 8px (md)
Padding: 16px (md)
Shadow: shadow-sm
Hover: shadow-md + border Primary Blue
```

**Example:**
```
┌─────────────────────────────┐
│ Card Title          [Action]│
│                              │
│ Card content goes here with  │
│ appropriate spacing and      │
│ typography.                  │
│                              │
│ Additional info or metrics   │
└─────────────────────────────┘
```

### 4.2 Buttons

**Primary Button:**
```css
Background: Primary Blue (#0066CC)
Text: White, 16px, 500 weight
Padding: 12px 24px
Border Radius: 8px (md)
Height: 44px minimum (touch target)
Hover: Darker blue (#0052A3)
Active: Even darker (#003D7A)
Disabled: Gray-300 background, Gray-500 text
```

**Secondary Button:**
```css
Background: Transparent
Text: Primary Blue, 16px, 500 weight
Border: 2px solid Primary Blue
Padding: 10px 22px (account for border)
Border Radius: 8px (md)
Hover: Background Gray-100
```

**Danger Button:**
```css
Background: Danger Red (#DC2626)
Text: White
Same sizing as Primary
Hover: Darker red
```

**Ghost Button (Text-only):**
```css
Background: Transparent
Text: Primary Blue
Padding: 8px 16px
Hover: Background Gray-100
```

**Icon Button:**
```css
Size: 40×40px (minimum touch target)
Background: Transparent
Border Radius: 8px
Hover: Background Gray-100
Icon: 24px, Gray-700
```

### 4.3 Form Inputs

**Text Input:**
```css
Height: 44px
Background: White
Border: 1px solid Gray-300
Border Radius: 8px
Padding: 12px 16px
Font: 16px (prevents iOS zoom)
Placeholder: Gray-500
Focus: Border Primary Blue, shadow-md
Error: Border Danger Red
Disabled: Background Gray-100
```

**Input with Icon:**
```
┌─────────────────────────────┐
│ 📧  email@example.com       │
└─────────────────────────────┘
```

**Select Dropdown:**
```css
Same as Text Input
Right padding: 40px (for chevron icon)
Chevron: 20px icon, right aligned
```

**Checkbox/Radio:**
```css
Size: 20×20px
Border: 2px solid Gray-400
Border Radius: 4px (checkbox), 50% (radio)
Checked: Background Primary Blue, white checkmark
Label: 14px, Gray-900, 8px left margin
```

**Date Picker:**
```
┌─────────────────────────────┐
│ 📅 02/12/2024         ▼     │
└─────────────────────────────┘
```

**Number Input with Spinner:**
```
┌─────────────────────────────┐
│  [-]      5,000       [+]   │
└─────────────────────────────┘
```

### 4.4 Status Badges

**Badge Component:**
```css
Padding: 4px 12px
Border Radius: 9999px (pill shape)
Font: 12px, 600 weight
Height: 24px
```

**Status Colors:**
```
Active:       Green-100 background, Green-700 text
Pending:      Orange-100 background, Orange-700 text
Completed:    Blue-100 background, Blue-700 text
Cancelled:    Red-100 background, Red-700 text
Inactive:     Gray-100 background, Gray-700 text
```

**Examples:**
```
[ Active ]  [ Pending ]  [ Completed ]
```

### 4.5 Lists

**List Item Pattern:**
```
┌─────────────────────────────┐
│ [Icon] Primary Text      →  │
│        Secondary Text        │
│        Metadata • Status     │
└─────────────────────────────┘
```

**Specs:**
- Height: Minimum 64px (touch target)
- Padding: 16px vertical, 16px horizontal
- Border: Bottom 1px solid Gray-200
- Hover/Active: Background Gray-50
- Icon: 24px, left aligned
- Right arrow: 20px chevron-right

### 4.6 Modals/Dialogs

**Modal Overlay:**
```css
Background: rgba(0,0,0,0.5)
Position: Fixed, Full screen
Z-index: 1000
```

**Modal Content:**
```css
Background: White
Border Radius: 16px (xl)
Shadow: shadow-xl
Max Width: 500px (mobile: 90vw)
Padding: 24px
Position: Centered
```

**Structure:**
```
┌─────────────────────────────┐
│ Title              [×]      │
├─────────────────────────────┤
│                              │
│ Modal content...             │
│                              │
├─────────────────────────────┤
│        [Cancel]  [Confirm]  │
└─────────────────────────────┘
```

### 4.7 Toast Notifications

**Position:** Top center, 16px from top
**Width:** 90vw (max 400px)
**Duration:** 4 seconds (auto-dismiss)
**Animation:** Slide down from top

**Types:**
```
Success:  Green-50 bg, Green-700 text, check-circle icon
Error:    Red-50 bg, Red-700 text, alert-circle icon
Warning:  Orange-50 bg, Orange-700 text, alert-triangle icon
Info:     Blue-50 bg, Blue-700 text, info icon
```

### 4.8 Empty States

**Pattern:**
```
┌─────────────────────────────┐
│                              │
│         [Large Icon]         │
│                              │
│      Primary Message         │
│   Secondary explanation      │
│                              │
│     [Call to Action]         │
│                              │
└─────────────────────────────┘
```

**Specs:**
- Icon: 64px, Gray-400
- Title: 20px, 600 weight, Gray-900
- Description: 14px, Gray-500, centered
- Padding: 48px all around
- CTA button: Primary style

### 4.9 Loading States

**Skeleton Loaders:**
```css
Background: Linear gradient
  Gray-200 to Gray-300 and back
Animation: Pulse 1.5s ease-in-out infinite
Border Radius: Match content (4px for text, 8px for cards)
```

**Spinner:**
```css
Size: 24px (inline) or 48px (page load)
Color: Primary Blue
Animation: Spin 1s linear infinite
```

---

# ============================================================================
# PART 2: SCREEN SPECIFICATIONS
# ============================================================================

## 5. AUTHENTICATION SCREENS

### 5.1 Login Screen
**Route:** `/login`
**Auth Required:** No

**Layout:**
```
┌─────────────────────────────────┐
│                                 │
│         [TaniTrack Logo]        │
│           TaniTrack             │
│      Hatchery Management        │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 📱 Phone Number          │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 🔒 Password              │  │
│  │                     👁️   │  │
│  └──────────────────────────┘  │
│                                 │
│  ☐ Remember me                  │
│                                 │
│  ┌──────────────────────────┐  │
│  │      LOGIN               │  │
│  └──────────────────────────┘  │
│                                 │
│      Forgot password?           │
│                                 │
└─────────────────────────────────┘
```

**Components:**

**Logo Section:**
- Logo: 120×120px, centered
- App name: "TaniTrack", 24px, 700 weight, centered
- Subtitle: "Hatchery Management", 16px, Gray-500, centered
- Spacing: 32px below subtitle

**Phone Input:**
- Label: "Phone Number"
- Placeholder: "08012345678"
- Type: tel
- Icon: 📱 (phone icon)
- Format: Auto-format as user types
- Validation: Must start with 070/080/081/090/091
- Length: 11 digits

**Password Input:**
- Label: "Password"
- Type: password (toggleable)
- Icon: 🔒 (lock icon)
- Toggle icon: 👁️ (eye icon) on right
- Min length: 6 characters
- Error: "Password must be at least 6 characters"

**Remember Me:**
- Checkbox + label
- Left aligned
- Persists auth token for 7 days

**Login Button:**
- Primary button style
- Full width
- Text: "LOGIN"
- Loading state: Shows spinner, disabled
- On success: Navigate to `/dashboard`
- On error: Toast notification "Invalid phone number or password"

**Forgot Password Link:**
- Text button
- Center aligned
- Text: "Forgot password?"
- Links to `/forgot-password`

**Validation Rules:**
- Both fields required
- Phone: Must be 11 digits, Nigerian format
- Password: Minimum 6 characters
- Button disabled until both valid
- Real-time validation (show error on blur)

---

### 5.2 Forgot Password Screen
**Route:** `/forgot-password`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Forgot Password            │
├─────────────────────────────────┤
│                                 │
│   Enter your phone number       │
│   and we'll help you reset      │
│   your password.                │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 📱 Phone Number          │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │    RESET PASSWORD        │  │
│  └──────────────────────────┘  │
│                                 │
│   Remember password?            │
│   [Back to Login]               │
│                                 │
└─────────────────────────────────┘
```

**Flow:**
1. User enters phone number
2. Validates number exists in system
3. Sends SMS with reset code (or shows code in dev)
4. Navigates to verification screen
5. User enters code + new password
6. Password reset, redirect to login

---

## 6. DASHBOARD & HOME

### 6.1 Dashboard Screen
**Route:** `/dashboard`
**Auth Required:** Yes
**Bottom Nav:** "Home" active

**Layout:**
```
┌─────────────────────────────────┐
│ ☰  TaniTrack         🔔(3)  ⚙️  │
├─────────────────────────────────┤
│                                 │
│ Good morning, Admin!            │
│ Monday, 02 December 2024        │
│                                 │
│ QUICK STATS                     │
│ ┌──────────┬──────────┐         │
│ │ 287,000  │    43    │         │
│ │ Total    │ Active   │         │
│ │ Fish     │ Batches  │         │
│ ├──────────┼──────────┤         │
│ │ ₦2.4M    │    12    │         │
│ │ Sales    │ Spawns   │         │
│ │ This Wk  │ This Wk  │         │
│ └──────────┴──────────┘         │
│                                 │
│ TODAY'S TASKS               (5) │
│ ┌─────────────────────────────┐ │
│ │ 🐟 Spawn Due                │ │
│ │ SP-2024-048 ready to strip  │ │
│ │ Expected: 06:00 (2hrs)   →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 📦 Feed Stock Low           │ │
│ │ 2.0mm pellets below reorder │ │
│ │ Current: 45kg / Min: 100kg→ │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 🚚 Delivery Today           │ │
│ │ Mrs. Ngozi - 15,000 @ 8g    │ │
│ │ ₦600,000 • Gwarinpa      →  │ │
│ └─────────────────────────────┘ │
│                  [View All]     │
│                                 │
│ QUICK ACTIONS                   │
│ ┌──────┬──────┬──────┬──────┐  │
│ │  🐟  │  💰  │  📦  │  ↔️  │  │
│ │ New  │Record│ Log  │Trans-│  │
│ │Spawn │Sale  │Feed  │ fer  │  │
│ └──────┴──────┴──────┴──────┘  │
│                                 │
│ ACTIVE TANKS          [View All]│
│ ┌─────────────────────────────┐ │
│ │ IBC-3    [=========] 95%    │ │
│ │ 42,000 fish • Day 18        │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ TOP-1    [======  ] 82%     │ │
│ │ 38,000 fish • Day 15        │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
│  🏠  🐟  💰  📊  ⋯              │
└─────────────────────────────────┘
```

**Components Breakdown:**

**1. Top App Bar:**
- Left: Hamburger menu (opens drawer)
- Center: "TaniTrack" text/logo
- Right: 
  - Notification bell (badge shows unread count)
  - Settings gear

**2. Greeting Section:**
- Dynamic greeting based on time:
  - 00:00-11:59: "Good morning"
  - 12:00-16:59: "Good afternoon"
  - 17:00-23:59: "Good evening"
- User's first name
- Current date (Day, DD Month YYYY)
- Spacing: 24px below greeting

**3. Quick Stats Grid:**
- 2×2 grid layout
- Each stat card:
  - Large number: 24px, 700 weight
  - Label: 14px, Gray-500
  - Background: White card with border
  - Padding: 16px
  - Min height: 80px
- Stats:
  - **Total Fish:** Sum of all fish in active batches
  - **Active Batches:** Count of batches with status ≠ 'sold'/'dead'
  - **Sales This Week:** Total naira from last 7 days
  - **Spawns This Week:** Count of spawns in last 7 days

**4. Today's Tasks Section:**
- Header: "TODAY'S TASKS" + badge with count
- Badge: Gray-200 background, count inside
- List of task cards (max 5 shown)
- Each task card:
  - Icon on left (24px, colored by priority)
  - Title: 16px, 600 weight
  - Subtitle: 14px, Gray-500
  - Right arrow (chevron-right)
  - Tap: Navigate to relevant screen
  - Height: Minimum 72px
  - Border bottom: 1px Gray-200
- Task types:
  - **Spawn Due:** 🐟 Orange - Shows spawns reaching stripping time within 4 hours
  - **Feed Low:** 📦 Yellow - Feed inventory below reorder level
  - **Delivery:** 🚚 Blue - Sales scheduled for today
  - **Transfer:** ↔️ Green - Batches reaching size/age for tank transfer
  - **Health Alert:** ⚠️ Red - Recent health logs marked as "urgent"
- "View All" link: Goes to `/tasks` (full task list)

**5. Quick Actions:**
- 4 square buttons in a row
- Each button:
  - Size: 25% width minus gutters
  - Height: 80px
  - Icon: 32px, centered
  - Label: 12px, centered below icon
  - Background: White card
  - Border: 1px Gray-300
  - Border radius: 8px
  - Hover: Shadow-md + border Primary Blue
- Actions:
  1. **New Spawn:** Opens `/production/spawns/new`
  2. **Record Sale:** Opens `/sales/new`
  3. **Log Feed:** Opens `/feed/log` (quick feed entry)
  4. **Transfer:** Opens `/production/transfers/new`

**6. Active Tanks Widget:**
- Header: "ACTIVE TANKS" + "View All" link
- Shows 2-3 tanks with highest stocking density
- Each tank card:
  - Tank code: 16px, 600 weight
  - Progress bar: Shows stocking % (fish count / capacity)
  - Colors:
    - 0-70%: Green
    - 71-85%: Orange
    - 86-100%: Red
  - Fish count + average weight
  - Days in current tank
  - Tap: Navigate to `/production/tanks/:id`

**7. Bottom Navigation:**
- Fixed at bottom
- "Home" icon active (Primary Blue, bold label)

---

### 6.2 Notifications Screen
**Route:** `/notifications`
**Triggered by:** Tap bell icon

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Notifications         ✓All │
├─────────────────────────────────┤
│ TODAY                           │
│ ┌─────────────────────────────┐ │
│ │ 📦 Feed Stock Low           │ │
│ │ 2.0mm Pellets below reorder │ │
│ │ level (45kg remaining)      │ │
│ │ 2 hours ago                 │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 💰 Payment Received         │ │
│ │ Mrs. Ngozi Okafor paid      │ │
│ │ ₦955,000 for SALE-2024-157  │ │
│ │ 5 hours ago                 │ │
│ └─────────────────────────────┘ │
│                                 │
│ YESTERDAY                       │
│ ┌─────────────────────────────┐ │
│ │ 🐟 Spawn Completed          │ │
│ │ SP-2024-046 reached swim-up │ │
│ │ stage. 75,000 fry.          │ │
│ │ Yesterday at 14:30          │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ⚠️ Tank Alert               │ │
│ │ IBC-3 stocking at 95%       │ │
│ │ capacity. Transfer needed.  │ │
│ │ Yesterday at 09:15          │ │
│ └─────────────────────────────┘ │
│                                 │
│ THIS WEEK                       │
│ ┌─────────────────────────────┐ │
│ │ 🎉 Batch Milestone          │ │
│ │ BATCH-2024-042 reached      │ │
│ │ juvenile stage (500g avg)   │ │
│ │ 3 days ago                  │ │
│ └─────────────────────────────┘ │
│                                 │
│        [Load More]              │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Grouped by time period (Today, Yesterday, This Week, Earlier)
- Each notification card:
  - Icon + colored dot (unread)
  - Title: 16px, 600 weight
  - Description: 14px, Gray-600
  - Timestamp: 12px, Gray-500
  - Tap: Mark as read + navigate to related item
- Top right: "✓ All" marks all as read
- Infinite scroll with "Load More" button
- Empty state: "No notifications yet"

---

## 7. PRODUCTION MODULE

### 7.1 Production Hub
**Route:** `/production`
**Auth Required:** Yes
**Bottom Nav:** "Production" active

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Production         🔔  ⚙️  │
├─────────────────────────────────┤
│                                 │
│ OVERVIEW                        │
│ ┌─────────────────────────────┐ │
│ │ Active Spawns          23   │ │
│ │ Active Batches         43   │ │
│ │ Total Tanks            18   │ │
│ │ Production This Week  2.4T  │ │
│ └─────────────────────────────┘ │
│                                 │
│ QUICK ACCESS                    │
│ ┌──────────┬──────────────────┐ │
│ │    🐟    │   🎣 SPAWNS      │ │
│ │          │   23 Active      │ │
│ │          │   View & Manage→ │ │
│ └──────────┴──────────────────┘ │
│ ┌──────────┬──────────────────┐ │
│ │    📦    │   📦 BATCHES     │ │
│ │          │   43 Active      │ │
│ │          │   Track & Move → │ │
│ └──────────┴──────────────────┘ │
│ ┌──────────┬──────────────────┐ │
│ │    🏊    │   🏊 TANKS       │ │
│ │          │   18 Total       │ │
│ │          │   Manage →       │ │
│ └──────────┴──────────────────┘ │
│                                 │
│ RECENT ACTIVITY                 │
│ ┌─────────────────────────────┐ │
│ │ SP-2024-048                 │ │
│ │ Spawned today • 95,000 eggs │ │
│ │ 2 hours ago              →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ BATCH-2024-041              │ │
│ │ Transferred to TOP-5        │ │
│ │ 5 hours ago              →  │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

---

### 7.2 Spawns List Screen
**Route:** `/production/spawns`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Spawns            🔍  [+]  │
├─────────────────────────────────┤
│ [All] [Active] [Hatched] [Dead] │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ SP-2024-048       [Active]  │ │
│ │ Spawned: 02/12/2024         │ │
│ │ 95,000 eggs • Day 1         │ │
│ │ BF-001 × BM-002          →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ SP-2024-047    [Swim-Up]    │ │
│ │ Spawned: 28/11/2024         │ │
│ │ 82,000 fry • Day 5          │ │
│ │ BF-003 × BM-001          →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ SP-2024-046    [Completed]  │ │
│ │ Spawned: 25/11/2024         │ │
│ │ 75,000 → BATCH-2024-046     │ │
│ │ BF-002 × BM-003          →  │ │
│ └─────────────────────────────┘ │
│                                 │
│         [Load More]             │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Top right: Search icon + Add button ([+])
- Filter tabs: All, Active, Hatched, Dead
- Active count badge on filter tabs
- Each spawn card shows:
  - Spawn code (bold)
  - Status badge (colored by stage)
  - Spawn date
  - Egg/fry count + days since spawn
  - Broodstock codes used
  - Right arrow for details
- Sort: Most recent first
- Pull-to-refresh
- Infinite scroll with "Load More"
- Empty state: "No spawns yet. Tap + to create your first spawn."

**Spawn Status Colors:**
```
Fertilized:   Blue
Hatched:      Green
Swim-Up:      Cyan
Completed:    Gray
Dead:         Red
```

---

### 7.3 Spawn Details Screen
**Route:** `/production/spawns/:spawn_id`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  SP-2024-048       ⋯  ✏️    │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │       [Swim-Up]             │ │
│ │      Day 5 of 10            │ │
│ │    ████████░░  80%          │ │
│ └─────────────────────────────┘ │
│                                 │
│ TIMELINE                        │
│ ┌─────────────────────────────┐ │
│ │ ● Swim-Up Stage             │ │
│ │ │ 02/12/2024, 14:30         │ │
│ │ │ Count: 82,000 fry         │ │
│ │ │ Survival: 86%             │ │
│ │ │                           │ │
│ │ ● Hatched                   │ │
│ │ │ 30/11/2024, 22:00         │ │
│ │ │ Hatch rate: 92%           │ │
│ │ │ 87,400 hatched            │ │
│ │ │                           │ │
│ │ ● Fertilization Confirmed   │ │
│ │ │ 29/11/2024, 06:00         │ │
│ │ │ Fertilization: 95%        │ │
│ │ │ Eggs: 95,000              │ │
│ │ │                           │ │
│ │ ● Stripping Completed       │ │
│ │ │ 28/11/2024, 19:30         │ │
│ │ │ Stripped on time          │ │
│ │ │                           │ │
│ │ ● Spawning Started          │ │
│ │   28/11/2024, 09:00         │ │
│ │   Injected BF-001, BF-002   │ │
│ └─────────────────────────────┘ │
│                                 │
│ BROODSTOCK                      │
│ ┌─────────────────────────────┐ │
│ │ ♀ BF-001 (1.2kg)            │ │
│ │ ♀ BF-002 (1.4kg)            │ │
│ │ ♂ BM-001 (800g)             │ │
│ │ ♂ BM-002 (900g)             │ │
│ └─────────────────────────────┘ │
│                                 │
│ PERFORMANCE                     │
│ ┌──────────┬──────────────────┐ │
│ │ Hatch    │ Survival Rate    │ │
│ │ Rate     │ (to swim-up)     │ │
│ │ 92%      │ 86%              │ │
│ ├──────────┼──────────────────┤ │
│ │ Egg      │ Duration         │ │
│ │ Count    │ (so far)         │ │
│ │ 95,000   │ 5 days           │ │
│ └──────────┴──────────────────┘ │
│                                 │
│ LINKED BATCH                    │
│ ┌─────────────────────────────┐ │
│ │ Not yet created             │ │
│ │ [Create Batch]              │ │
│ └─────────────────────────────┘ │
│                                 │
│ NOTES                           │
│ ┌─────────────────────────────┐ │
│ │ Weather favorable. Excellent│ │
│ │ hatch rate achieved.        │ │
│ └─────────────────────────────┘ │
│                                 │
│  [Add Update]  [View Batch]    │
│                                 │
└─────────────────────────────────┘
```

**Components:**
- Top bar: Back, spawn code, more menu, edit
- Status card: Current stage, days, progress bar
- Timeline: Vertical timeline with all updates
  - Most recent on top
  - Colored dots by stage
  - Expandable for full details
  - Photos if uploaded
- Broodstock card: Lists all fish used
  - Tap code to view broodstock details
- Performance metrics: 2×2 grid
- Linked batch: Shows batch or "Create Batch" button
- Notes: Read-only, editable via edit icon
- Action buttons:
  - "Add Update": Opens modal for new stage update
  - "View Batch": Navigates to batch (if created)

---

### 7.4 New Spawn Form
**Route:** `/production/spawns/new`

**Multi-step Form (3 steps):**

**Step 1: Basic Details**
```
┌─────────────────────────────────┐
│ [×]  New Spawn           Step 1/3│
├─────────────────────────────────┤
│                                 │
│ SPAWN DETAILS                   │
│                                 │
│ Spawn Date *                    │
│ ┌──────────────────────────┐   │
│ │ 📅 02/12/2024            │   │
│ └──────────────────────────┘   │
│                                 │
│ Injection Time *                │
│ ┌──────────────────────────┐   │
│ │ 🕐 20:00                 │   │
│ └──────────────────────────┘   │
│                                 │
│ Expected Stripping Time         │
│ ┌──────────────────────────┐   │
│ │ 03/12/2024, 06:00        │   │
│ │ (Auto-calculated)        │   │
│ └──────────────────────────┘   │
│                                 │
│ Hormone Type                    │
│ ┌──────────────────────────┐   │
│ │ Ovaprim             ▼    │   │
│ └──────────────────────────┘   │
│                                 │
│          [Cancel]  [Next →]    │
│                                 │
└─────────────────────────────────┘
```

**Step 2: Select Broodstock**
```
┌─────────────────────────────────┐
│ [←]  New Spawn           Step 2/3│
├─────────────────────────────────┤
│                                 │
│ SELECT BROODSTOCK               │
│                                 │
│ Females (Select 2) *            │
│ ┌─────────────────────────────┐ │
│ │ ☑ BF-001 (1.2kg) •12 uses  │ │
│ │ ☑ BF-002 (1.4kg) • 8 uses  │ │
│ │ ☐ BF-003 (1.1kg) •15 uses  │ │
│ │ ☐ BF-005 (1.3kg) • 5 uses  │ │
│ └─────────────────────────────┘ │
│                                 │
│ Males (Select 2) *              │
│ ┌─────────────────────────────┐ │
│ │ ☑ BM-001 (800g) • 20 uses  │ │
│ │ ☑ BM-002 (900g) • 15 uses  │ │
│ │ ☐ BM-003 (750g) • 18 uses  │ │
│ │ ☐ BM-004 (850g) • 10 uses  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ESTIMATED EGGS                  │
│ ┌─────────────────────────────┐ │
│ │ Based on female weights:    │ │
│ │ ~130,000 eggs expected      │ │
│ └─────────────────────────────┘ │
│                                 │
│        [← Back]  [Next →]      │
│                                 │
└─────────────────────────────────┘
```

**Step 3: Review & Confirm**
```
┌─────────────────────────────────┐
│ [←]  New Spawn           Step 3/3│
├─────────────────────────────────┤
│                                 │
│ REVIEW SPAWN DETAILS            │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Date: 02/12/2024            │ │
│ │ Injection: 20:00            │ │
│ │ Stripping: 03/12, 06:00     │ │
│ │ Hormone: Ovaprim            │ │
│ │                             │ │
│ │ Females:                    │ │
│ │ • BF-001 (1.2kg)            │ │
│ │ • BF-002 (1.4kg)            │ │
│ │                             │ │
│ │ Males:                      │ │
│ │ • BM-001 (800g)             │ │
│ │ • BM-002 (900g)             │ │
│ │                             │ │
│ │ Estimated: ~130,000 eggs    │ │
│ └─────────────────────────────┘ │
│                                 │
│ NOTES (Optional)                │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │ Add any observations...     │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ REMINDERS                       │
│ ☐ Remind at stripping time     │
│ ☐ Auto-create batch at swim-up │
│                                 │
│        [← Back]  [Create]      │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Progress indicator at top (Step X/3)
- Required fields marked with *
- Auto-calculations:
  - Stripping time (+10 hours from injection)
  - Egg estimate (female weight × 50,000/kg)
  - Hormone dosage (if configured)
- Validation:
  - Must select exactly 2 females and 2 males
  - Can't select same broodstock twice
  - Date can't be in past
  - Times must be logical
- Can go back to edit previous steps
- Auto-save draft every 30 seconds
- On success: Toast "Spawn created!" → Navigate to spawn details

---

### 7.5 Batches List Screen
**Route:** `/production/batches`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Batches           🔍  [+]  │
├─────────────────────────────────┤
│ [All] [Active] [Ready] [Sold]   │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ BATCH-2024-046   [Juvenile] │ │
│ │ 28,000 @ 8.2g • Day 45      │ │
│ │ Tank: IBC-3 • Feed: 2.0mm   │ │
│ │ ████████████░  85% →        │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ BATCH-2024-045   [Ready]    │ │
│ │ 15,000 @ 15.5g • Day 67     │ │
│ │ Tank: TOP-1 • Market size   │ │
│ │ ████████████████ 100% →     │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ BATCH-2024-044   [Fry]      │ │
│ │ 52,000 @ 1.2g • Day 18      │ │
│ │ Tank: IBC-1 • Feed: Moina   │ │
│ │ ████░░░░░░░░  28% →         │ │
│ └─────────────────────────────┘ │
│                                 │
│         [Load More]             │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Filter tabs: All, Active, Ready (market size), Sold
- Each batch card:
  - Batch code + stage badge
  - Count @ average weight
  - Days since creation
  - Current tank
  - Current feed type
  - Progress bar (% to market size or target)
  - Tap: View batch details
- Sort: Most recent first or by size/readiness
- Search: By batch code, tank, date range
- Empty state: "No batches yet"

---

### 7.6 Batch Details Screen
**Route:** `/production/batches/:batch_id`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  BATCH-2024-046    ⋯  ✏️    │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │     [Juvenile Stage]        │ │
│ │     28,000 fish @ 8.2g      │ │
│ │        Day 45               │ │
│ └─────────────────────────────┘ │
│                                 │
│ CURRENT STATUS                  │
│ ┌─────────────────────────────┐ │
│ │ Tank: IBC-3                 │ │
│ │ Feed: 2.0mm Pellets         │ │
│ │ FCR: 1.45                   │ │
│ │ Survival: 93%               │ │
│ └─────────────────────────────┘ │
│                                 │
│ GROWTH PROGRESS                 │
│ ┌─────────────────────────────┐ │
│ │ Target: 15g (market size)   │ │
│ │ ███████░░░░  55%            │ │
│ │ Current: 8.2g               │ │
│ │ Estimated: 22 days to reach │ │
│ └─────────────────────────────┘ │
│                                 │
│ MOVEMENT HISTORY                │
│ ┌─────────────────────────────┐ │
│ │ ● IBC-3 (Current)           │ │
│ │   Since: 25/11/2024         │ │
│ │   At transfer: 6.1g         │ │
│ │                             │ │
│ │ ● IBC-1                     │ │
│ │   18/11 - 25/11 (7 days)    │ │
│ │   Grew: 2.5g → 6.1g         │ │
│ │                             │ │
│ │ ● Created from SP-2024-042  │ │
│ │   18/11/2024 • 30,000 fry   │ │
│ └─────────────────────────────┘ │
│                                 │
│ RECENT SAMPLES                  │
│ ┌─────────────────────────────┐ │
│ │ 02/12 • 8.2g avg • 27,800  │ │
│ │ 28/11 • 7.1g avg • 28,000  │ │
│ │ 22/11 • 6.1g avg • 28,500  │ │
│ └─────────────────────────────┘ │
│                                 │
│ FEEDING SUMMARY                 │
│ ┌─────────────────────────────┐ │
│ │ This Week: 45.2kg fed       │ │
│ │ Daily: ~6.5kg               │ │
│ │ FCR: 1.45                   │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Transfer] [Sample] [Sell]     │
│                                 │
└─────────────────────────────────┘
```

**Action Buttons:**
1. **Transfer:** Opens transfer form (move to different tank)
2. **Sample:** Opens sampling form (weigh & count fish)
3. **Sell:** Opens sales form pre-filled with batch

---

### 7.7 Tanks List Screen
**Route:** `/production/tanks`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Tanks             🔍  [+]  │
├─────────────────────────────────┤
│ [All] [IBC] [Tarpaulin] [Trough]│
│                                 │
│ ┌─────────────────────────────┐ │
│ │ IBC-3           [In Use]    │ │
│ │ IBC Tote Section            │ │
│ │ 600L • 70% capacity         │ │
│ │ ████████████░░  82%         │ │
│ │ 28,000 fish • BATCH-046  →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ TOP-1           [In Use]    │ │
│ │ Tarpaulin Pond              │ │
│ │ 3000L • 75% capacity        │ │
│ │ ██████████░░░  68%          │ │
│ │ 38,000 fish • BATCH-045  →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ IBC-1           [Empty]     │ │
│ │ IBC Tote Section            │ │
│ │ 600L • Available            │ │
│ │ ░░░░░░░░░░░░   0%           │ │
│ │ Last cleaned: 01/12      →  │ │
│ └─────────────────────────────┘ │
│                                 │
│         [Load More]             │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Filter by tank type: All, IBC, Tarpaulin, Trough, Other
- Each tank card shows:
  - Tank code + status badge
  - Tank type
  - Capacity (liters)
  - Stocking percentage
  - Visual progress bar
  - Current batch (if any)
  - Last activity
- Color coding:
  - Green (0-70%): Good
  - Orange (71-85%): Getting full
  - Red (86-100%): Overstocked
  - Gray: Empty
- Tap: View tank details

---

### 7.8 Tank Details Screen
**Route:** `/production/tanks/:tank_id`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  IBC-3                 ⋯  ✏️│
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ IBC Tote Section            │ │
│ │ 600L Capacity               │ │
│ │ Location: North Section     │ │
│ └─────────────────────────────┘ │
│                                 │
│ CURRENT STOCKING                │
│ ┌─────────────────────────────┐ │
│ │ BATCH-2024-046   [Juvenile] │ │
│ │ 28,000 fish @ 8.2g          │ │
│ │ Stocked: 25/11/2024         │ │
│ │ Days in tank: 7             │ │
│ │ ████████████░░  82% full    │ │
│ └─────────────────────────────┘ │
│                                 │
│ TANK PARAMETERS                 │
│ ┌──────────┬──────────────────┐ │
│ │ Water    │ Optimal          │ │
│ │ Temp     │ 28.5°C           │ │
│ ├──────────┼──────────────────┤ │
│ │ pH       │ DO               │ │
│ │ 7.2      │ 6.8 mg/L         │ │
│ └──────────┴──────────────────┘ │
│                                 │
│ STOCKING HISTORY                │
│ ┌─────────────────────────────┐ │
│ │ ● BATCH-046 (Current)       │ │
│ │   Since: 25/11/2024         │ │
│ │   28,000 @ 8.2g             │ │
│ │                             │ │
│ │ ● BATCH-043                 │ │
│ │   15/11 - 24/11             │ │
│ │   35,000 → Sold             │ │
│ │                             │ │
│ │ ● Maintenance               │ │
│ │   10/11 - 14/11             │ │
│ │   Deep cleaned              │ │
│ └─────────────────────────────┘ │
│                                 │
│ MAINTENANCE LOG                 │
│ ┌─────────────────────────────┐ │
│ │ Last Cleaned: 01/12/2024    │ │
│ │ Last Repair: N/A            │ │
│ │ Next Service: 15/12/2024    │ │
│ └─────────────────────────────┘ │
│                                 │
│  [Log Parameters]  [Clean]     │
│                                 │
└─────────────────────────────────┘
```

---

## 8. SALES MODULE

### 8.1 Sales List Screen
**Route:** `/sales`
**Bottom Nav:** "Sales" active

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Sales             🔍  [+]  │
├─────────────────────────────────┤
│ [All] [Pending] [Delivered] [Paid]│
│                                 │
│ ┌─────────────────────────────┐ │
│ │ SALE-2024-157    [Delivered]│ │
│ │ Mrs. Ngozi Okafor           │ │
│ │ 15,000 @ 8g • ₦600,000      │ │
│ │ 02/12/2024 • Paid        →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ SALE-2024-156    [Pending]  │ │
│ │ Mr. Ibrahim Sule            │ │
│ │ 20,000 @ 10g • ₦1,200,000   │ │
│ │ 01/12/2024 • Not paid    →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ SALE-2024-155    [Cancelled]│ │
│ │ Mrs. Ada Nwosu              │ │
│ │ 10,000 @ 6g • ₦300,000      │ │
│ │ 28/11/2024               →  │ │
│ └─────────────────────────────┘ │
│                                 │
│ WEEKLY SUMMARY                  │
│ ┌─────────────────────────────┐ │
│ │ This Week: ₦2,450,000       │ │
│ │ 8 sales • 125,000 fish      │ │
│ └─────────────────────────────┘ │
│                                 │
│         [Load More]             │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Filter tabs: All, Pending, Delivered, Paid, Cancelled
- Each sale card:
  - Sale code + status badge
  - Customer name
  - Quantity @ size • Total amount
  - Date • Payment status
  - Tap: View sale details
- Weekly summary at bottom
- Search: Customer name, sale code, date
- Sort: Most recent first, by amount, by status

---

### 8.2 New Sale Form
**Route:** `/sales/new`

**Layout (Single Page Form):**
```
┌─────────────────────────────────┐
│ [×]  New Sale                   │
├─────────────────────────────────┤
│                                 │
│ CUSTOMER *                      │
│ ┌──────────────────────────┐   │
│ │ Select customer      ▼   │   │
│ └──────────────────────────┘   │
│ [+ Add New Customer]            │
│                                 │
│ SALE DATE *                     │
│ ┌──────────────────────────┐   │
│ │ 📅 02/12/2024            │   │
│ └──────────────────────────┘   │
│                                 │
│ DELIVERY DATE                   │
│ ┌──────────────────────────┐   │
│ │ 📅 05/12/2024            │   │
│ └──────────────────────────┘   │
│                                 │
│ ITEMS                           │
│ ┌─────────────────────────────┐ │
│ │ Batch *                     │ │
│ │ ┌────────────────────────┐  │ │
│ │ │ BATCH-2024-046     ▼   │  │ │
│ │ └────────────────────────┘  │ │
│ │                             │ │
│ │ Quantity *                  │ │
│ │ ┌────────────────────────┐  │ │
│ │ │ [-]   15,000      [+]  │  │ │
│ │ └────────────────────────┘  │ │
│ │ Available: 28,000           │ │
│ │                             │ │
│ │ Price per fish (₦) *        │ │
│ │ ┌────────────────────────┐  │ │
│ │ │ 40.00                  │  │ │
│ │ └────────────────────────┘  │ │
│ │                             │ │
│ │ Subtotal: ₦600,000          │ │
│ └─────────────────────────────┘ │
│ [+ Add Another Batch]           │
│                                 │
│ PAYMENT                         │
│ ┌──────────────────────────┐   │
│ │ Method                   │   │
│ │ ○ Cash  ○ Transfer  ○ POS│   │
│ └──────────────────────────┘   │
│                                 │
│ Payment Status                  │
│ ┌──────────────────────────┐   │
│ │ ○ Paid  ○ Pending        │   │
│ └──────────────────────────┘   │
│                                 │
│ NOTES (Optional)                │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │ Add delivery instructions   │ │
│ │ or special notes...         │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ TOTAL: ₦600,000             │ │
│ └─────────────────────────────┘ │
│                                 │
│    [Cancel]  [Create Sale]     │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Customer dropdown: Searchable list of existing customers
- "+ Add New Customer" opens inline form or modal
- Batch dropdown: Shows only batches with available stock
- Quantity: Number input with +/- buttons
  - Shows available quantity
  - Validates: Can't exceed available
- Price: Auto-fills from customer's default or last price
  - Manual override allowed
- Multiple batches: Can add multiple line items
- Subtotal calculation: Quantity × Price
- Total: Sum of all line items
- Payment method: Radio buttons (Cash, Bank Transfer, POS)
- Payment status: Paid or Pending
- Validation:
  - Customer required
  - At least one batch required
  - Quantity must be > 0 and ≤ available
  - Price must be > 0
- On success: Creates sale → Reduces batch stock → Shows success toast → Navigate to sale details

---

### 8.3 Sale Details Screen
**Route:** `/sales/:sale_id`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  SALE-2024-157     ⋯  ✏️    │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │       [Delivered]           │ │
│ │      ₦600,000               │ │
│ └─────────────────────────────┘ │
│                                 │
│ CUSTOMER                        │
│ ┌─────────────────────────────┐ │
│ │ Mrs. Ngozi Okafor           │ │
│ │ 📱 08012345678              │ │
│ │ 📍 Gwarinpa, Abuja          │ │
│ │ [View Profile]              │ │
│ └─────────────────────────────┘ │
│                                 │
│ SALE DETAILS                    │
│ ┌─────────────────────────────┐ │
│ │ Sale Date: 02/12/2024       │ │
│ │ Delivery: 05/12/2024        │ │
│ │ Payment: Bank Transfer      │ │
│ │ Status: Paid ✓              │ │
│ └─────────────────────────────┘ │
│                                 │
│ ITEMS                           │
│ ┌─────────────────────────────┐ │
│ │ BATCH-2024-046              │ │
│ │ 15,000 fish @ 8g            │ │
│ │ ₦40.00 each                 │ │
│ │ Subtotal: ₦600,000          │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ TOTAL SALE: ₦600,000        │ │
│ └─────────────────────────────┘ │
│                                 │
│ DELIVERY NOTES                  │
│ ┌─────────────────────────────┐ │
│ │ Deliver to farm gate.       │ │
│ │ Customer will pick up.      │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Mark Delivered] [Record Payment]│
│                                 │
└─────────────────────────────────┘
```

**Action Buttons (Conditional):**
- If status = "Pending": Show "Mark Delivered"
- If payment = "Pending": Show "Record Payment"
- If both complete: No action buttons needed
- More menu (⋯): Export receipt, Cancel sale, Edit

---

## 9. CUSTOMERS MODULE

### 9.1 Customers List Screen
**Route:** `/customers`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Customers         🔍  [+]  │
├─────────────────────────────────┤
│ [All] [Active] [VIP] [Inactive] │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Mrs. Ngozi Okafor    [VIP]  │ │
│ │ 📱 08012345678              │ │
│ │ 15 purchases • ₦5.2M total  │ │
│ │ Last: 02/12/2024         →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Mr. Ibrahim Sule     [Active]│ │
│ │ 📱 08087654321              │ │
│ │ 8 purchases • ₦2.8M total   │ │
│ │ Last: 28/11/2024         →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Mrs. Ada Nwosu       [Active]│ │
│ │ 📱 08098765432              │ │
│ │ 3 purchases • ₦950K total   │ │
│ │ Last: 15/11/2024         →  │ │
│ └─────────────────────────────┘ │
│                                 │
│         [Load More]             │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Filter: All, Active (purchased in last 3 months), VIP (>₦2M lifetime), Inactive
- Each customer card:
  - Name + tier badge
  - Phone number
  - Purchase count + lifetime value
  - Last purchase date
  - Tap: View customer details
- Search: Name, phone number
- Sort: By last purchase, by total value, alphabetically

---

### 9.2 Customer Details Screen
**Route:** `/customers/:customer_id`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Customer              ⋯  ✏️│
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Mrs. Ngozi Okafor           │ │
│ │ [VIP Customer]              │ │
│ └─────────────────────────────┘ │
│                                 │
│ CONTACT INFO                    │
│ ┌─────────────────────────────┐ │
│ │ 📱 08012345678              │ │
│ │ 📧 ngozi@example.com        │ │
│ │ 📍 23 Aliyu Musdafa St,     │ │
│ │    Gwarinpa, Abuja          │ │
│ └─────────────────────────────┘ │
│                                 │
│ PURCHASE SUMMARY                │
│ ┌──────────┬──────────────────┐ │
│ │ Total    │ Average          │ │
│ │ Purchases│ Per Sale         │ │
│ │ 15       │ ₦346,667         │ │
│ ├──────────┼──────────────────┤ │
│ │ Lifetime │ Last             │ │
│ │ Value    │ Purchase         │ │
│ │ ₦5.2M    │ 2 days ago       │ │
│ └──────────┴──────────────────┘ │
│                                 │
│ PREFERRED SPECS                 │
│ ┌─────────────────────────────┐ │
│ │ Size: 8-10g                 │ │
│ │ Quantity: 15,000-20,000     │ │
│ │ Delivery: Farm pickup       │ │
│ │ Payment: Bank transfer      │ │
│ └─────────────────────────────┘ │
│                                 │
│ RECENT PURCHASES                │
│ ┌─────────────────────────────┐ │
│ │ SALE-2024-157               │ │
│ │ 02/12/2024 • ₦600,000       │ │
│ │ 15,000 @ 8g              →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ SALE-2024-142               │ │
│ │ 15/11/2024 • ₦800,000       │ │
│ │ 20,000 @ 10g             →  │ │
│ └─────────────────────────────┘ │
│                  [View All]     │
│                                 │
│ NOTES                           │
│ ┌─────────────────────────────┐ │
│ │ Reliable customer. Prefers  │ │
│ │ weekend deliveries.         │ │
│ └─────────────────────────────┘ │
│                                 │
│    [New Sale]  [Call]  [SMS]   │
│                                 │
└─────────────────────────────────┘
```

---

## 10. FEED MANAGEMENT MODULE

### 10.1 Feed Inventory Screen
**Route:** `/feed/inventory`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Feed Inventory        [+]  │
├─────────────────────────────────┤
│ [All] [Pellets] [Live] [Plant]  │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 2.0mm Pellets      [In Stock]│ │
│ │ Current: 145kg              │ │
│ │ Reorder: 100kg              │ │
│ │ ████████░░  72%          →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 3.0mm Pellets      [Low]    │ │
│ │ Current: 45kg               │ │
│ │ Reorder: 100kg              │ │
│ │ ██░░░░░░░░  28%          →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Artemia (Live)     [OK]     │ │
│ │ Current: 2.5kg              │ │
│ │ Reorder: 1.0kg              │ │
│ │ ████████████ 100%        →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Duckweed (Plant)   [Growing]│ │
│ │ Pond 1: Ready in 3 days     │ │
│ │ Estimated: 15kg          →  │ │
│ └─────────────────────────────┘ │
│                                 │
│ WEEKLY SUMMARY                  │
│ ┌─────────────────────────────┐ │
│ │ Total Fed: 285kg            │ │
│ │ Cost: ₦142,500              │ │
│ │ Average FCR: 1.38           │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Filter: All, Commercial Pellets, Live Feed, Plant Feed
- Each feed card:
  - Feed type + status badge
  - Current stock
  - Reorder level
  - Progress bar (color-coded)
  - Tap: View feed details
- Status badges:
  - In Stock (Green): Above reorder level
  - Low (Orange): At or below reorder level
  - Out (Red): Zero stock
  - Growing (Blue): Plant feed in production
- Weekly summary at bottom
- [+] button: Add new feed type or log purchase

---

### 10.2 Feed Details Screen
**Route:** `/feed/:feed_id`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  2.0mm Pellets         ⋯  ✏️│
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Current Stock: 145kg        │ │
│ │ Reorder Level: 100kg        │ │
│ │ Status: [In Stock]          │ │
│ └─────────────────────────────┘ │
│                                 │
│ FEED INFO                       │
│ ┌─────────────────────────────┐ │
│ │ Type: Commercial Pellets    │ │
│ │ Size: 2.0mm                 │ │
│ │ Protein: 42%                │ │
│ │ Supplier: Coppens           │ │
│ │ Cost: ₦500/kg               │ │
│ └─────────────────────────────┘ │
│                                 │
│ USAGE THIS MONTH                │
│ ┌─────────────────────────────┐ │
│ │ Total Fed: 185kg            │ │
│ │ Average Daily: 6.2kg        │ │
│ │ Cost: ₦92,500               │ │
│ └─────────────────────────────┘ │
│                                 │
│ RECENT PURCHASES                │
│ ┌─────────────────────────────┐ │
│ │ 15/11/2024 • 100kg          │ │
│ │ ₦50,000 • Supplier: Coppens │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 01/11/2024 • 100kg          │ │
│ │ ₦50,000 • Supplier: Coppens │ │
│ └─────────────────────────────┘ │
│                                 │
│ RECENT FEEDINGS                 │
│ ┌─────────────────────────────┐ │
│ │ 02/12 • 6.5kg • IBC-3       │ │
│ │ 01/12 • 6.2kg • IBC-3       │ │
│ │ 30/11 • 6.0kg • IBC-3       │ │
│ └─────────────────────────────┘ │
│                  [View All]     │
│                                 │
│  [Log Feeding]  [Record Purchase]│
│                                 │
└─────────────────────────────────┘
```

---

## 11. FINANCIAL MODULE

### 11.1 Expenses List Screen
**Route:** `/finance/expenses`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Expenses          🔍  [+]  │
├─────────────────────────────────┤
│ [All] [Feed] [Labor] [Equipment]│
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Feed Purchase     [Feed]    │ │
│ │ 100kg 2.0mm Pellets         │ │
│ │ 02/12/2024 • ₦50,000     →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Staff Salary      [Labor]   │ │
│ │ Farm Manager - November     │ │
│ │ 01/12/2024 • ₦80,000     →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Equipment Repair  [Equip]   │ │
│ │ Water pump maintenance      │ │
│ │ 28/11/2024 • ₦15,000     →  │ │
│ └─────────────────────────────┘ │
│                                 │
│ WEEKLY SUMMARY                  │
│ ┌─────────────────────────────┐ │
│ │ This Week: ₦185,500         │ │
│ │ Feed: ₦100,000 (54%)        │ │
│ │ Labor: ₦80,000 (43%)        │ │
│ │ Other: ₦5,500 (3%)          │ │
│ └─────────────────────────────┘ │
│                                 │
│         [Load More]             │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Filter by category: All, Feed, Labor, Equipment, Utilities, Other
- Each expense card:
  - Title + category badge
  - Description
  - Date + amount
  - Tap: View expense details
- Weekly summary: Total + breakdown by category (% pie chart)
- [+]: Add new expense
- Search: Description, date range

---

### 11.2 Financial Dashboard
**Route:** `/finance/dashboard`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Financials            📅   │
├─────────────────────────────────┤
│ PERIOD: December 2024           │
│                                 │
│ SUMMARY                         │
│ ┌──────────┬──────────────────┐ │
│ │ Revenue  │ Expenses         │ │
│ │ ₦2.4M    │ ₦985K            │ │
│ ├──────────┼──────────────────┤ │
│ │ Profit   │ Margin           │ │
│ │ ₦1.415M  │ 59%              │ │
│ └──────────┴──────────────────┘ │
│                                 │
│ REVENUE BREAKDOWN               │
│ ┌─────────────────────────────┐ │
│ │ Sales: ₦2.4M (100%)         │ │
│ │ ████████████████            │ │
│ │ • Fingerlings: ₦1.8M (75%)  │ │
│ │ • Juveniles: ₦600K (25%)    │ │
│ └─────────────────────────────┘ │
│                                 │
│ EXPENSE BREAKDOWN               │
│ ┌─────────────────────────────┐ │
│ │ Total: ₦985K                │ │
│ │                             │ │
│ │ Feed: ₦450K (46%)           │ │
│ │ ████████░░░░░░░░            │ │
│ │                             │ │
│ │ Labor: ₦320K (32%)          │ │
│ │ ██████░░░░░░░░░░            │ │
│ │                             │ │
│ │ Equipment: ₦150K (15%)      │ │
│ │ ███░░░░░░░░░░░░░            │ │
│ │                             │ │
│ │ Other: ₦65K (7%)            │ │
│ │ █░░░░░░░░░░░░░░░            │ │
│ └─────────────────────────────┘ │
│                                 │
│ TOP CUSTOMERS                   │
│ ┌─────────────────────────────┐ │
│ │ 1. Mrs. Ngozi • ₦800K       │ │
│ │ 2. Mr. Ibrahim • ₦600K      │ │
│ │ 3. Mrs. Ada • ₦400K         │ │
│ └─────────────────────────────┘ │
│                                 │
│ [View Full Report]              │
│                                 │
└─────────────────────────────────┘
```

---

## 12. BROODSTOCK MODULE

### 12.1 Broodstock List Screen
**Route:** `/broodstock`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Broodstock        🔍  [+]  │
├─────────────────────────────────┤
│ [All] [Female] [Male] [Retired] │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ BF-001          ♀ [Active]  │ │
│ │ 1.2kg • Age: 18 months      │ │
│ │ Uses: 12 • Last: 28/11      │ │
│ │ Performance: 95% ✓       →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ BF-002          ♀ [Active]  │ │
│ │ 1.4kg • Age: 20 months      │ │
│ │ Uses: 8 • Last: 28/11       │ │
│ │ Performance: 88%         →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ BM-001          ♂ [Active]  │ │
│ │ 800g • Age: 16 months       │ │
│ │ Uses: 20 • Last: 02/12      │ │
│ │ Performance: 92%         →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ BF-005          ♀ [Rest]    │ │
│ │ 1.3kg • Age: 22 months      │ │
│ │ Uses: 15 • Last: 15/11      │ │
│ │ Next use: 29/12 (27 days)→  │ │
│ └─────────────────────────────┘ │
│                                 │
│         [Load More]             │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Filter: All, Female, Male, Retired, Resting
- Each broodstock card:
  - Code + sex symbol + status badge
  - Weight + age
  - Usage count + last spawn date
  - Performance rating (avg success rate)
  - Tap: View broodstock details
- Status badges:
  - Active (Green): Available for spawning
  - Rest (Orange): In rest period (< 45 days since last use)
  - Retired (Gray): No longer used for spawning
- Sort: By performance, by last use, by age
- [+]: Add new broodstock

---

### 12.2 Broodstock Details Screen
**Route:** `/broodstock/:broodstock_id`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  BF-001                ⋯  ✏️│
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ ♀ Female • [Active]         │ │
│ │ 1.2kg • 18 months old       │ │
│ └─────────────────────────────┘ │
│                                 │
│ DETAILS                         │
│ ┌─────────────────────────────┐ │
│ │ Source: Local hatchery      │ │
│ │ Acquired: 15/06/2023        │ │
│ │ Tank: BROOD-1               │ │
│ │ Current Weight: 1.2kg       │ │
│ │ Last Weighed: 01/12/2024    │ │
│ └─────────────────────────────┘ │
│                                 │
│ SPAWNING HISTORY                │
│ ┌─────────────────────────────┐ │
│ │ Total Uses: 12              │ │
│ │ Last Spawn: 28/11/2024      │ │
│ │ Next Eligible: 12/01/2025   │ │
│ │   (45 days rest period)     │ │
│ │ Average Success: 95%        │ │
│ └─────────────────────────────┘ │
│                                 │
│ RECENT SPAWNS                   │
│ ┌─────────────────────────────┐ │
│ │ SP-2024-047 • 28/11/2024    │ │
│ │ 90,000 eggs • 92% hatch  →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ SP-2024-042 • 13/11/2024    │ │
│ │ 95,000 eggs • 95% hatch  →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ SP-2024-038 • 28/10/2024    │ │
│ │ 88,000 eggs • 90% hatch  →  │ │
│ └─────────────────────────────┘ │
│                  [View All]     │
│                                 │
│ HEALTH NOTES                    │
│ ┌─────────────────────────────┐ │
│ │ Healthy. No issues.         │ │
│ └─────────────────────────────┘ │
│                                 │
│   [Update Weight]  [Add Note]  │
│                                 │
└─────────────────────────────────┘
```

---

## 13. HEALTH & OBSERVATIONS MODULE

### 13.1 Health Logs Screen
**Route:** `/health`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Health Logs           [+]  │
├─────────────────────────────────┤
│ [All] [Urgent] [Normal] [Resolved]│
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Mortality Spike   [Urgent]  │ │
│ │ IBC-3 • BATCH-2024-046      │ │
│ │ 500 fish dead overnight     │ │
│ │ 02/12/2024, 06:00        →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Low Dissolved O2  [Normal]  │ │
│ │ TOP-1 • BATCH-2024-045      │ │
│ │ DO: 4.2 mg/L (low)          │ │
│ │ 01/12/2024, 18:00        →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Behavior Change   [Normal]  │ │
│ │ IBC-1 • BATCH-2024-044      │ │
│ │ Fish gasping at surface     │ │
│ │ 28/11/2024, 14:30        →  │ │
│ └─────────────────────────────┘ │
│                                 │
│         [Load More]             │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Filter: All, Urgent (needs immediate action), Normal (monitoring), Resolved
- Each health log card:
  - Issue type + severity badge
  - Tank + batch affected
  - Description
  - Date/time logged
  - Tap: View log details
- Severity colors:
  - Urgent (Red): High mortality, disease signs
  - Normal (Orange): Minor issues, preventive
  - Resolved (Green): Issue addressed
- [+]: Log new health observation
- Sort: Most recent first, by severity

---

### 13.2 Log Health Observation Form
**Route:** `/health/new`

**Layout:**
```
┌─────────────────────────────────┐
│ [×]  Log Health Observation     │
├─────────────────────────────────┤
│                                 │
│ AFFECTED AREA *                 │
│ ┌──────────────────────────┐   │
│ │ ○ Tank  ○ Batch  ○ Fish  │   │
│ └──────────────────────────┘   │
│                                 │
│ SELECT TANK *                   │
│ ┌──────────────────────────┐   │
│ │ IBC-3               ▼    │   │
│ └──────────────────────────┘   │
│                                 │
│ OBSERVATION TYPE *              │
│ ┌──────────────────────────┐   │
│ │ Mortality           ▼    │   │
│ └──────────────────────────┘   │
│                                 │
│ SEVERITY *                      │
│ ┌──────────────────────────┐   │
│ │ ○ Normal  ○ Urgent       │   │
│ └──────────────────────────┘   │
│                                 │
│ QUANTITY (if mortality)         │
│ ┌──────────────────────────┐   │
│ │ [-]      500        [+]  │   │
│ └──────────────────────────┘   │
│                                 │
│ DESCRIPTION *                   │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │ Describe what you observed  │ │
│ │ (symptoms, behavior, water  │ │
│ │ parameters, etc.)           │ │
│ │                             │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ SUSPECTED CAUSE (Optional)      │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │ e.g., Low DO, disease,      │ │
│ │ poor water quality...       │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ACTION TAKEN (Optional)         │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │ What did you do to address  │ │
│ │ the issue?                  │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ PHOTOS (Optional)               │
│ [📷 Add Photo]                  │
│                                 │
│    [Cancel]  [Log Observation] │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Affected area: Radio buttons (Tank, Batch, or Individual Fish)
- Based on selection, show relevant dropdown
- Observation types: Mortality, Disease, Behavior, Water Quality, Other
- Severity: Normal (monitoring) or Urgent (immediate action)
- Quantity: For mortality count
- Description: Required, multi-line textarea
- Suspected cause: Optional text
- Action taken: Optional text
- Photos: Optional image upload (max 3)
- On submit: Creates health log → Updates batch mortality count (if applicable) → Shows toast

---

## 14. REPORTS & ANALYTICS

### 14.1 Reports Hub
**Route:** `/reports`
**Bottom Nav:** "Reports" active

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Reports                    │
├─────────────────────────────────┤
│                                 │
│ QUICK STATS (This Month)        │
│ ┌──────────┬──────────────────┐ │
│ │ Revenue  │ Profit           │ │
│ │ ₦2.4M    │ ₦1.4M            │ │
│ ├──────────┼──────────────────┤ │
│ │ Fish     │ Sales            │ │
│ │ Produced │ Completed        │ │
│ │ 287K     │ 8                │ │
│ └──────────┴──────────────────┘ │
│                                 │
│ REPORT CATEGORIES               │
│ ┌──────────┬──────────────────┐ │
│ │    📊    │   PRODUCTION     │ │
│ │          │   Track batches  │ │
│ │          │   and growth  →  │ │
│ └──────────┴──────────────────┘ │
│ ┌──────────┬──────────────────┐ │
│ │    💰    │   FINANCIAL      │ │
│ │          │   Revenue & costs│ │
│ │          │   analysis    →  │ │
│ └──────────┴──────────────────┘ │
│ ┌──────────┬──────────────────┐ │
│ │    🐟    │   SPAWNING       │ │
│ │          │   Success rates  │ │
│ │          │   & trends    →  │ │
│ └──────────┴──────────────────┘ │
│ ┌──────────┬──────────────────┐ │
│ │    📦    │   FEED           │ │
│ │          │   Usage & FCR    │ │
│ │          │   tracking    →  │ │
│ └──────────┴──────────────────┘ │
│ ┌──────────┬──────────────────┐ │
│ │    👥    │   CUSTOMERS      │ │
│ │          │   Sales by       │ │
│ │          │   customer    →  │ │
│ └──────────┴──────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

---

### 14.2 Production Report Screen
**Route:** `/reports/production`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Production Report      📅  │
├─────────────────────────────────┤
│ PERIOD: December 2024           │
│                                 │
│ OVERVIEW                        │
│ ┌──────────┬──────────────────┐ │
│ │ Total    │ Survival         │ │
│ │ Fish     │ Rate             │ │
│ │ 287,000  │ 89%              │ │
│ ├──────────┼──────────────────┤ │
│ │ Active   │ Market           │ │
│ │ Batches  │ Ready            │ │
│ │ 43       │ 8                │ │
│ └──────────┴──────────────────┘ │
│                                 │
│ GROWTH PERFORMANCE              │
│ ┌─────────────────────────────┐ │
│ │ Average Daily Gain: 0.18g   │ │
│ │ Average FCR: 1.42           │ │
│ │ Best Batch: BATCH-046       │ │
│ │   (0.25g/day, FCR 1.28)     │ │
│ └─────────────────────────────┘ │
│                                 │
│ STAGE DISTRIBUTION              │
│ ┌─────────────────────────────┐ │
│ │ Fry: 125K (44%)             │ │
│ │ ██████████░░░░░░            │ │
│ │                             │ │
│ │ Juvenile: 98K (34%)         │ │
│ │ ████████░░░░░░░░            │ │
│ │                             │ │
│ │ Market: 64K (22%)           │ │
│ │ █████░░░░░░░░░░░            │ │
│ └─────────────────────────────┘ │
│                                 │
│ TOP PERFORMING BATCHES          │
│ ┌─────────────────────────────┐ │
│ │ 1. BATCH-046 • 0.25g/day    │ │
│ │ 2. BATCH-045 • 0.22g/day    │ │
│ │ 3. BATCH-044 • 0.20g/day    │ │
│ └─────────────────────────────┘ │
│                                 │
│ MORTALITY ANALYSIS              │
│ ┌─────────────────────────────┐ │
│ │ Total Deaths: 12,500 (4%)   │ │
│ │ Main Causes:                │ │
│ │ • Low DO: 45%               │ │
│ │ • Disease: 30%              │ │
│ │ • Unknown: 25%              │ │
│ └─────────────────────────────┘ │
│                                 │
│  [Export PDF]  [Export Excel]  │
│                                 │
└─────────────────────────────────┘
```

---

## 15. SETTINGS & USER MANAGEMENT

### 15.1 Settings Menu
**Route:** `/settings`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Settings                   │
├─────────────────────────────────┤
│                                 │
│ ACCOUNT                         │
│ ┌─────────────────────────────┐ │
│ │ Profile                  →  │ │
│ │ Change Password          →  │ │
│ │ Notifications            →  │ │
│ └─────────────────────────────┘ │
│                                 │
│ FARM SETTINGS                   │
│ ┌─────────────────────────────┐ │
│ │ Farm Info                →  │ │
│ │ Tank Configuration       →  │ │
│ │ Feed Types               →  │ │
│ │ Customer Defaults        →  │ │
│ └─────────────────────────────┘ │
│                                 │
│ SYSTEM                          │
│ ┌─────────────────────────────┐ │
│ │ User Management          →  │ │
│ │ Backup & Sync            →  │ │
│ │ Data Export              →  │ │
│ │ App Version: 1.0.0       →  │ │
│ └─────────────────────────────┘ │
│                                 │
│ HELP & SUPPORT                  │
│ ┌─────────────────────────────┐ │
│ │ Help Center              →  │ │
│ │ Contact Support          →  │ │
│ │ Terms & Privacy          →  │ │
│ └─────────────────────────────┘ │
│                                 │
│         [LOGOUT]                │
│                                 │
└─────────────────────────────────┘
```

---

### 15.2 Profile Screen
**Route:** `/settings/profile`

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  Profile                    │
├─────────────────────────────────┤
│                                 │
│        [Profile Photo]          │
│        [Change Photo]           │
│                                 │
│ PERSONAL INFO                   │
│ ┌──────────────────────────┐   │
│ │ Full Name                │   │
│ │ Admin User               │   │
│ └──────────────────────────┘   │
│                                 │
│ ┌──────────────────────────┐   │
│ │ Email (Optional)         │   │
│ │ admin@tani.ng            │   │
│ └──────────────────────────┘   │
│                                 │
│ ┌──────────────────────────┐   │
│ │ Phone Number             │   │
│ │ 08012345678              │   │
│ └──────────────────────────┘   │
│                                 │
│ ┌──────────────────────────┐   │
│ │ Role                     │   │
│ │ Farm Owner (Admin)       │   │
│ └──────────────────────────┘   │
│                                 │
│     [Cancel]  [Save Changes]   │
│                                 │
└─────────────────────────────────┘
```

---

### 15.3 User Management Screen
**Route:** `/settings/users`
**Auth:** Admin only

**Layout:**
```
┌─────────────────────────────────┐
│ [←]  User Management       [+]  │
├─────────────────────────────────┤
│                                 │
│ ACTIVE USERS                    │
│ ┌─────────────────────────────┐ │
│ │ Admin User      [Owner]     │ │
│ │ 📱 08012345678              │ │
│ │ Last active: 2 hours ago →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Farm Manager    [Manager]   │ │
│ │ 📱 08087654321              │ │
│ │ Last active: Today       →  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Sales Agent     [Sales]     │ │
│ │ 📱 08098765432              │ │
│ │ Last active: Yesterday   →  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ROLE PERMISSIONS                │
│ ┌─────────────────────────────┐ │
│ │ Owner: Full access          │ │
│ │ Manager: All except users   │ │
│ │ Sales: Sales & customers    │ │
│ │ View: Read-only access      │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**[+] Add New User Form:**
- Name
- Phone number
- Role dropdown (Manager, Sales, View-only)
- Password (auto-generated, sent via SMS)
- On submit: Creates user → Sends credentials → Shows success toast

---

# ============================================================================
# PART 3: IMPLEMENTATION GUIDE
# ============================================================================

## 16. COMPONENT LIBRARY

### 16.1 Reusable Components

**Button Component:**
```jsx
<Button
  variant="primary|secondary|danger|ghost"
  size="small|medium|large"
  icon={IconName}
  iconPosition="left|right"
  loading={boolean}
  disabled={boolean}
  fullWidth={boolean}
>
  Button Text
</Button>
```

**Card Component:**
```jsx
<Card
  variant="default|elevated|outlined"
  padding="small|medium|large"
  hoverable={boolean}
  onClick={function}
>
  Card Content
</Card>
```

**Input Component:**
```jsx
<Input
  type="text|number|tel|email|password"
  label="Label Text"
  placeholder="Placeholder"
  value={value}
  onChange={handler}
  icon={IconName}
  error="Error message"
  required={boolean}
  disabled={boolean}
/>
```

**Badge Component:**
```jsx
<Badge
  variant="active|pending|completed|cancelled"
  size="small|medium|large"
>
  Badge Text
</Badge>
```

**Modal Component:**
```jsx
<Modal
  isOpen={boolean}
  onClose={function}
  title="Modal Title"
  size="small|medium|large"
>
  Modal Content
  <Modal.Footer>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </Modal.Footer>
</Modal>
```

**Toast Component:**
```jsx
toast.success("Success message")
toast.error("Error message")
toast.warning("Warning message")
toast.info("Info message")
```

---

## 17. DATA FLOW & STATES

### 17.1 Loading States

**Page Load:**
```
┌─────────────────────────────────┐
│ [Skeleton Header]               │
├─────────────────────────────────┤
│ [Skeleton Card]                 │
│ [Skeleton Card]                 │
│ [Skeleton Card]                 │
└─────────────────────────────────┘
```

**Button Loading:**
```
[  ⟳  Loading...  ]
```

**Infinite Scroll Loading:**
```
         [Spinner]
    Loading more...
```

### 17.2 Empty States

**No Data:**
```
┌─────────────────────────────────┐
│                                 │
│         [Large Icon]            │
│                                 │
│      No Items Yet               │
│   Get started by creating       │
│   your first item               │
│                                 │
│     [Create Button]             │
│                                 │
└─────────────────────────────────┘
```

**Search No Results:**
```
┌─────────────────────────────────┐
│                                 │
│         [Search Icon]           │
│                                 │
│      No Results Found           │
│   Try adjusting your search     │
│                                 │
│     [Clear Search]              │
│                                 │
└─────────────────────────────────┘
```

### 17.3 Error States

**API Error:**
```
Toast: "Failed to load data. Please try again."
```

**Form Validation Error:**
```
Input with red border + error text below
"This field is required"
```

**Network Error:**
```
┌─────────────────────────────────┐
│                                 │
│      [Offline Icon]             │
│                                 │
│   No Internet Connection        │
│   Check your connection and     │
│   try again                     │
│                                 │
│      [Retry Button]             │
│                                 │
└─────────────────────────────────┘
```

### 17.4 Success States

**Action Success:**
```
Toast: "Spawn created successfully!"
```

**Form Submit Success:**
```
Toast + Navigate to detail view
```

---

## 18. RESPONSIVE BREAKPOINTS

### 18.1 Breakpoint System

```css
/* Mobile First (default) */
@media (min-width: 320px) { /* Small phones */ }
@media (min-width: 375px) { /* Standard phones */ }
@media (min-width: 425px) { /* Large phones */ }

/* Tablet */
@media (min-width: 768px) {
  /* Show side navigation drawer */
  /* Increase grid columns (2 → 3) */
  /* Larger cards and spacing */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full side drawer always visible */
  /* Grid layouts (3 → 4 columns) */
  /* Hover states more prominent */
}

/* Large Desktop */
@media (min-width: 1440px) {
  /* Max width container (1280px) */
  /* Even more spacing */
}
```

### 18.2 Responsive Patterns

**Navigation:**
- Mobile: Bottom nav (always visible)
- Tablet: Side drawer (collapsible) + Bottom nav
- Desktop: Side drawer (always open) + Top bar

**Cards:**
- Mobile: Single column, full width
- Tablet: 2 columns with gaps
- Desktop: 3-4 columns with gaps

**Forms:**
- Mobile: Single column inputs
- Tablet: Some 2-column layouts (e.g., first/last name)
- Desktop: More 2-3 column layouts

**Modals:**
- Mobile: Full screen or bottom sheet
- Tablet: Centered, 90% width
- Desktop: Centered, fixed max width (500px-600px)

---

## 19. PERFORMANCE CONSIDERATIONS

### 19.1 Image Optimization
- Lazy load images (below fold content)
- Compress all photos (max 500KB per image)
- Use WebP format with PNG/JPG fallback
- Implement responsive images (srcset for different screen sizes)

### 19.2 Code Splitting
- Route-based code splitting (lazy load routes)
- Lazy load heavy components (charts, reports)
- Load reports on-demand (not on initial page load)

### 19.3 Caching Strategy
- Cache-first for static assets (images, fonts)
- Network-first for dynamic data (lists, details)
- Stale-while-revalidate for lists (show cached, update in background)

### 19.4 Bundle Size
- Target: <500KB initial load (gzipped)
- Enable Gzip/Brotli compression
- Tree-shake unused code
- Use CDN for common libraries (React, etc.)

### 19.5 Offline Support
- Service worker for offline functionality
- Cache critical screens (dashboard, batch list)
- Queue actions (create spawn, log feed) when offline
- Sync when connection restored
- Show clear online/offline indicator

---

## 20. ACCESSIBILITY REQUIREMENTS

### 20.1 Keyboard Navigation
- All interactive elements focusable with Tab key
- Focus visible (outline on focus)
- Modal traps focus (Tab cycles within modal)
- Escape key closes modals/dropdowns

### 20.2 Screen Reader Support
- Semantic HTML (nav, main, article, section)
- ARIA labels for icon buttons
- ARIA live regions for dynamic updates (toasts)
- Alt text for all images
- Proper heading hierarchy (h1 → h2 → h3)

### 20.3 Color Contrast
- WCAG AA compliance (4.5:1 for text)
- Don't rely on color alone for meaning
- Status badges have text + color
- Links underlined or clearly distinguished

### 20.4 Touch Targets
- Minimum 44×44px for all interactive elements
- Adequate spacing between touch targets (8px minimum)
- Large enough form inputs (44px height)

### 20.5 Forms
- Labels for all inputs
- Error messages linked to inputs (aria-describedby)
- Required fields marked visually (* and aria-required)
- Validation messages clear and helpful

---

# ============================================================================
# IMPLEMENTATION NOTES
# ============================================================================

## Tech Stack Recommendations

**Frontend:**
- React 18+ (UI framework)
- React Router v6 (navigation)
- TailwindCSS (styling)
- Zustand or Redux Toolkit (state management)
- React Query (API calls & caching)
- Workbox (service worker for offline)
- React Hook Form (form handling)

**UI Component Libraries:**
- Radix UI or HeadlessUI (accessible primitives)
- Lucide React (icons)
- Recharts (charts & graphs)
- date-fns (date handling)

**Build Tools:**
- Vite (fast dev server & build)
- TypeScript (type safety)
- ESLint + Prettier (code quality)

**Backend (if needed):**
- Node.js + Express or Fastify
- PostgreSQL (database)
- JWT (authentication)

---

## Development Checklist

**Phase 1: Foundation (Week 1)**
- ✓ Set up project structure
- ✓ Configure routing
- ✓ Build design system (colors, typography, components)
- ✓ Implement authentication (login, logout)
- ✓ Build bottom navigation
- ✓ Create dashboard skeleton

**Phase 2: Core Features (Weeks 2-3)**
- ✓ Dashboard with stats
- ✓ Spawning module (list, create, details)
- ✓ Batch tracking (list, details, sampling)
- ✓ Tank management
- ✓ Basic navigation flows

**Phase 3: Sales & Customers (Week 4)**
- ✓ Sales module (list, create, details)
- ✓ Customer management
- ✓ Payment tracking

**Phase 4: Feed & Finance (Week 5)**
- ✓ Feed inventory
- ✓ Feed logging
- ✓ Expense tracking
- ✓ Financial dashboard

**Phase 5: Advanced Features (Week 6)**
- ✓ Broodstock management
- ✓ Health & observations
- ✓ Reports & analytics
- ✓ Settings & user management

**Phase 6: Polish & Testing (Week 7-8)**
- ✓ Offline support (service worker)
- ✓ Performance optimization
- ✓ Accessibility audit
- ✓ User testing & bug fixes
- ✓ Documentation

---

## Design Handoff Deliverables

**Assets:**
- TaniTrack logo (SVG, multiple sizes)
- App icon (PWA manifest icons: 192×192, 512×512)
- Placeholder images (empty states, onboarding)
- Loading animations (spinners, skeletons)

**Documentation:**
- Component library (Storybook optional)
- API integration guide
- Authentication flow diagram
- Data model & relationships
- Testing strategy
- Deployment guide

---

# END OF WIREFRAME SPECIFICATIONS
# ============================================================================

**Document Status: COMPLETE**

This comprehensive wireframe specification document provides everything needed to build TaniTrack's user interface:

- ✅ Complete design system (colors, typography, spacing, components)
- ✅ All navigation patterns (bottom nav, side drawer, top bar)
- ✅ 50+ screen specifications with detailed layouts
- ✅ All 10+ modules covered (Production, Sales, Customers, Feed, Finance, etc.)
- ✅ Common UI patterns (cards, buttons, forms, modals, toasts)
- ✅ Responsive design guidelines
- ✅ Performance & accessibility requirements
- ✅ Implementation roadmap

**Use this document alongside:**
- Database Schema (SQL tables)
- API Specifications (REST endpoints)

**Ready for development with Claude Code or any frontend team.**

For questions or clarifications, refer to the API Specifications for data structures and the Database Schema for field details.

---

**Total Screens Documented:** 50+
**Total Components:** 15+
**Total Pages:** ~85 pages of specifications

**Status:** Production-ready documentation ✓

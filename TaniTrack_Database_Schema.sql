-- ============================================================================
-- TaniTrack: Hatchery Management System
-- Database Schema v1.0
-- Created: December 2024
-- Company: Tani Nigeria Ltd
-- ============================================================================

-- Database: tanitrack_db
-- PostgreSQL 14+ recommended

-- ============================================================================
-- TABLE OF CONTENTS
-- ============================================================================
-- 1. User Management (users, user_roles)
-- 2. Broodstock Management (broodstock)
-- 3. Spawning Records (spawns, spawn_updates)
-- 4. Tank Management (tanks, tank_stocking)
-- 5. Production Tracking (batches, batch_movements, stage_records)
-- 6. Feed Management (feed_inventory, feed_types, feeding_logs, plant_feed_harvest)
-- 7. Sales & Customers (customers, sales, sale_items)
-- 8. Financial Tracking (expenses, expense_categories, batch_costs)
-- 9. Health & Observations (health_logs, treatments)
-- 10. System & Configuration (app_settings, notifications)

-- ============================================================================
-- ENABLE EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- For UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- For password hashing

-- ============================================================================
-- 1. USER MANAGEMENT
-- ============================================================================

-- User roles: owner, manager, senior_assistant, junior_assistant, guest
CREATE TABLE user_roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO user_roles (role_name, description) VALUES
('owner', 'Full system access, financial data, configuration'),
('manager', 'Full operational access, limited financial data'),
('senior_assistant', 'Create/edit records, no financial access'),
('junior_assistant', 'View and log daily activities only'),
('guest', 'Read-only dashboard and statistics');

-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role_id INTEGER REFERENCES user_roles(role_id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster login queries
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_username ON users(username);

-- ============================================================================
-- 2. BROODSTOCK MANAGEMENT
-- ============================================================================

CREATE TABLE broodstock (
    broodstock_id SERIAL PRIMARY KEY,
    broodstock_code VARCHAR(20) UNIQUE NOT NULL,  -- e.g., 'BF-001', 'BM-001'
    sex VARCHAR(10) NOT NULL CHECK (sex IN ('Male', 'Female')),
    acquisition_date DATE NOT NULL,
    source VARCHAR(100),  -- Purchased, Own Stock, Donated
    initial_weight_kg DECIMAL(5,2),
    current_weight_kg DECIMAL(5,2),
    age_months INTEGER,
    total_spawns INTEGER DEFAULT 0,
    successful_spawns INTEGER DEFAULT 0,
    last_spawn_date DATE,
    avg_egg_count INTEGER,  -- For females only
    avg_fertilization_rate DECIMAL(5,2),  -- Percentage
    health_status VARCHAR(20) DEFAULT 'Active' CHECK (health_status IN ('Active', 'Recovering', 'Retired', 'Deceased')),
    retirement_date DATE,
    notes TEXT,
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(user_id)
);

-- Indexes for performance
CREATE INDEX idx_broodstock_sex ON broodstock(sex);
CREATE INDEX idx_broodstock_status ON broodstock(health_status);
CREATE INDEX idx_broodstock_code ON broodstock(broodstock_code);

-- ============================================================================
-- 3. SPAWNING RECORDS
-- ============================================================================

CREATE TABLE spawns (
    spawn_id SERIAL PRIMARY KEY,
    spawn_code VARCHAR(20) UNIQUE NOT NULL,  -- e.g., 'SP-2024-001'
    spawn_date DATE NOT NULL,
    injection_time TIMESTAMP NOT NULL,
    hormone_type VARCHAR(50) DEFAULT 'Ovaprim',
    hormone_dose_ml DECIMAL(5,2) NOT NULL,  -- Total ml used
    dose_per_kg DECIMAL(5,2) NOT NULL,  -- ml/kg
    female1_id INTEGER REFERENCES broodstock(broodstock_id),
    female1_weight_kg DECIMAL(5,2),
    female2_id INTEGER REFERENCES broodstock(broodstock_id),
    female2_weight_kg DECIMAL(5,2),
    male1_id INTEGER REFERENCES broodstock(broodstock_id),
    male2_id INTEGER REFERENCES broodstock(broodstock_id),
    stripping_time TIMESTAMP,  -- 10 hours after injection
    estimated_egg_count INTEGER,
    fertilization_rate DECIMAL(5,2),  -- Percentage (0-100)
    hatch_rate DECIMAL(5,2),  -- Percentage (0-100)
    initial_fry_count INTEGER,
    swim_up_date TIMESTAMP,
    swim_up_count INTEGER,
    hormone_cost_ngn DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'Planned' CHECK (status IN ('Planned', 'Injected', 'Stripped', 'Hatched', 'Swim-up', 'Completed', 'Failed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(user_id)
);

-- Track spawn progress updates (for timeline)
CREATE TABLE spawn_updates (
    update_id SERIAL PRIMARY KEY,
    spawn_id INTEGER REFERENCES spawns(spawn_id) ON DELETE CASCADE,
    update_type VARCHAR(50) NOT NULL,  -- 'injection', 'stripping', 'hatch', 'swim-up'
    update_time TIMESTAMP NOT NULL,
    count_value INTEGER,  -- eggs, fry, etc.
    rate_value DECIMAL(5,2),  -- fertilization rate, hatch rate
    notes TEXT,
    photo_url VARCHAR(255),
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_spawns_date ON spawns(spawn_date DESC);
CREATE INDEX idx_spawns_status ON spawns(status);
CREATE INDEX idx_spawns_code ON spawns(spawn_code);
CREATE INDEX idx_spawn_updates_spawn ON spawn_updates(spawn_id);

-- ============================================================================
-- 4. TANK MANAGEMENT
-- ============================================================================

CREATE TABLE tanks (
    tank_id SERIAL PRIMARY KEY,
    tank_code VARCHAR(20) UNIQUE NOT NULL,  -- e.g., 'IBC-1', 'TOP-1', 'GND-1'
    tank_name VARCHAR(50) NOT NULL,
    tank_type VARCHAR(30) NOT NULL CHECK (tank_type IN ('Hatching', 'IBC', 'Elevated', 'Ground', 'Tarpaulin')),
    location VARCHAR(50),  -- 'IBC Section', 'Double-Layer', 'Existing Area'
    capacity_liters INTEGER NOT NULL,
    length_m DECIMAL(4,2),
    width_m DECIMAL(4,2),
    depth_m DECIMAL(4,2),
    max_stocking_density DECIMAL(6,2),  -- fish per liter
    is_active BOOLEAN DEFAULT TRUE,
    installation_date DATE,
    last_maintenance_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Current tank stocking (what's in each tank right now)
CREATE TABLE tank_stocking (
    stocking_id SERIAL PRIMARY KEY,
    tank_id INTEGER REFERENCES tanks(tank_id),
    batch_id INTEGER,  -- Will be linked to batches table
    spawn_id INTEGER REFERENCES spawns(spawn_id),
    stocked_date DATE NOT NULL,
    initial_count INTEGER NOT NULL,
    current_count INTEGER NOT NULL,
    current_avg_size_g DECIMAL(6,2),
    days_in_tank INTEGER,
    stocking_density DECIMAL(6,2),  -- calculated: current_count / tank capacity
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Transferred', 'Sold', 'Completed')),
    transfer_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_tanks_type ON tanks(tank_type);
CREATE INDEX idx_tanks_active ON tanks(is_active);
CREATE INDEX idx_tank_stocking_tank ON tank_stocking(tank_id);
CREATE INDEX idx_tank_stocking_status ON tank_stocking(status);

-- ============================================================================
-- 5. PRODUCTION TRACKING
-- ============================================================================

-- Main batch tracking (follows fish through entire lifecycle)
CREATE TABLE batches (
    batch_id SERIAL PRIMARY KEY,
    batch_code VARCHAR(20) UNIQUE NOT NULL,  -- e.g., 'BATCH-2024-001'
    spawn_id INTEGER REFERENCES spawns(spawn_id),
    start_date DATE NOT NULL,
    initial_count INTEGER NOT NULL,
    current_count INTEGER,
    current_stage VARCHAR(30) CHECK (current_stage IN ('Eggs', 'Larvae', 'Fry', 'Small Fingerlings', 'Large Fingerlings', 'Sold', 'Completed')),
    current_tank_id INTEGER REFERENCES tanks(tank_id),
    current_avg_size_g DECIMAL(6,2),
    overall_survival_rate DECIMAL(5,2),  -- Calculated
    total_feed_consumed_kg DECIMAL(8,2) DEFAULT 0,
    total_feed_cost_ngn DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Sold', 'Lost', 'Completed')),
    completion_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Batch movements between tanks
CREATE TABLE batch_movements (
    movement_id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(batch_id) ON DELETE CASCADE,
    from_tank_id INTEGER REFERENCES tanks(tank_id),
    to_tank_id INTEGER REFERENCES tanks(tank_id),
    movement_date DATE NOT NULL,
    count_moved INTEGER NOT NULL,
    avg_size_g DECIMAL(6,2),
    reason VARCHAR(100),  -- 'Growth Stage', 'Overcrowding', 'Health Issue'
    mortality_during_transfer INTEGER DEFAULT 0,
    notes TEXT,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stage-by-stage records (Week 0-1, Week 1-3, Week 3-6, etc.)
CREATE TABLE stage_records (
    stage_id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(batch_id) ON DELETE CASCADE,
    stage_name VARCHAR(50) NOT NULL,  -- 'Week 0-1 Hatching', 'Week 1-3 IBC', etc.
    tank_id INTEGER REFERENCES tanks(tank_id),
    entry_date DATE NOT NULL,
    entry_count INTEGER NOT NULL,
    entry_avg_size_g DECIMAL(6,2),
    exit_date DATE,
    exit_count INTEGER,
    exit_avg_size_g DECIMAL(6,2),
    mortality_count INTEGER,
    survival_rate DECIMAL(5,2),  -- Calculated: (exit_count / entry_count) * 100
    days_in_stage INTEGER,
    feed_consumed_kg DECIMAL(8,2),
    feed_cost_ngn DECIMAL(10,2),
    growth_rate_g_per_day DECIMAL(5,2),  -- Calculated
    feed_conversion_ratio DECIMAL(5,2),  -- Feed consumed / weight gained
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_batches_spawn ON batches(spawn_id);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_stage ON batches(current_stage);
CREATE INDEX idx_batch_movements_batch ON batch_movements(batch_id);
CREATE INDEX idx_stage_records_batch ON stage_records(batch_id);

-- ============================================================================
-- 6. FEED MANAGEMENT
-- ============================================================================

-- Feed types catalog
CREATE TABLE feed_types (
    feed_type_id SERIAL PRIMARY KEY,
    feed_name VARCHAR(50) UNIQUE NOT NULL,  -- 'Artemia', '0.5mm Pellets', '1.0mm Pellets', etc.
    category VARCHAR(30) CHECK (category IN ('Live Feed', 'Pellets', 'Supplement', 'Plant Feed')),
    pellet_size_mm DECIMAL(4,2),
    protein_content DECIMAL(5,2),  -- Percentage
    recommended_for_stage VARCHAR(50),
    unit_of_measure VARCHAR(20) DEFAULT 'kg',  -- kg, liters, pieces
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert common feed types
INSERT INTO feed_types (feed_name, category, pellet_size_mm, protein_content, recommended_for_stage) VALUES
('Artemia', 'Live Feed', NULL, 60.0, 'Week 0-1'),
('0.5mm Pellets', 'Pellets', 0.5, 45.0, 'Week 1-2'),
('1.0mm Pellets', 'Pellets', 1.0, 42.0, 'Week 2-4'),
('2.0mm Pellets', 'Pellets', 2.0, 40.0, 'Week 4-8'),
('3.0mm Pellets', 'Pellets', 3.0, 38.0, 'Week 8+'),
('Duckweed (Fresh)', 'Plant Feed', NULL, 30.0, 'Week 6+'),
('Azolla (Fresh)', 'Plant Feed', NULL, 25.0, 'Week 6+');

-- Feed inventory
CREATE TABLE feed_inventory (
    inventory_id SERIAL PRIMARY KEY,
    feed_type_id INTEGER REFERENCES feed_types(feed_type_id),
    current_stock_kg DECIMAL(8,2) NOT NULL DEFAULT 0,
    reorder_level_kg DECIMAL(8,2) NOT NULL DEFAULT 50,
    last_purchase_date DATE,
    last_purchase_quantity_kg DECIMAL(8,2),
    unit_cost_ngn DECIMAL(8,2),  -- Cost per kg
    supplier_name VARCHAR(100),
    supplier_phone VARCHAR(20),
    expiry_date DATE,
    storage_location VARCHAR(50),
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily feeding logs
CREATE TABLE feeding_logs (
    feeding_id SERIAL PRIMARY KEY,
    log_date DATE NOT NULL,
    log_time TIME NOT NULL,
    tank_id INTEGER REFERENCES tanks(tank_id),
    batch_id INTEGER REFERENCES batches(batch_id),
    feed_type_id INTEGER REFERENCES feed_types(feed_type_id),
    amount_kg DECIMAL(6,2) NOT NULL,
    cost_ngn DECIMAL(8,2),  -- Calculated from unit cost
    fish_appetite VARCHAR(20) CHECK (fish_appetite IN ('Excellent', 'Good', 'Fair', 'Poor', 'None')),
    uneaten_food BOOLEAN DEFAULT FALSE,
    notes TEXT,
    fed_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plant feed harvest (duckweed/azolla)
CREATE TABLE plant_feed_harvest (
    harvest_id SERIAL PRIMARY KEY,
    harvest_date DATE NOT NULL,
    feed_type VARCHAR(20) CHECK (feed_type IN ('Duckweed', 'Azolla')),
    bed_number INTEGER,  -- Which bed (1-4 for duckweed, 1-2 for azolla)
    fresh_weight_g INTEGER NOT NULL,
    dry_weight_g INTEGER,  -- If dried
    used_immediately BOOLEAN DEFAULT TRUE,
    bed_condition VARCHAR(50),  -- 'Excellent', 'Good', 'Needs Nutrient', 'Disease'
    notes TEXT,
    harvested_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_feeding_logs_date ON feeding_logs(log_date DESC);
CREATE INDEX idx_feeding_logs_tank ON feeding_logs(tank_id);
CREATE INDEX idx_feeding_logs_batch ON feeding_logs(batch_id);
CREATE INDEX idx_plant_harvest_date ON plant_feed_harvest(harvest_date DESC);

-- ============================================================================
-- 7. SALES & CUSTOMERS
-- ============================================================================

-- Customer database
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_code VARCHAR(20) UNIQUE NOT NULL,  -- e.g., 'CUST-001'
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    alternate_phone VARCHAR(20),
    location VARCHAR(100),
    customer_type VARCHAR(30) CHECK (customer_type IN ('Fish Farmer', 'Dealer', 'Direct Consumer', 'Retailer')),
    payment_reliability VARCHAR(20) DEFAULT 'Good' CHECK (payment_reliability IN ('Excellent', 'Good', 'Fair', 'Poor')),
    total_purchases_ngn DECIMAL(12,2) DEFAULT 0,
    total_quantity_purchased INTEGER DEFAULT 0,
    first_purchase_date DATE,
    last_purchase_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales transactions
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    sale_code VARCHAR(20) UNIQUE NOT NULL,  -- e.g., 'SALE-2024-001'
    sale_date DATE NOT NULL,
    customer_id INTEGER REFERENCES customers(customer_id),
    batch_id INTEGER REFERENCES batches(batch_id),
    quantity_sold INTEGER NOT NULL,
    fish_size_category VARCHAR(20) CHECK (fish_size_category IN ('10-15g', '30-50g', 'Other')),
    avg_size_g DECIMAL(6,2),
    price_per_piece_ngn DECIMAL(8,2) NOT NULL,
    subtotal_ngn DECIMAL(10,2) NOT NULL,  -- quantity * price_per_piece
    delivery_cost_ngn DECIMAL(8,2) DEFAULT 0,
    total_amount_ngn DECIMAL(10,2) NOT NULL,  -- subtotal + delivery_cost
    payment_method VARCHAR(30) CHECK (payment_method IN ('Cash', 'Bank Transfer', 'POS', 'Mobile Money', 'Credit')),
    payment_status VARCHAR(20) DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Pending', 'Partial', 'Overdue')),
    amount_paid_ngn DECIMAL(10,2) DEFAULT 0,
    balance_ngn DECIMAL(10,2),  -- Calculated: total_amount - amount_paid
    payment_date DATE,
    delivery_location VARCHAR(200),
    delivery_date DATE,
    delivery_status VARCHAR(20) DEFAULT 'Pending' CHECK (delivery_status IN ('Pending', 'In Transit', 'Delivered', 'Cancelled')),
    notes TEXT,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual line items for complex sales (if needed later)
CREATE TABLE sale_items (
    item_id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(sale_id) ON DELETE CASCADE,
    batch_id INTEGER REFERENCES batches(batch_id),
    quantity INTEGER NOT NULL,
    size_category VARCHAR(20),
    price_per_piece_ngn DECIMAL(8,2) NOT NULL,
    line_total_ngn DECIMAL(10,2) NOT NULL
);

-- Indexes
CREATE INDEX idx_customers_phone ON customers(phone_number);
CREATE INDEX idx_customers_type ON customers(customer_type);
CREATE INDEX idx_sales_date ON sales(sale_date DESC);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_status ON sales(payment_status);

-- ============================================================================
-- 8. FINANCIAL TRACKING
-- ============================================================================

-- Expense categories
CREATE TABLE expense_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default expense categories
INSERT INTO expense_categories (category_name, description) VALUES
('Feed', 'Commercial feed purchases'),
('Hormones', 'Spawning hormones (Ovaprim, etc.)'),
('Power/Fuel', 'Generator diesel, electricity bills'),
('Labor', 'Staff salaries and wages'),
('Water', 'Borehole maintenance, water treatment'),
('Chemicals/Medicine', 'Fish health treatments, water conditioners'),
('Maintenance', 'Equipment repairs, tank maintenance'),
('Transport/Delivery', 'Vehicle fuel, delivery costs'),
('Broodstock', 'Purchase of breeding fish'),
('Equipment', 'Tools, nets, aerators, etc.'),
('Supplies', 'Cleaning supplies, containers, etc.'),
('Utilities', 'Phone, internet, office supplies'),
('Other', 'Miscellaneous expenses');

-- Expenses log
CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    expense_date DATE NOT NULL,
    category_id INTEGER REFERENCES expense_categories(category_id),
    description TEXT NOT NULL,
    amount_ngn DECIMAL(10,2) NOT NULL,
    quantity DECIMAL(8,2),  -- e.g., liters of fuel, kg of feed
    unit_cost_ngn DECIMAL(8,2),  -- Cost per unit
    supplier_name VARCHAR(100),
    payment_method VARCHAR(30) CHECK (payment_method IN ('Cash', 'Bank Transfer', 'POS', 'Mobile Money', 'Credit')),
    receipt_number VARCHAR(50),
    batch_id INTEGER REFERENCES batches(batch_id),  -- Link to specific batch if applicable
    notes TEXT,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Batch-specific cost tracking
CREATE TABLE batch_costs (
    cost_id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(batch_id) ON DELETE CASCADE,
    cost_type VARCHAR(50) NOT NULL,  -- 'Hormone', 'Feed', 'Treatment', 'Allocated Overhead'
    amount_ngn DECIMAL(10,2) NOT NULL,
    description TEXT,
    expense_id INTEGER REFERENCES expenses(expense_id),  -- Link to general expense if applicable
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_batch_costs_batch ON batch_costs(batch_id);

-- ============================================================================
-- 9. HEALTH & OBSERVATIONS
-- ============================================================================

-- Health incident logs
CREATE TABLE health_logs (
    log_id SERIAL PRIMARY KEY,
    log_date DATE NOT NULL,
    log_time TIME NOT NULL,
    tank_id INTEGER REFERENCES tanks(tank_id),
    batch_id INTEGER REFERENCES batches(batch_id),
    issue_type VARCHAR(50) CHECK (issue_type IN ('Disease', 'Behavior', 'Water Quality', 'Mortality', 'Other')),
    issue_name VARCHAR(100),  -- 'White Spot', 'Gasping', 'Dropsy', etc.
    symptoms TEXT,
    mortality_count INTEGER DEFAULT 0,
    severity VARCHAR(20) CHECK (severity IN ('Minor', 'Moderate', 'Severe', 'Critical')),
    action_taken TEXT,
    treatment_cost_ngn DECIMAL(8,2),
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    resolution_status VARCHAR(20) DEFAULT 'Ongoing' CHECK (resolution_status IN ('Ongoing', 'Resolved', 'Lost Batch', 'Monitoring')),
    resolution_date DATE,
    photo_url VARCHAR(255),
    notes TEXT,
    reported_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Treatment protocols applied
CREATE TABLE treatments (
    treatment_id SERIAL PRIMARY KEY,
    health_log_id INTEGER REFERENCES health_logs(log_id) ON DELETE CASCADE,
    treatment_date DATE NOT NULL,
    treatment_type VARCHAR(50),  -- 'Salt Bath', 'Antibiotic', 'Water Change', etc.
    medication_name VARCHAR(100),
    dosage VARCHAR(50),
    duration_days INTEGER,
    cost_ngn DECIMAL(8,2),
    effectiveness VARCHAR(20) CHECK (effectiveness IN ('Excellent', 'Good', 'Fair', 'Poor', 'None')),
    notes TEXT,
    administered_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_health_logs_date ON health_logs(log_date DESC);
CREATE INDEX idx_health_logs_tank ON health_logs(tank_id);
CREATE INDEX idx_health_logs_batch ON health_logs(batch_id);
CREATE INDEX idx_health_logs_status ON health_logs(resolution_status);

-- ============================================================================
-- 10. SYSTEM & CONFIGURATION
-- ============================================================================

-- Application settings
CREATE TABLE app_settings (
    setting_id SERIAL PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_user_editable BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(user_id)
);

-- Insert default settings
INSERT INTO app_settings (setting_key, setting_value, setting_type, description) VALUES
('company_name', 'Tani Nigeria Ltd', 'string', 'Company name displayed in app'),
('currency_symbol', '₦', 'string', 'Currency symbol'),
('date_format', 'DD/MM/YYYY', 'string', 'Date display format'),
('default_survival_target', '30', 'number', 'Target survival rate percentage'),
('low_stock_threshold_kg', '50', 'number', 'Alert when feed stock below this level'),
('backup_enabled', 'true', 'boolean', 'Enable automatic daily backups'),
('sms_notifications_enabled', 'false', 'boolean', 'Enable SMS notifications (future)'),
('spawn_interval_days', '10', 'number', 'Recommended days between spawns');

-- Notifications/alerts queue
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    notification_type VARCHAR(30) CHECK (notification_type IN ('Low Stock', 'Transfer Due', 'Payment Overdue', 'Health Alert', 'System', 'General')),
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'Info' CHECK (severity IN ('Info', 'Warning', 'Urgent', 'Critical')),
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),  -- Link to relevant page if applicable
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Dashboard summary view
CREATE VIEW v_dashboard_summary AS
SELECT 
    (SELECT COUNT(*) FROM batches WHERE status = 'Active') as active_batches,
    (SELECT SUM(current_count) FROM batches WHERE status = 'Active') as total_fish,
    (SELECT COUNT(*) FROM spawns WHERE spawn_date >= CURRENT_DATE - INTERVAL '7 days') as spawns_this_week,
    (SELECT SUM(total_amount_ngn) FROM sales WHERE sale_date >= CURRENT_DATE - INTERVAL '7 days') as sales_this_week,
    (SELECT SUM(amount_ngn) FROM expenses WHERE expense_date >= CURRENT_DATE - INTERVAL '30 days') as expenses_this_month,
    (SELECT COUNT(*) FROM feed_inventory WHERE current_stock_kg < reorder_level_kg) as low_stock_items,
    (SELECT COUNT(*) FROM health_logs WHERE resolution_status = 'Ongoing') as active_health_issues;

-- Batch profitability view
CREATE VIEW v_batch_profitability AS
SELECT 
    b.batch_id,
    b.batch_code,
    b.start_date,
    b.initial_count,
    b.current_count,
    b.overall_survival_rate,
    COALESCE(SUM(bc.amount_ngn), 0) as total_costs_ngn,
    COALESCE(SUM(s.total_amount_ngn), 0) as total_revenue_ngn,
    COALESCE(SUM(s.total_amount_ngn), 0) - COALESCE(SUM(bc.amount_ngn), 0) as profit_ngn,
    CASE 
        WHEN COALESCE(SUM(bc.amount_ngn), 0) > 0 
        THEN ((COALESCE(SUM(s.total_amount_ngn), 0) - COALESCE(SUM(bc.amount_ngn), 0)) / COALESCE(SUM(bc.amount_ngn), 0)) * 100
        ELSE 0
    END as profit_margin_percent
FROM batches b
LEFT JOIN batch_costs bc ON b.batch_id = bc.batch_id
LEFT JOIN sales s ON b.batch_id = s.batch_id
GROUP BY b.batch_id, b.batch_code, b.start_date, b.initial_count, b.current_count, b.overall_survival_rate;

-- Tank utilization view
CREATE VIEW v_tank_utilization AS
SELECT 
    t.tank_id,
    t.tank_code,
    t.tank_name,
    t.tank_type,
    t.capacity_liters,
    ts.current_count,
    ts.current_avg_size_g,
    ts.stocking_density,
    CASE 
        WHEN ts.stocking_density >= 0.9 THEN 'Overcrowded'
        WHEN ts.stocking_density >= 0.7 THEN 'Well Stocked'
        WHEN ts.stocking_density >= 0.4 THEN 'Moderate'
        WHEN ts.stocking_density > 0 THEN 'Understocked'
        ELSE 'Empty'
    END as utilization_status
FROM tanks t
LEFT JOIN tank_stocking ts ON t.tank_id = ts.tank_id AND ts.status = 'Active';

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_broodstock_updated_at BEFORE UPDATE ON broodstock FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spawns_updated_at BEFORE UPDATE ON spawns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tank_stocking_updated_at BEFORE UPDATE ON tank_stocking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_logs_updated_at BEFORE UPDATE ON health_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-calculate batch survival rate
CREATE OR REPLACE FUNCTION calculate_batch_survival_rate()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.current_count IS NOT NULL AND NEW.initial_count > 0 THEN
        NEW.overall_survival_rate = (NEW.current_count::DECIMAL / NEW.initial_count::DECIMAL) * 100;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_batch_survival_rate 
BEFORE INSERT OR UPDATE ON batches 
FOR EACH ROW EXECUTE FUNCTION calculate_batch_survival_rate();

-- Function to auto-update customer totals after sale
CREATE OR REPLACE FUNCTION update_customer_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE customers 
    SET 
        total_purchases_ngn = total_purchases_ngn + NEW.total_amount_ngn,
        total_quantity_purchased = total_quantity_purchased + NEW.quantity_sold,
        last_purchase_date = NEW.sale_date
    WHERE customer_id = NEW.customer_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_totals_trigger 
AFTER INSERT ON sales 
FOR EACH ROW EXECUTE FUNCTION update_customer_totals();

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample admin user (password: 'admin123' - hash this properly in production!)
INSERT INTO users (username, phone_number, password_hash, full_name, role_id) VALUES
('admin', '08012345678', crypt('admin123', gen_salt('bf')), 'System Administrator', 1);

-- Insert sample tanks (matching your facility design)
INSERT INTO tanks (tank_code, tank_name, tank_type, location, capacity_liters, length_m, width_m, depth_m, max_stocking_density) VALUES
-- IBC Section (Existing)
('IBC-1', 'IBC Tote 1', 'IBC', 'IBC Section', 600, 1.0, 1.0, 0.6, 50),
('IBC-2', 'IBC Tote 2', 'IBC', 'IBC Section', 600, 1.0, 1.0, 0.6, 50),
('IBC-3', 'IBC Tote 3', 'IBC', 'IBC Section', 600, 1.0, 1.0, 0.6, 50),
('IBC-4', 'IBC Tote 4', 'IBC', 'IBC Section', 600, 1.0, 1.0, 0.6, 50),
('IBC-5', 'IBC Tote 5', 'IBC', 'IBC Section', 600, 1.0, 1.0, 0.6, 50),
('IBC-6', 'IBC Tote 6', 'IBC', 'IBC Section', 600, 1.0, 1.0, 0.6, 50),
-- Hatching Tanks (Elevated shelf)
('HATCH-1', 'Hatching Tank 1', 'Hatching', 'IBC Section Level 2', 100, 0.6, 0.4, 0.4, 100),
('HATCH-2', 'Hatching Tank 2', 'Hatching', 'IBC Section Level 2', 100, 0.6, 0.4, 0.4, 100),
-- Elevated Tanks (New construction)
('TOP-1', 'Elevated Tank 1', 'Elevated', 'Double-Layer Top', 2600, 1.8, 1.8, 0.8, 15),
('TOP-2', 'Elevated Tank 2', 'Elevated', 'Double-Layer Top', 2600, 1.8, 1.8, 0.8, 15),
('TOP-3', 'Elevated Tank 3', 'Elevated', 'Double-Layer Top', 2600, 1.8, 1.8, 0.8, 15),
('TOP-4', 'Elevated Tank 4', 'Elevated', 'Double-Layer Top', 2600, 1.8, 1.8, 0.8, 15),
('TOP-5', 'Elevated Tank 5', 'Elevated', 'Double-Layer Top', 2600, 1.8, 1.8, 0.8, 15),
('TOP-6', 'Elevated Tank 6', 'Elevated', 'Double-Layer Top', 2600, 1.8, 1.8, 0.8, 15),
-- Ground Tanks (New construction)
('GND-1', 'Ground Tank 1', 'Ground', 'Double-Layer Ground', 4000, 2.0, 2.0, 1.0, 10),
('GND-2', 'Ground Tank 2', 'Ground', 'Double-Layer Ground', 4000, 2.0, 2.0, 1.0, 10),
('GND-3', 'Ground Tank 3', 'Ground', 'Double-Layer Ground', 4000, 2.0, 2.0, 1.0, 10),
('GND-4', 'Ground Tank 4', 'Ground', 'Double-Layer Ground', 4000, 2.0, 2.0, 1.0, 10),
('GND-5', 'Ground Tank 5', 'Ground', 'Double-Layer Ground', 4000, 2.0, 2.0, 1.0, 10),
('GND-6', 'Ground Tank 6', 'Ground', 'Double-Layer Ground', 4000, 2.0, 2.0, 1.0, 10),
('GND-7', 'Ground Tank 7', 'Ground', 'Double-Layer Ground', 4000, 2.0, 2.0, 1.0, 10),
('GND-8', 'Ground Tank 8', 'Ground', 'Double-Layer Ground', 4000, 2.0, 2.0, 1.0, 10),
-- Existing Tarpaulin Tanks
('TARP-1', 'Tarpaulin Tank 1', 'Tarpaulin', 'Existing Area', 4560, 3.9, 1.3, 0.9, 8),
('TARP-2', 'Tarpaulin Tank 2', 'Tarpaulin', 'Existing Area', 2690, 2.3, 1.3, 0.9, 8),
('TARP-3', 'Tarpaulin Tank 3', 'Tarpaulin', 'Existing Area', 3740, 3.2, 1.3, 0.9, 8);

-- Insert sample broodstock
INSERT INTO broodstock (broodstock_code, sex, acquisition_date, source, current_weight_kg, health_status) VALUES
('BF-001', 'Female', '2024-01-15', 'Purchased', 1.2, 'Active'),
('BF-002', 'Female', '2024-01-15', 'Purchased', 1.1, 'Active'),
('BF-003', 'Female', '2024-02-20', 'Purchased', 1.3, 'Active'),
('BM-001', 'Male', '2024-01-15', 'Purchased', 0.9, 'Active'),
('BM-002', 'Male', '2024-01-15', 'Purchased', 0.8, 'Active'),
('BM-003', 'Male', '2024-02-20', 'Purchased', 1.0, 'Active');

-- Insert feed inventory
INSERT INTO feed_inventory (feed_type_id, current_stock_kg, reorder_level_kg, unit_cost_ngn, supplier_name) VALUES
(1, 5.0, 2.0, 8000, 'Lagos Aqua Supplies'),  -- Artemia
(2, 150.0, 50.0, 1800, 'Coppens Feed Dealer'),  -- 0.5mm
(3, 200.0, 50.0, 1600, 'Coppens Feed Dealer'),  -- 1.0mm
(4, 250.0, 100.0, 1500, 'Coppens Feed Dealer'),  -- 2.0mm
(5, 300.0, 100.0, 1400, 'Coppens Feed Dealer'),  -- 3.0mm
(6, 0, 0, 0, 'Own Production'),  -- Duckweed
(7, 0, 0, 0, 'Own Production');  -- Azolla

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Database setup complete!
-- Next steps:
-- 1. Create database: CREATE DATABASE tanitrack_db;
-- 2. Run this schema: psql -U postgres -d tanitrack_db -f TaniTrack_Database_Schema.sql
-- 3. Verify tables: SELECT table_name FROM information_schema.tables WHERE table_schema='public';
-- 4. Start building API endpoints

-- NOTES FOR DEVELOPERS:
-- - All monetary values in NGN (Nigerian Naira)
-- - All weights in kg (kilograms) or g (grams)
-- - All dates in YYYY-MM-DD format
-- - All timestamps in ISO 8601 format
-- - Survival rates and percentages stored as DECIMAL (0-100)
-- - Foreign keys enforce referential integrity
-- - Triggers auto-update calculated fields
-- - Views provide quick access to common queries
-- - Indexes optimize frequent lookups

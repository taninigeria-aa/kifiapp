-- ============================================================================
-- TaniTrack: Clean Database Schema (No Demo Data)
-- Use this to initialize the database
-- ============================================================================

-- ============================================================================
-- ENABLE EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USER MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles (no demo users)
INSERT INTO user_roles (role_name, description) 
VALUES
('owner', 'Full system access, financial data, configuration'),
('manager', 'Full operational access, limited financial data'),
('senior_assistant', 'Create/edit records, no financial access'),
('junior_assistant', 'View and log daily activities only'),
('guest', 'Read-only dashboard and statistics')
ON CONFLICT (role_name) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
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

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================================================
-- 2. BROODSTOCK MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS broodstock (
    broodstock_id SERIAL PRIMARY KEY,
    broodstock_code VARCHAR(20) UNIQUE NOT NULL,
    sex VARCHAR(10) NOT NULL CHECK (sex IN ('Male', 'Female')),
    acquisition_date DATE NOT NULL,
    source VARCHAR(100),
    initial_weight_kg DECIMAL(5,2),
    current_weight_kg DECIMAL(5,2),
    age_months INTEGER,
    total_spawns INTEGER DEFAULT 0,
    successful_spawns INTEGER DEFAULT 0,
    last_spawn_date DATE,
    avg_egg_count INTEGER,
    avg_fertilization_rate DECIMAL(5,2),
    health_status VARCHAR(20) DEFAULT 'Active' CHECK (health_status IN ('Active', 'Recovering', 'Retired', 'Deceased')),
    retirement_date DATE,
    notes TEXT,
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(user_id)
);

CREATE INDEX IF NOT EXISTS idx_broodstock_sex ON broodstock(sex);
CREATE INDEX IF NOT EXISTS idx_broodstock_status ON broodstock(health_status);
CREATE INDEX IF NOT EXISTS idx_broodstock_code ON broodstock(broodstock_code);

-- ============================================================================
-- 3. SPAWNING RECORDS
-- ============================================================================

CREATE TABLE IF NOT EXISTS spawns (
    spawn_id SERIAL PRIMARY KEY,
    spawn_code VARCHAR(20) UNIQUE NOT NULL,
    spawn_date DATE NOT NULL,
    injection_time TIMESTAMP NOT NULL,
    hormone_type VARCHAR(50) DEFAULT 'Ovaprim',
    hormone_dose_ml DECIMAL(5,2) NOT NULL,
    dose_per_kg DECIMAL(5,2) NOT NULL,
    female1_id INTEGER REFERENCES broodstock(broodstock_id),
    female1_weight_kg DECIMAL(5,2),
    female2_id INTEGER REFERENCES broodstock(broodstock_id),
    female2_weight_kg DECIMAL(5,2),
    male1_id INTEGER REFERENCES broodstock(broodstock_id),
    male2_id INTEGER REFERENCES broodstock(broodstock_id),
    stripping_time TIMESTAMP,
    estimated_egg_count INTEGER,
    fertilization_rate DECIMAL(5,2),
    hatch_rate DECIMAL(5,2),
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

CREATE TABLE IF NOT EXISTS spawn_updates (
    update_id SERIAL PRIMARY KEY,
    spawn_id INTEGER REFERENCES spawns(spawn_id) ON DELETE CASCADE,
    update_type VARCHAR(50) NOT NULL,
    update_time TIMESTAMP NOT NULL,
    count_value INTEGER,
    rate_value DECIMAL(5,2),
    notes TEXT,
    photo_url VARCHAR(255),
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_spawns_date ON spawns(spawn_date DESC);
CREATE INDEX IF NOT EXISTS idx_spawns_status ON spawns(status);
CREATE INDEX IF NOT EXISTS idx_spawns_code ON spawns(spawn_code);
CREATE INDEX IF NOT EXISTS idx_spawn_updates_spawn ON spawn_updates(spawn_id);

-- ============================================================================
-- 4. TANK MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS tanks (
    tank_id SERIAL PRIMARY KEY,
    tank_code VARCHAR(20) UNIQUE NOT NULL,
    tank_name VARCHAR(50) NOT NULL,
    tank_type VARCHAR(30) NOT NULL CHECK (tank_type IN ('Hatching', 'IBC', 'Elevated', 'Ground', 'Tarpaulin')),
    location VARCHAR(50),
    capacity_liters INTEGER NOT NULL,
    length_m DECIMAL(4,2),
    width_m DECIMAL(4,2),
    depth_m DECIMAL(4,2),
    max_stocking_density DECIMAL(6,2),
    is_active BOOLEAN DEFAULT TRUE,
    installation_date DATE,
    last_maintenance_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tank_stocking (
    stocking_id SERIAL PRIMARY KEY,
    tank_id INTEGER REFERENCES tanks(tank_id),
    batch_id INTEGER,
    spawn_id INTEGER REFERENCES spawns(spawn_id),
    stocked_date DATE NOT NULL,
    initial_count INTEGER NOT NULL,
    current_count INTEGER NOT NULL,
    current_avg_size_g DECIMAL(6,2),
    days_in_tank INTEGER,
    stocking_density DECIMAL(6,2),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Transferred', 'Sold', 'Completed')),
    transfer_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tanks_type ON tanks(tank_type);
CREATE INDEX IF NOT EXISTS idx_tanks_active ON tanks(is_active);
CREATE INDEX IF NOT EXISTS idx_tank_stocking_tank ON tank_stocking(tank_id);
CREATE INDEX IF NOT EXISTS idx_tank_stocking_status ON tank_stocking(status);

-- ============================================================================
-- 5. PRODUCTION TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS batches (
    batch_id SERIAL PRIMARY KEY,
    batch_code VARCHAR(20) UNIQUE NOT NULL,
    spawn_id INTEGER REFERENCES spawns(spawn_id),
    start_date DATE NOT NULL,
    initial_count INTEGER NOT NULL,
    current_count INTEGER,
    current_stage VARCHAR(30) CHECK (current_stage IN ('Eggs', 'Larvae', 'Fry', 'Small Fingerlings', 'Large Fingerlings', 'Sold', 'Completed')),
    current_tank_id INTEGER REFERENCES tanks(tank_id),
    current_avg_size_g DECIMAL(6,2),
    overall_survival_rate DECIMAL(5,2),
    total_feed_consumed_kg DECIMAL(8,2) DEFAULT 0,
    total_feed_cost_ngn DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Sold', 'Lost', 'Completed')),
    completion_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS batch_movements (
    movement_id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(batch_id) ON DELETE CASCADE,
    from_tank_id INTEGER REFERENCES tanks(tank_id),
    to_tank_id INTEGER REFERENCES tanks(tank_id),
    movement_date DATE NOT NULL,
    count_moved INTEGER NOT NULL,
    avg_size_g DECIMAL(6,2),
    reason VARCHAR(100),
    mortality_during_transfer INTEGER DEFAULT 0,
    notes TEXT,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stage_records (
    stage_id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(batch_id) ON DELETE CASCADE,
    stage_name VARCHAR(50) NOT NULL,
    tank_id INTEGER REFERENCES tanks(tank_id),
    entry_date DATE NOT NULL,
    entry_count INTEGER NOT NULL,
    entry_avg_size_g DECIMAL(6,2),
    exit_date DATE,
    exit_count INTEGER,
    exit_avg_size_g DECIMAL(6,2),
    mortality_count INTEGER,
    survival_rate DECIMAL(5,2),
    days_in_stage INTEGER,
    feed_consumed_kg DECIMAL(8,2),
    feed_cost_ngn DECIMAL(10,2),
    growth_rate_g_per_day DECIMAL(5,2),
    feed_conversion_ratio DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS growth_samples (
    sample_id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(batch_id) ON DELETE CASCADE,
    sample_date DATE DEFAULT CURRENT_DATE,
    avg_weight_g NUMERIC(10, 2),
    sample_size INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_batches_spawn ON batches(spawn_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
CREATE INDEX IF NOT EXISTS idx_batches_stage ON batches(current_stage);
CREATE INDEX IF NOT EXISTS idx_batch_movements_batch ON batch_movements(batch_id);
CREATE INDEX IF NOT EXISTS idx_stage_records_batch ON stage_records(batch_id);

-- ============================================================================
-- 6. FEED MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS feed_types (
    feed_type_id SERIAL PRIMARY KEY,
    feed_name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(30) CHECK (category IN ('Live Feed', 'Pellets', 'Supplement', 'Plant Feed')),
    pellet_size_mm DECIMAL(4,2),
    protein_content DECIMAL(5,2),
    recommended_for_stage VARCHAR(50),
    unit_of_measure VARCHAR(20) DEFAULT 'kg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert feed types
INSERT INTO feed_types (feed_name, category, pellet_size_mm, protein_content, recommended_for_stage) 
VALUES
('Artemia', 'Live Feed', NULL, 60.0, 'Week 0-1'),
('0.5mm Pellets', 'Pellets', 0.5, 45.0, 'Week 1-2'),
('1.0mm Pellets', 'Pellets', 1.0, 42.0, 'Week 2-4'),
('2.0mm Pellets', 'Pellets', 2.0, 40.0, 'Week 4-8'),
('3.0mm Pellets', 'Pellets', 3.0, 38.0, 'Week 8+'),
('Duckweed (Fresh)', 'Plant Feed', NULL, 30.0, 'Week 6+'),
('Azolla (Fresh)', 'Plant Feed', NULL, 25.0, 'Week 6+')
ON CONFLICT (feed_name) DO NOTHING;

CREATE TABLE IF NOT EXISTS feed_inventory (
    inventory_id SERIAL PRIMARY KEY,
    feed_type_id INTEGER REFERENCES feed_types(feed_type_id),
    current_stock_kg DECIMAL(8,2) NOT NULL DEFAULT 0,
    reorder_level_kg DECIMAL(8,2) NOT NULL DEFAULT 50,
    last_purchase_date DATE,
    last_purchase_quantity_kg DECIMAL(8,2),
    unit_cost_ngn DECIMAL(8,2),
    supplier_name VARCHAR(100),
    supplier_phone VARCHAR(20),
    expiry_date DATE,
    storage_location VARCHAR(50),
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feed_purchases (
    purchase_id SERIAL PRIMARY KEY,
    inventory_id INTEGER REFERENCES feed_inventory(inventory_id),
    purchase_date DATE DEFAULT CURRENT_DATE,
    bag_size_kg NUMERIC(10, 2),
    num_bags INTEGER,
    total_quantity_kg NUMERIC(10, 2),
    cost_per_bag NUMERIC(15, 2),
    total_cost_ngn NUMERIC(15, 2),
    supplier VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feeding_logs (
    feeding_id SERIAL PRIMARY KEY,
    log_date DATE NOT NULL,
    log_time TIME NOT NULL,
    tank_id INTEGER REFERENCES tanks(tank_id),
    batch_id INTEGER REFERENCES batches(batch_id),
    feed_type_id INTEGER REFERENCES feed_types(feed_type_id),
    amount_kg DECIMAL(6,2) NOT NULL,
    cost_ngn DECIMAL(8,2),
    fish_appetite VARCHAR(20) CHECK (fish_appetite IN ('Excellent', 'Good', 'Fair', 'Poor', 'None')),
    uneaten_food BOOLEAN DEFAULT FALSE,
    notes TEXT,
    fed_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plant_feed_harvest (
    harvest_id SERIAL PRIMARY KEY,
    harvest_date DATE NOT NULL,
    feed_type VARCHAR(20) CHECK (feed_type IN ('Duckweed', 'Azolla')),
    bed_number INTEGER,
    fresh_weight_g INTEGER NOT NULL,
    dry_weight_g INTEGER,
    used_immediately BOOLEAN DEFAULT TRUE,
    bed_condition VARCHAR(50),
    notes TEXT,
    harvested_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feeding_logs_date ON feeding_logs(log_date DESC);
CREATE INDEX IF NOT EXISTS idx_feeding_logs_tank ON feeding_logs(tank_id);
CREATE INDEX IF NOT EXISTS idx_feeding_logs_batch ON feeding_logs(batch_id);
CREATE INDEX IF NOT EXISTS idx_plant_harvest_date ON plant_feed_harvest(harvest_date DESC);

-- ============================================================================
-- 7. SALES & CUSTOMERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    customer_code VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
    sale_id SERIAL PRIMARY KEY,
    sale_code VARCHAR(20) UNIQUE NOT NULL,
    sale_date DATE NOT NULL,
    customer_id INTEGER REFERENCES customers(customer_id),
    batch_id INTEGER REFERENCES batches(batch_id),
    quantity_sold INTEGER NOT NULL,
    fish_size_category VARCHAR(20),
    avg_size_g DECIMAL(6,2),
    price_per_piece_ngn DECIMAL(15,2),
    subtotal_ngn DECIMAL(15,2),
    delivery_cost_ngn DECIMAL(15,2) DEFAULT 0,
    total_amount_ngn DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(30),
    payment_status VARCHAR(20) DEFAULT 'Pending',
    amount_paid_ngn DECIMAL(15,2) DEFAULT 0,
    balance_ngn DECIMAL(15,2),
    payment_date DATE,
    delivery_location VARCHAR(200),
    delivery_date DATE,
    delivery_status VARCHAR(20) DEFAULT 'Pending',
    notes TEXT,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sale_items (
    item_id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(sale_id) ON DELETE CASCADE,
    batch_id INTEGER REFERENCES batches(batch_id),
    quantity INTEGER NOT NULL,
    size_category VARCHAR(20),
    price_per_piece_ngn DECIMAL(15,2) NOT NULL,
    line_total_ngn DECIMAL(15,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone_number);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date DESC);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);

-- ============================================================================
-- 8. FINANCIAL TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS expense_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO expense_categories (category_name, description) 
VALUES
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
('Other', 'Miscellaneous expenses')
ON CONFLICT (category_name) DO NOTHING;

CREATE TABLE IF NOT EXISTS expenses (
    expense_id SERIAL PRIMARY KEY,
    expense_date DATE NOT NULL,
    category_id INTEGER REFERENCES expense_categories(category_id),
    category VARCHAR(100),
    description TEXT NOT NULL,
    amount_ngn DECIMAL(15,2) NOT NULL,
    quantity DECIMAL(8,2),
    unit_cost_ngn DECIMAL(15,2),
    supplier_name VARCHAR(100),
    payment_method VARCHAR(30),
    receipt_number VARCHAR(50),
    batch_id INTEGER REFERENCES batches(batch_id),
    notes TEXT,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS batch_costs (
    cost_id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(batch_id) ON DELETE CASCADE,
    cost_type VARCHAR(50) NOT NULL,
    amount_ngn DECIMAL(15,2) NOT NULL,
    description TEXT,
    expense_id INTEGER REFERENCES expenses(expense_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_batch_costs_batch ON batch_costs(batch_id);

-- ============================================================================
-- 9. PEOPLE MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone_number VARCHAR(50),
    email VARCHAR(255),
    category VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workers (
    worker_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    phone_number VARCHAR(50),
    start_date DATE DEFAULT CURRENT_DATE,
    salary_ngn NUMERIC(15, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 10. HEALTH & OBSERVATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS health_logs (
    log_id SERIAL PRIMARY KEY,
    log_date DATE NOT NULL,
    log_time TIME NOT NULL,
    tank_id INTEGER REFERENCES tanks(tank_id),
    batch_id INTEGER REFERENCES batches(batch_id),
    issue_type VARCHAR(50),
    issue_description TEXT NOT NULL,
    severity VARCHAR(20),
    fish_affected INTEGER,
    mortality_count INTEGER,
    mortality_rate DECIMAL(5,2),
    water_temperature_c DECIMAL(4,1),
    water_ph DECIMAL(3,1),
    oxygen_level_ppm DECIMAL(4,2),
    action_taken TEXT,
    notes TEXT,
    logged_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS treatments (
    treatment_id SERIAL PRIMARY KEY,
    health_log_id INTEGER REFERENCES health_logs(log_id),
    treatment_date DATE NOT NULL,
    treatment_type VARCHAR(50),
    medication_name VARCHAR(100),
    dosage_ml DECIMAL(8,2),
    dosage_mg_per_liter DECIMAL(8,2),
    duration_days INTEGER,
    cost_ngn DECIMAL(15,2),
    supplier VARCHAR(100),
    outcome VARCHAR(50),
    notes TEXT,
    applied_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 11. SYSTEM & CONFIGURATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS app_settings (
    setting_id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    data_type VARCHAR(20) DEFAULT 'text',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- ============================================================================
-- 12. MASTER SYNCHRONIZATION SCRIPT (Run on every startup)
-- Safely adds missing columns to existing tables
-- ============================================================================

DO $$ 
BEGIN
    -- Sync 'customers' table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='email') THEN
        ALTER TABLE customers ADD COLUMN email VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='location') THEN
        ALTER TABLE customers ADD COLUMN location VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='customer_code') THEN
        ALTER TABLE customers ADD COLUMN customer_code VARCHAR(50);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='phone_number' AND is_nullable='NO') THEN
        ALTER TABLE customers ALTER COLUMN phone_number DROP NOT NULL;
    END IF;

    -- Sync 'spawns' table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='spawns' AND column_name='female_code') THEN
        ALTER TABLE spawns ADD COLUMN female_code VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='spawns' AND column_name='male_code') THEN
        ALTER TABLE spawns ADD COLUMN male_code VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='spawns' AND column_name='female_weight_kg') THEN
        ALTER TABLE spawns ADD COLUMN female_weight_kg DECIMAL(5,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='spawns' AND column_name='male_weight_kg') THEN
        ALTER TABLE spawns ADD COLUMN male_weight_kg DECIMAL(5,2);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='spawns' AND column_name='injection_time' AND is_nullable='NO') THEN
        ALTER TABLE spawns ALTER COLUMN injection_time DROP NOT NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='spawns' AND column_name='hormone_dose_ml' AND is_nullable='NO') THEN
        ALTER TABLE spawns ALTER COLUMN hormone_dose_ml DROP NOT NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='spawns' AND column_name='dose_per_kg' AND is_nullable='NO') THEN
        ALTER TABLE spawns ALTER COLUMN dose_per_kg DROP NOT NULL;
    END IF;

    -- Sync 'feeding_logs' defaults
    ALTER TABLE feeding_logs ALTER COLUMN log_date SET DEFAULT CURRENT_DATE;
    ALTER TABLE feeding_logs ALTER COLUMN log_time SET DEFAULT CURRENT_TIME;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feeding_logs' AND column_name='log_time' AND is_nullable='NO') THEN
        ALTER TABLE feeding_logs ALTER COLUMN log_time DROP NOT NULL;
    END IF;

    -- Sync 'expenses' table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='category') THEN
        ALTER TABLE expenses ADD COLUMN category VARCHAR(100);
    END IF;

    -- Sync 'users' table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='full_name') THEN
        ALTER TABLE users ADD COLUMN full_name VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone_number') THEN
        ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
    END IF;

END $$;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

export interface User {
    user_id: number;
    username: string;
    full_name: string;
    role: string;
}

export interface Spawn {
    spawn_id: number;
    spawn_code: string;
    spawn_date: string;
    female_code?: string;
    male_code?: string;
    status: 'Incubating' | 'Hatched' | 'Failed' | 'Completed';
    estimated_eggs?: number;
    injection_time?: string;
}

export interface Broodstock {
    broodstock_id: number;
    broodstock_code: string;
    sex: 'Male' | 'Female';
    health_status: string;
    current_weight_kg?: number;
    acquisition_date?: string;
    notes?: string;
    species?: string;
}

export interface Worker {
    worker_id: number;
    full_name: string;
    role: string;
    phone_number?: string;
    start_date?: string;
    salary_ngn?: number;
    status: 'Active' | 'Inactive';
    notes?: string;
}

export interface Supplier {
    supplier_id: number;
    supplier_name: string;
    contact_person?: string;
    phone_number?: string;
    email?: string;
    location?: string;
}

export interface Tank {
    tank_id: number;
    tank_name: string;
    tank_type: string;
    capacity_liters: number;
    location: string;
    is_active: boolean;
}

export interface Batch {
    batch_id: number;
    batch_code: string;
    start_date: string;
    initial_count: number;
    current_count: number;
    current_tank_id: number;
    tank_name?: string; // from join
    spawn_id?: number;
    spawn_code?: string; // from join
    status: 'Active' | 'Harvested' | 'Combined' | 'Sold';
    current_stage: 'Fry' | 'Fingerling' | 'Juvenile' | 'Grow-out' | 'Table Size';
    current_avg_size_g?: number;
    notes?: string;
}

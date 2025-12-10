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
    health_status: 'Active' | 'Quarantine' | 'Retired';
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
}

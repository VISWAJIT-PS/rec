export interface Employee {
    id: string;
    employee_id: string;
    name: string;
    dob: string;
    phone: string;
    role: 'admin' | 'employee';
    created_at: string;
}

export interface Attendance {
    id: string;
    employee_id: string;
    check_in_time: string;
    check_in_location: LocationData;
    check_in_selfie_url: string;
    check_out_time?: string;
    check_out_location?: LocationData;
    check_out_selfie_url?: string;
    total_hours: number;
    overtime_hours: number;
    created_at: string;
}

export interface LocationData {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: number;
}

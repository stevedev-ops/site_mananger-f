export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    SUB_ADMIN = 'SUB_ADMIN',
    SUPERVISOR = 'SUPERVISOR',
    CLIENT = 'CLIENT',
}

export enum SiteUserRole {
    SITE_MANAGER = 'SITE_MANAGER',
    SUPERVISOR = 'SUPERVISOR',
    CLIENT = 'CLIENT',
    SUB_ADMIN = 'SUB_ADMIN'
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: UserRole;
    organizationId?: string;
    faceImageUrl?: string;
    is2FAEnabled: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role: UserRole;
    organizationId?: string;
}

export interface Site {
    id: string;
    name: string;
    location: string;
    gpsCoordinates?: {
        latitude: number;
        longitude: number;
    };
    status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
    startDate?: string;
    expectedEndDate?: string;
    actualEndDate?: string;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Attendance {
    id: string;
    userId: string;
    siteId: string;
    clockIn: string;
    clockOut?: string;
    gpsLocation?: {
        latitude: number;
        longitude: number;
        accuracy?: number;
    };
    selfieUrl?: string;
    verified: boolean;
    hoursWorked?: number;
}

export interface Report {
    id: string;
    siteId: string;
    supervisorId: string;
    reportDate: string;
    workersPresent: number;
    description: string;
    resourcesUsed?: Array<{
        templateId: string;
        quantity: number;
    }>;
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    approvedBy?: string;
    approvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    siteId: string;
    title: string;
    description?: string;
    assignedTo?: string;
    dueDate?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    createdAt: string;
    updatedAt: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: string;
    message: string;
    metadata?: any;
    read: boolean;
    createdAt: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

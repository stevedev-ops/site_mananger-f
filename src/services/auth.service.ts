import api from './api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<{ success: boolean; data: AuthResponse }>(
            '/auth/login',
            credentials
        );

        if (response.data.success && response.data.data) {
            const { token, refreshToken } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
        }

        return response.data.data;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<{ success: boolean; data: AuthResponse }>(
            '/auth/register',
            data
        );

        if (response.data.success && response.data.data) {
            const { token, refreshToken } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
        }

        return response.data.data;
    },

    async getProfile(): Promise<User> {
        const response = await api.get<{ success: boolean; data: User }>(
            '/auth/profile'
        );
        return response.data.data;
    },

    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        await api.put('/auth/change-password', {
            oldPassword,
            newPassword,
        });
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    },
};

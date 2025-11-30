import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types';
import Login from './pages/auth/Login';
import Layout from './components/layout/Layout';

// Super Admin Pages
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import Organizations from './pages/super-admin/Organizations';
import GlobalUsers from './pages/super-admin/GlobalUsers';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Sites from './pages/admin/Sites';
import Supervisors from './pages/admin/Supervisors';
import Clients from './pages/admin/Clients';
import Reports from './pages/admin/Reports';
import Users from './pages/admin/Users';
import SubAdmins from './pages/admin/SubAdmins';

// Supervisor Pages
import SupervisorDashboard from './pages/supervisor/Dashboard';
import Attendance from './pages/supervisor/Attendance';
import SupervisorReports from './pages/supervisor/Reports';
import SupervisorTasks from './pages/supervisor/Tasks';
import DailyReports from './pages/supervisor/DailyReports';
import Resources from './pages/supervisor/Resources';

// Client Pages
import ClientDashboard from './pages/client/Dashboard';
import ClientSites from './pages/client/Sites';
import ClientReports from './pages/client/Reports';

// Sub Admin Pages
import SubAdminDashboard from './pages/sub-admin/Dashboard';
import SubAdminReports from './pages/sub-admin/Reports';

// Placeholders for other roles
const Unauthorized = () => <div className="p-8 text-red-600 text-xl font-bold">Unauthorized Access</div>;

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Super Admin Routes */}
            <Route
                path="/super-admin"
                element={
                    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<SuperAdminDashboard />} />
                <Route path="organizations" element={<Organizations />} />
                <Route path="users" element={<GlobalUsers />} />
                <Route path="settings" element={<div>Settings Placeholder</div>} />
            </Route>

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUB_ADMIN]}>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="sites" element={<Sites />} />
                <Route path="sub-admins" element={<SubAdmins />} />
                <Route path="supervisors" element={<Supervisors />} />
                <Route path="clients" element={<Clients />} />
                <Route path="reports" element={<Reports />} />
                <Route path="users" element={<Users />} />
            </Route>

            {/* Supervisor Routes */}
            <Route
                path="/supervisor"
                element={
                    <ProtectedRoute allowedRoles={[UserRole.SUPERVISOR]}>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<SupervisorDashboard />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="reports" element={<SupervisorReports />} />
                <Route path="daily-reports" element={<DailyReports />} />
                <Route path="resources" element={<Resources />} />
                <Route path="tasks" element={<SupervisorTasks />} />
            </Route>

            {/* Sub Admin Routes */}
            <Route
                path="/sub-admin"
                element={
                    <ProtectedRoute allowedRoles={[UserRole.SUB_ADMIN]}>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<SubAdminDashboard />} />
                <Route path="reports" element={<SubAdminReports />} />
            </Route>

            {/* Client Routes */}
            <Route
                path="/client"
                element={
                    <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<ClientDashboard />} />
                <Route path="sites" element={<ClientSites />} />
                <Route path="reports" element={<ClientReports />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;

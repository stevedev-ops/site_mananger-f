import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import {
    FaChartBar,
    FaBuilding,
    FaUsers,
    FaMapMarkedAlt,
    FaHardHat,
    FaFileAlt,
    FaSignOutAlt,
    FaClipboardList,
    FaClock,
    FaTasks,
    FaCog,
    FaUserTie
} from 'react-icons/fa';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNavItems = () => {
        switch (user?.role) {
            case UserRole.SUPER_ADMIN:
                return [
                    { path: '/super-admin', icon: FaChartBar, label: 'Dashboard', end: true },
                    { path: '/super-admin/organizations', icon: FaBuilding, label: 'Organizations' },
                    { path: '/super-admin/users', icon: FaUsers, label: 'Global Users' },
                    { path: '/super-admin/settings', icon: FaCog, label: 'Settings' },
                ];
            case UserRole.ADMIN:
                return [
                    { path: '/admin', icon: FaChartBar, label: 'Dashboard', end: true },
                    { path: '/admin/sites', icon: FaMapMarkedAlt, label: 'Sites' },
                    { path: '/admin/sub-admins', icon: FaUserTie, label: 'Sub Admins' },
                    { path: '/admin/supervisors', icon: FaHardHat, label: 'Supervisors' },
                    { path: '/admin/clients', icon: FaUsers, label: 'Clients' },
                    { path: '/admin/reports', icon: FaFileAlt, label: 'Reports' },
                    { path: '/admin/users', icon: FaUsers, label: 'Users' },
                ];
            case UserRole.SUPERVISOR:
                return [
                    { path: '/supervisor', icon: FaChartBar, label: 'Dashboard', end: true },
                    { path: '/supervisor/attendance', icon: FaClock, label: 'Attendance' },
                    { path: '/supervisor/daily-reports', icon: FaClipboardList, label: 'Daily Reports' },
                    { path: '/supervisor/resources', icon: FaBuilding, label: 'Resources' },
                    { path: '/supervisor/reports', icon: FaFileAlt, label: 'My Reports' },
                    { path: '/supervisor/tasks', icon: FaTasks, label: 'My Tasks' },
                ];
            case UserRole.SUB_ADMIN:
                return [
                    { path: '/sub-admin', icon: FaChartBar, label: 'Dashboard', end: true },
                    { path: '/sub-admin/reports', icon: FaFileAlt, label: 'Reports' },
                ];
            case UserRole.CLIENT:
                return [
                    { path: '/client', icon: FaChartBar, label: 'Dashboard', end: true },
                    { path: '/client/sites', icon: FaBuilding, label: 'My Projects' },
                    { path: '/client/reports', icon: FaFileAlt, label: 'Reports' },
                ];
            default:
                return [];
        }
    };

    return (
        <div className="bg-white w-64 min-h-screen flex flex-col border-r border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-blue-600">SiteManager</h1>
                <p className="text-xs text-gray-500 mt-1">Construction Platform</p>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {getNavItems().map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <item.icon className="text-lg" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <FaSignOutAlt />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

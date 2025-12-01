import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FaMapMarkedAlt, FaHardHat, FaFileAlt, FaExclamationTriangle, FaUsers } from 'react-icons/fa';

const StatCard: React.FC<{ title: string; value: string | number; icon: any; color: string }> = ({
    title,
    value,
    icon: Icon,
    color,
}) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
        <div className={`p-4 rounded-lg ${color} bg-opacity-10`}>
            <Icon className={`text-2xl ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        sites: 0,
        supervisors: 0,
        reports: 0,
        alerts: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [sitesRes, usersRes, reportsRes] = await Promise.all([
                    api.get('/sites'),
                    api.get('/users'),
                    api.get('/reports')
                ]);

                const sites = sitesRes.data.data.data || sitesRes.data.data || [];
                const users = usersRes.data.data.data || usersRes.data.data || [];
                const reports = reportsRes.data.data.data || reportsRes.data.data || [];

                const supervisors = users.filter((u: any) => u.role === 'SUPERVISOR').length;
                const pendingReports = reports.filter((r: any) => r.status === 'PENDING').length;

                setStats({
                    sites: sites.length,
                    supervisors,
                    reports: reports.length,
                    alerts: pendingReports, // Using pending reports as alerts for now
                });
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <div className="text-sm text-gray-500">
                    Organization Overview
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Sites"
                    value={stats.sites}
                    icon={FaMapMarkedAlt}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Supervisors"
                    value={stats.supervisors}
                    icon={FaHardHat}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Reports"
                    value={stats.reports}
                    icon={FaFileAlt}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Active Alerts"
                    value={stats.alerts}
                    icon={FaExclamationTriangle}
                    color="bg-red-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">New report submitted</p>
                                    <p className="text-xs text-gray-500">Site A - 2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Site Status</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">On Track</span>
                            <span className="text-green-600 font-medium">8 sites</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Delayed</span>
                            <span className="text-orange-600 font-medium">3 sites</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Critical</span>
                            <span className="text-red-600 font-medium">1 site</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => window.location.href = '/admin/users'}
                            className="p-4 border rounded-xl hover:bg-gray-50 text-center transition-colors group"
                        >
                            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FaUsers />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Create Sub Admin</span>
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin/sites'}
                            className="p-4 border rounded-xl hover:bg-gray-50 text-center transition-colors group"
                        >
                            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <FaMapMarkedAlt />
                            </div>
                            <span className="text-sm font-medium text-gray-700">New Site</span>
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin/supervisors'}
                            className="p-4 border rounded-xl hover:bg-gray-50 text-center transition-colors group"
                        >
                            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <FaHardHat />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Add Supervisor</span>
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin/reports'}
                            className="p-4 border rounded-xl hover:bg-gray-50 text-center transition-colors group"
                        >
                            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <FaFileAlt />
                            </div>
                            <span className="text-sm font-medium text-gray-700">View Reports</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

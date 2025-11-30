import React, { useEffect, useState } from 'react';
import { FaClipboardCheck, FaClock, FaTasks, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../services/api';

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

const SupervisorDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        pendingReports: 0,
        activeTasks: 0,
        attendanceStatus: 'Not Clocked In',
        alerts: 0,
    });
    const [sites, setSites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sitesRes, reportsRes, tasksRes] = await Promise.all([
                    api.get('/sites'),
                    api.get('/reports'),
                    api.get('/tasks')
                ]);

                if (sitesRes.data.success) {
                    setSites(sitesRes.data.data.data || sitesRes.data.data || []);
                }

                // Calculate stats
                const reports = reportsRes.data.data.data || reportsRes.data.data || [];
                const tasks = tasksRes.data.data.data || tasksRes.data.data || [];

                setStats({
                    pendingReports: reports.filter((r: any) => r.status === 'PENDING').length,
                    activeTasks: tasks.filter((t: any) => t.status !== 'COMPLETED').length,
                    attendanceStatus: 'Clocked In', // TODO: Fetch real attendance
                    alerts: 0, // TODO: Implement alerts
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Supervisor Dashboard</h1>
                <div className="text-sm text-gray-500">
                    Overview
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Attendance"
                    value={stats.attendanceStatus}
                    icon={FaClock}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Pending Reports"
                    value={stats.pendingReports}
                    icon={FaClipboardCheck}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Active Tasks"
                    value={stats.activeTasks}
                    icon={FaTasks}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Assigned Sites"
                    value={sites.length}
                    icon={FaExclamationTriangle}
                    color="bg-red-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">My Sites</h2>
                    {loading ? (
                        <p>Loading sites...</p>
                    ) : sites.length === 0 ? (
                        <p className="text-gray-500">No sites assigned yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {sites.map((site) => (
                                <div key={site.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        {site.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">{site.name}</p>
                                        <p className="text-xs text-gray-500">{site.location}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${site.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {site.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 border rounded-xl hover:bg-gray-50 text-center transition-colors">
                            <FaClipboardCheck className="text-2xl text-blue-500 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">New Report</span>
                        </button>
                        <button className="p-4 border rounded-xl hover:bg-gray-50 text-center transition-colors">
                            <FaTasks className="text-2xl text-purple-500 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">View Tasks</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboard;

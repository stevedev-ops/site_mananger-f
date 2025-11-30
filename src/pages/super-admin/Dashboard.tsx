import React, { useEffect, useState } from 'react';
import { FaBuilding, FaUsers, FaMapMarkedAlt, FaCheckCircle } from 'react-icons/fa';

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
        organizations: 0,
        users: 0,
        sites: 0,
        activeSites: 0,
    });

    useEffect(() => {
        // In a real app, we'd fetch global stats here
        // For now, using mock data or we could add a global stats endpoint
        setStats({
            organizations: 12,
            users: 450,
            sites: 89,
            activeSites: 64,
        });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Platform Overview</h1>
                <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Organizations"
                    value={stats.organizations}
                    icon={FaBuilding}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Users"
                    value={stats.users}
                    icon={FaUsers}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Sites"
                    value={stats.sites}
                    icon={FaMapMarkedAlt}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Active Projects"
                    value={stats.activeSites}
                    icon={FaCheckCircle}
                    color="bg-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Organizations</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        O{i}
                                    </div>
                                    <div>
                                        <p className="font-medium">Organization {i}</p>
                                        <p className="text-xs text-gray-500">Premium Plan</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                    Active
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">System Health</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">API Status</span>
                            <span className="text-green-500 font-medium">Operational</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Database</span>
                            <span className="text-green-500 font-medium">Connected</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Storage Usage</span>
                            <span className="text-blue-500 font-medium">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

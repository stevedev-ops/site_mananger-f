import React, { useEffect, useState } from 'react';
import { FaBuilding, FaHardHat, FaCheckCircle, FaClock } from 'react-icons/fa';

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

const ClientDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        activeSites: 0,
        completedSites: 0,
        totalReports: 0,
        daysActive: 0,
    });

    useEffect(() => {
        // Mock data fetch
        setStats({
            activeSites: 2,
            completedSites: 1,
            totalReports: 45,
            daysActive: 120,
        });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Client Dashboard</h1>
                <div className="text-sm text-gray-500">
                    Project Overview
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Sites"
                    value={stats.activeSites}
                    icon={FaBuilding}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Completed Projects"
                    value={stats.completedSites}
                    icon={FaCheckCircle}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Reports"
                    value={stats.totalReports}
                    icon={FaHardHat}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Days Active"
                    value={stats.daysActive}
                    icon={FaClock}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Project Progress</h2>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Downtown Plaza</span>
                                <span className="text-sm font-medium text-blue-600">75%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Westside Complex</span>
                                <span className="text-sm font-medium text-orange-600">30%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Updates</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Foundation work completed</p>
                                    <p className="text-xs text-gray-500">Downtown Plaza - 2 days ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;

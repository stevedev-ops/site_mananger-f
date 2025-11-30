import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaMapMarkerAlt, FaHardHat, FaFileAlt } from 'react-icons/fa';

interface Site {
    id: string;
    name: string;
    location: string;
    status: string;
    _count?: {
        users: number;
        reports: number;
    };
}

const ClientSites: React.FC = () => {
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        try {
            const response = await api.get('/sites'); // Should return assigned sites for client
            if (response.data.success) {
                setSites(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch sites', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        Loading projects...
                    </div>
                ) : sites.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
                        <p>No active projects found.</p>
                    </div>
                ) : (
                    sites.map((site) => (
                        <div key={site.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 relative">
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold">{site.name}</h3>
                                    <div className="flex items-center gap-1 text-sm opacity-90">
                                        <FaMapMarkerAlt /> {site.location}
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium bg-white/20 text-white backdrop-blur-sm`}>
                                        {site.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <FaHardHat className="mx-auto text-orange-500 mb-1" />
                                        <p className="text-lg font-bold text-gray-800">{site._count?.users || 0}</p>
                                        <p className="text-xs text-gray-500">Team Members</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <FaFileAlt className="mx-auto text-blue-500 mb-1" />
                                        <p className="text-lg font-bold text-gray-800">{site._count?.reports || 0}</p>
                                        <p className="text-xs text-gray-500">Reports</p>
                                    </div>
                                </div>

                                <button className="w-full btn-secondary text-blue-600 border-blue-200 hover:bg-blue-50">
                                    View Project Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ClientSites;

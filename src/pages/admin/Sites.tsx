import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

interface Site {
    id: string;
    name: string;
    location: string;
    status: string;
    _count?: {
        siteUsers: number;
        reports: number;
    };
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

const Sites: React.FC = () => {
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editMode, setEditMode] = useState(false);
    const [supervisors, setSupervisors] = useState<User[]>([]);
    const [clients, setClients] = useState<User[]>([]);
    const [subAdmins, setSubAdmins] = useState<User[]>([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedSubAdmin, setSelectedSubAdmin] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        gpsCoordinates: { latitude: 0, longitude: 0 },
    });

    const fetchSites = async () => {
        try {
            const response = await api.get('/sites');
            if (response.data.success) {
                setSites(response.data.data.data || response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch sites', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            if (response.data.success) {
                const users = response.data.data.data || response.data.data;
                setSupervisors(users.filter((u: User) => u.role === 'SUPERVISOR'));
                setClients(users.filter((u: User) => u.role === 'CLIENT'));
                setSubAdmins(users.filter((u: User) => u.role === 'SUB_ADMIN'));
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    useEffect(() => {
        fetchSites();
        fetchUsers();
    }, []);

    const filteredSites = sites.filter(site => {
        const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            site.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editMode && selectedSite) {
                await api.put(`/sites/${selectedSite.id}`, formData);
            } else {
                await api.post('/sites', formData);
            }
            setIsModalOpen(false);
            setEditMode(false);
            setSelectedSite(null);
            setFormData({ name: '', location: '', gpsCoordinates: { latitude: 0, longitude: 0 } });
            fetchSites();
        } catch (error) {
            console.error('Failed to save site', error);
        }
    };

    const handleEdit = (site: Site) => {
        setSelectedSite(site);
        setFormData({
            name: site.name,
            location: site.location,
            gpsCoordinates: { latitude: 0, longitude: 0 },
        });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this site?')) {
            try {
                await api.delete(`/sites/${id}`);
                fetchSites();
            } catch (error) {
                console.error('Failed to delete site', error);
            }
        }
    };

    const handleAssignUsers = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSite) return;

        try {
            if (selectedSupervisor) {
                await api.post(`/sites/${selectedSite.id}/users`, {
                    userId: selectedSupervisor,
                    role: 'SUPERVISOR'
                });
            }
            if (selectedClient) {
                await api.post(`/sites/${selectedSite.id}/users`, {
                    userId: selectedClient,
                    role: 'CLIENT'
                });
            }
            if (selectedSubAdmin) {
                await api.post(`/sites/${selectedSite.id}/users`, {
                    userId: selectedSubAdmin,
                    role: 'SUB_ADMIN'
                });
            }
            setIsAssignModalOpen(false);
            setSelectedSite(null);
            setSelectedSupervisor('');
            setSelectedClient('');
            fetchSites();
        } catch (error) {
            console.error('Failed to assign users', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Sites Management</h1>
                <button
                    onClick={() => {
                        setEditMode(false);
                        setSelectedSite(null);
                        setFormData({ name: '', location: '', gpsCoordinates: { latitude: 0, longitude: 0 } });
                        setIsModalOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <FaPlus /> New Site
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search sites..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="PLANNING">Planning</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="ON_HOLD">On Hold</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="p-4">Site Name</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Team Size</th>
                                <th className="p-4">Reports</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredSites.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No sites found
                                    </td>
                                </tr>
                            ) : (
                                filteredSites.map((site) => (
                                    <tr key={site.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800">{site.name}</td>
                                        <td className="p-4 flex items-center gap-2 text-gray-600">
                                            <FaMapMarkerAlt className="text-gray-400" />
                                            {site.location}
                                        </td>
                                        <td className="p-4 text-gray-600">{site._count?.siteUsers || 0}</td>
                                        <td className="p-4 text-gray-600">{site._count?.reports || 0}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${site.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                site.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {site.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedSite(site);
                                                    setIsAssignModalOpen(true);
                                                }}
                                                className="text-purple-600 hover:text-purple-800 p-1"
                                                title="Assign Users"
                                            >
                                                <FaUsers />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(site)}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(site.id)}
                                                className="text-red-600 hover:text-red-800 p-1"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Site Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditMode(false);
                    setSelectedSite(null);
                }}
                title={editMode ? 'Edit Site' : 'Create New Site'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Site Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-field"
                            placeholder="e.g. Downtown Plaza"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location Address
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="input-field"
                            placeholder="e.g. 123 Main St"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Latitude
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={formData.gpsCoordinates.latitude}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    gpsCoordinates: { ...formData.gpsCoordinates, latitude: parseFloat(e.target.value) || 0 }
                                })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Longitude
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={formData.gpsCoordinates.longitude}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    gpsCoordinates: { ...formData.gpsCoordinates, longitude: parseFloat(e.target.value) || 0 }
                                })}
                                className="input-field"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditMode(false);
                                setSelectedSite(null);
                            }}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editMode ? 'Update Site' : 'Create Site'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Assign Users Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => {
                    setIsAssignModalOpen(false);
                    setSelectedSite(null);
                    setSelectedSupervisor('');
                    setSelectedClient('');
                }}
                title={`Assign Users to ${selectedSite?.name}`}
            >
                <form onSubmit={handleAssignUsers} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assign Supervisor
                        </label>
                        <select
                            value={selectedSupervisor}
                            onChange={(e) => setSelectedSupervisor(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Select Supervisor</option>
                            {supervisors.map(sup => (
                                <option key={sup.id} value={sup.id}>{sup.name} ({sup.email})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assign Client
                        </label>
                        <select
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Select Client</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assign Sub Admin
                        </label>
                        <select
                            value={selectedSubAdmin}
                            onChange={(e) => setSelectedSubAdmin(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Select Sub Admin</option>
                            {subAdmins.map(user => (
                                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setIsAssignModalOpen(false);
                                setSelectedSite(null);
                            }}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Assign Users
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Sites;

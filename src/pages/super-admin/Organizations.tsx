import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

interface Organization {
    id: string;
    name: string;
    plan: string;
    isActive: boolean;
    _count?: {
        users: number;
        sites: number;
    };
}

const Organizations: React.FC = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [planFilter, setPlanFilter] = useState('all');
    const [formData, setFormData] = useState({ name: '', plan: 'FREE' });

    const fetchOrganizations = async () => {
        try {
            const response = await api.get('/organizations');
            if (response.data.success) {
                setOrganizations(response.data.data.data || response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch organizations', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const filteredOrganizations = organizations.filter(org => {
        const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = planFilter === 'all' || org.plan.toLowerCase() === planFilter.toLowerCase();
        return matchesSearch && matchesPlan;
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editMode && selectedOrg) {
                await api.put(`/organizations/${selectedOrg.id}`, formData);
            } else {
                await api.post('/organizations', formData);
            }
            setIsModalOpen(false);
            setEditMode(false);
            setSelectedOrg(null);
            setFormData({ name: '', plan: 'FREE' });
            fetchOrganizations();
        } catch (error) {
            console.error('Failed to save organization', error);
        }
    };

    const handleEdit = (org: Organization) => {
        setSelectedOrg(org);
        setFormData({ name: org.name, plan: org.plan });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this organization?')) {
            try {
                await api.delete(`/organizations/${id}`);
                fetchOrganizations();
            } catch (error) {
                console.error('Failed to delete organization', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Organizations</h1>
                <button
                    onClick={() => {
                        setEditMode(false);
                        setSelectedOrg(null);
                        setFormData({ name: '', plan: 'FREE' });
                        setIsModalOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <FaPlus /> New Organization
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search organizations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value)}
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Plans</option>
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Plan</th>
                                <th className="p-4">Users</th>
                                <th className="p-4">Sites</th>
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
                            ) : filteredOrganizations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No organizations found
                                    </td>
                                </tr>
                            ) : (
                                filteredOrganizations.map((org) => (
                                    <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800">{org.name}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${org.plan === 'PREMIUM' || org.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {org.plan}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">{org._count?.users || 0}</td>
                                        <td className="p-4 text-gray-600">{org._count?.sites || 0}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${org.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {org.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(org)}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(org.id)}
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditMode(false);
                    setSelectedOrg(null);
                }}
                title={editMode ? 'Edit Organization' : 'Create Organization'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Organization Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-field"
                            placeholder="e.g. Acme Construction"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subscription Plan
                        </label>
                        <select
                            value={formData.plan}
                            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                            className="input-field"
                        >
                            <option value="FREE">Free</option>
                            <option value="BASIC">Basic</option>
                            <option value="PREMIUM">Premium</option>
                            <option value="ENTERPRISE">Enterprise</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditMode(false);
                                setSelectedOrg(null);
                            }}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editMode ? 'Update Organization' : 'Create Organization'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Organizations;

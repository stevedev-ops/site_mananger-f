import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTools } from 'react-icons/fa';

interface Resource {
    id: string;
    name: string;
    type: string;
    quantity: number;
    unit: string;
    status: string;
    site?: {
        name: string;
    };
}

const Resources: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [sites, setSites] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        siteId: '',
        name: '',
        type: 'MATERIAL',
        quantity: 0,
        unit: '',
        status: 'AVAILABLE',
    });

    const fetchResources = async () => {
        try {
            const response = await api.get('/resources');
            if (response.data.success) {
                setResources(response.data.data.data || response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch resources', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSites = async () => {
        try {
            const response = await api.get('/sites');
            if (response.data.success) {
                setSites(response.data.data.data || response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch sites', error);
        }
    };

    useEffect(() => {
        fetchResources();
        fetchSites();
    }, []);

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || resource.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editMode && selectedResource) {
                await api.put(`/resources/${selectedResource.id}`, formData);
            } else {
                await api.post('/resources', formData);
            }
            setIsModalOpen(false);
            setEditMode(false);
            setSelectedResource(null);
            setFormData({
                siteId: '',
                name: '',
                type: 'MATERIAL',
                quantity: 0,
                unit: '',
                status: 'AVAILABLE',
            });
            fetchResources();
        } catch (error) {
            console.error('Failed to save resource', error);
        }
    };

    const handleEdit = (resource: Resource) => {
        setSelectedResource(resource);
        setFormData({
            siteId: '',
            name: resource.name,
            type: resource.type,
            quantity: resource.quantity,
            unit: resource.unit,
            status: resource.status,
        });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await api.delete(`/resources/${id}`);
                fetchResources();
            } catch (error) {
                console.error('Failed to delete resource', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Resources Management</h1>
                <button
                    onClick={() => {
                        setEditMode(false);
                        setSelectedResource(null);
                        setFormData({
                            siteId: '',
                            name: '',
                            type: 'MATERIAL',
                            quantity: 0,
                            unit: '',
                            status: 'AVAILABLE',
                        });
                        setIsModalOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <FaPlus /> Add Resource
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Types</option>
                        <option value="MATERIAL">Material</option>
                        <option value="EQUIPMENT">Equipment</option>
                        <option value="TOOL">Tool</option>
                        <option value="VEHICLE">Vehicle</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="p-4">Resource Name</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Quantity</th>
                                <th className="p-4">Site</th>
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
                            ) : filteredResources.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No resources found
                                    </td>
                                </tr>
                            ) : (
                                filteredResources.map((resource) => (
                                    <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <FaTools className="text-gray-400" />
                                                <span className="font-medium text-gray-800">{resource.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                                                {resource.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {resource.quantity} {resource.unit}
                                        </td>
                                        <td className="p-4 text-gray-600">{resource.site?.name || 'N/A'}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${resource.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                                                    resource.status === 'IN_USE' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {resource.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(resource)}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(resource.id)}
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
                    setSelectedResource(null);
                }}
                title={editMode ? 'Edit Resource' : 'Add Resource'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Site
                        </label>
                        <select
                            value={formData.siteId}
                            onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                            className="input-field"
                            required
                        >
                            <option value="">Select Site</option>
                            {sites.map(site => (
                                <option key={site.id} value={site.id}>{site.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Resource Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-field"
                            placeholder="e.g. Cement Bags"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="input-field"
                            >
                                <option value="MATERIAL">Material</option>
                                <option value="EQUIPMENT">Equipment</option>
                                <option value="TOOL">Tool</option>
                                <option value="VEHICLE">Vehicle</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="input-field"
                            >
                                <option value="AVAILABLE">Available</option>
                                <option value="IN_USE">In Use</option>
                                <option value="MAINTENANCE">Maintenance</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                className="input-field"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unit
                            </label>
                            <input
                                type="text"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="input-field"
                                placeholder="e.g. bags, units"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditMode(false);
                                setSelectedResource(null);
                            }}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editMode ? 'Update Resource' : 'Add Resource'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Resources;

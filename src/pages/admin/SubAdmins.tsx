import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserTie } from 'react-icons/fa';

interface SubAdmin {
    id: string;
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
}

const SubAdmins: React.FC = () => {
    const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedSubAdmin, setSelectedSubAdmin] = useState<SubAdmin | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'SUB_ADMIN',
    });

    const fetchSubAdmins = async () => {
        try {
            const response = await api.get('/users?role=SUB_ADMIN');
            if (response.data.success) {
                setSubAdmins(response.data.data.data || response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch sub admins', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubAdmins();
    }, []);

    const filteredSubAdmins = subAdmins.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editMode && selectedSubAdmin) {
                await api.put(`/users/${selectedSubAdmin.id}`, formData);
            } else {
                await api.post('/users', formData);
            }
            setIsModalOpen(false);
            setEditMode(false);
            setSelectedSubAdmin(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                role: 'SUB_ADMIN',
            });
            fetchSubAdmins();
        } catch (error) {
            console.error('Failed to save sub admin', error);
        }
    };

    const handleEdit = (subAdmin: SubAdmin) => {
        setSelectedSubAdmin(subAdmin);
        setFormData({
            name: subAdmin.name,
            email: subAdmin.email,
            password: '',
            phone: subAdmin.phone || '',
            role: 'SUB_ADMIN',
        });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this sub admin?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchSubAdmins();
            } catch (error) {
                console.error('Failed to delete sub admin', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Sub Admins</h1>
                <button
                    onClick={() => {
                        setEditMode(false);
                        setSelectedSubAdmin(null);
                        setFormData({ name: '', email: '', password: '', phone: '', role: 'SUB_ADMIN' });
                        setIsModalOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <FaPlus /> New Sub Admin
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search sub admins..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredSubAdmins.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No sub admins found
                                    </td>
                                </tr>
                            ) : (
                                filteredSubAdmins.map((subAdmin) => (
                                    <tr key={subAdmin.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                    <FaUserTie />
                                                </div>
                                                <span className="font-medium text-gray-800">{subAdmin.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm">
                                                <p className="text-gray-800">{subAdmin.email}</p>
                                                <p className="text-gray-500">{subAdmin.phone || 'No phone'}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${subAdmin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {subAdmin.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(subAdmin)}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(subAdmin.id)}
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
                    setSelectedSubAdmin(null);
                }}
                title={editMode ? 'Edit Sub Admin' : 'Add New Sub Admin'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="input-field"
                            required
                            disabled={editMode}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    {!editMode && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input-field"
                                required={!editMode}
                            />
                        </div>
                    )}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditMode(false);
                                setSelectedSubAdmin(null);
                            }}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editMode ? 'Update Sub Admin' : 'Create Sub Admin'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SubAdmins;

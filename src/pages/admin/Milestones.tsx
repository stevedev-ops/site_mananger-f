import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaClock } from 'react-icons/fa';

interface Milestone {
    id: string;
    title: string;
    description?: string;
    targetDate: string;
    completedDate?: string;
    percentComplete: number;
    site: {
        id: string;
        name: string;
    };
}

const Milestones: React.FC = () => {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [sites, setSites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
    const [formData, setFormData] = useState({
        siteId: '',
        title: '',
        description: '',
        targetDate: '',
        percentComplete: 0,
    });

    useEffect(() => {
        fetchMilestones();
        fetchSites();
    }, []);

    const fetchMilestones = async () => {
        try {
            const response = await api.get('/milestones');
            if (response.data.success) {
                setMilestones(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch milestones', error);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editMode && selectedMilestone) {
                await api.put(`/milestones/${selectedMilestone.id}`, formData);
            } else {
                await api.post('/milestones', formData);
            }
            setIsModalOpen(false);
            setEditMode(false);
            setSelectedMilestone(null);
            resetForm();
            fetchMilestones();
        } catch (error) {
            console.error('Failed to save milestone', error);
        }
    };

    const handleEdit = (milestone: Milestone) => {
        setSelectedMilestone(milestone);
        setFormData({
            siteId: milestone.site.id,
            title: milestone.title,
            description: milestone.description || '',
            targetDate: milestone.targetDate.split('T')[0],
            percentComplete: milestone.percentComplete,
        });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this milestone?')) {
            try {
                await api.delete(`/milestones/${id}`);
                fetchMilestones();
            } catch (error) {
                console.error('Failed to delete milestone', error);
            }
        }
    };

    const updateProgress = async (id: string, percentComplete: number) => {
        try {
            await api.patch(`/milestones/${id}/progress`, { percentComplete });
            fetchMilestones();
        } catch (error) {
            console.error('Failed to update progress', error);
        }
    };

    const resetForm = () => {
        setFormData({
            siteId: '',
            title: '',
            description: '',
            targetDate: '',
            percentComplete: 0,
        });
    };

    const getStatusColor = (milestone: Milestone) => {
        if (milestone.percentComplete >= 100) return 'bg-green-100 text-green-700';
        const daysUntilTarget = Math.ceil((new Date(milestone.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilTarget < 0) return 'bg-red-100 text-red-700';
        if (daysUntilTarget < 7) return 'bg-orange-100 text-orange-700';
        return 'bg-blue-100 text-blue-700';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Milestones</h1>
                <button
                    onClick={() => {
                        setEditMode(false);
                        setSelectedMilestone(null);
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <FaPlus /> Add Milestone
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        Loading milestones...
                    </div>
                ) : milestones.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500">No milestones found</p>
                    </div>
                ) : (
                    milestones.map((milestone) => (
                        <div key={milestone.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">{milestone.title}</h3>
                                        <p className="text-sm text-gray-500">{milestone.site.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(milestone)}
                                            className="text-blue-600 hover:text-blue-800 p-1"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(milestone.id)}
                                            className="text-red-600 hover:text-red-800 p-1"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                {milestone.description && (
                                    <p className="text-sm text-gray-600 mb-4">{milestone.description}</p>
                                )}

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Progress</span>
                                        <span className="font-bold text-gray-800">{milestone.percentComplete}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all"
                                            style={{ width: `${milestone.percentComplete}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        {milestone.percentComplete >= 100 ? (
                                            <span className="flex items-center gap-1 text-green-600">
                                                <FaCheckCircle /> Completed
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-gray-600">
                                                <FaClock /> Target: {new Date(milestone.targetDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(milestone)}`}>
                                        {milestone.percentComplete >= 100 ? 'Complete' :
                                            Math.ceil((new Date(milestone.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) < 0 ? 'Overdue' :
                                                Math.ceil((new Date(milestone.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) < 7 ? 'Due Soon' :
                                                    'On Track'}
                                    </span>

                                    {milestone.percentComplete < 100 && (
                                        <div className="pt-3 border-t">
                                            <label className="block text-xs text-gray-600 mb-2">Update Progress</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={milestone.percentComplete}
                                                onChange={(e) => updateProgress(milestone.id, parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditMode(false);
                    setSelectedMilestone(null);
                }}
                title={editMode ? 'Edit Milestone' : 'Add Milestone'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input-field"
                            placeholder="e.g. Foundation Complete"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input-field"
                            rows={3}
                            placeholder="Optional description..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                        <input
                            type="date"
                            value={formData.targetDate}
                            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Initial Progress: {formData.percentComplete}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.percentComplete}
                            onChange={(e) => setFormData({ ...formData, percentComplete: parseInt(e.target.value) })}
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditMode(false);
                                setSelectedMilestone(null);
                            }}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editMode ? 'Update Milestone' : 'Create Milestone'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Milestones;

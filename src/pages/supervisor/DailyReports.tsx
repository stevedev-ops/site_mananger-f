import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import { FaPlus, FaFileAlt, FaSearch, FaEye } from 'react-icons/fa';

interface Report {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    site?: {
        name: string;
    };
}

const DailyReports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sites, setSites] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        siteId: '',
        title: '',
        description: '',
        workCompleted: '',
        issues: '',
        weatherConditions: '',
        workersPresent: 0,
    });

    const fetchReports = async () => {
        try {
            const response = await api.get('/reports');
            if (response.data.success) {
                setReports(response.data.data.data || response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch reports', error);
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
        fetchReports();
        fetchSites();
    }, []);

    const filteredReports = reports.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/reports', formData);
            setIsModalOpen(false);
            setFormData({
                siteId: '',
                title: '',
                description: '',
                workCompleted: '',
                issues: '',
                weatherConditions: '',
                workersPresent: 0,
            });
            fetchReports();
        } catch (error) {
            console.error('Failed to create report', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Daily Reports</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <FaPlus /> Submit Report
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reports..."
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
                                <th className="p-4">Date</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Site</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No reports found
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-600">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <FaFileAlt className="text-blue-500" />
                                                <span className="font-medium text-gray-800">{report.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">{report.site?.name || 'N/A'}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${report.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                    report.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-blue-600 hover:text-blue-800 p-1">
                                                <FaEye />
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
                onClose={() => setIsModalOpen(false)}
                title="Submit Daily Report"
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
                            Report Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input-field"
                            placeholder="e.g. Daily Progress - Foundation Work"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Work Completed
                        </label>
                        <textarea
                            value={formData.workCompleted}
                            onChange={(e) => setFormData({ ...formData, workCompleted: e.target.value })}
                            className="input-field"
                            rows={3}
                            placeholder="Describe work completed today..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issues/Challenges
                        </label>
                        <textarea
                            value={formData.issues}
                            onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                            className="input-field"
                            rows={2}
                            placeholder="Any issues encountered..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Weather Conditions
                            </label>
                            <input
                                type="text"
                                value={formData.weatherConditions}
                                onChange={(e) => setFormData({ ...formData, weatherConditions: e.target.value })}
                                className="input-field"
                                placeholder="e.g. Sunny, 25°C"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Workers Present
                            </label>
                            <input
                                type="number"
                                value={formData.workersPresent}
                                onChange={(e) => setFormData({ ...formData, workersPresent: parseInt(e.target.value) || 0 })}
                                className="input-field"
                                min="0"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Notes
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input-field"
                            rows={2}
                            placeholder="Any additional notes..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Submit Report
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DailyReports;

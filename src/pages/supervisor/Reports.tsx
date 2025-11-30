import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import { FaPlus, FaSearch } from 'react-icons/fa';

interface Report {
    id: string;
    reportDate: string;
    status: string;
    content: string;
    site: { name: string };
}

const SupervisorReports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sites, setSites] = useState<{ id: string; name: string }[]>([]);
    const [formData, setFormData] = useState({
        siteId: '',
        content: '',
        reportDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchReports();
        fetchSites();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await api.get('/reports'); // Should return reports for this supervisor
            if (response.data.success) {
                setReports(response.data.data);
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
                setSites(response.data.data);
                if (response.data.data.length > 0) {
                    setFormData(prev => ({ ...prev, siteId: response.data.data[0].id }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch sites', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/reports', {
                ...formData,
                reportDate: new Date(formData.reportDate).toISOString(),
            });
            setIsModalOpen(false);
            setFormData({
                siteId: sites[0]?.id || '',
                content: '',
                reportDate: new Date().toISOString().split('T')[0],
            });
            fetchReports();
        } catch (error) {
            console.error('Failed to create report', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">My Reports</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <FaPlus /> New Report
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Site</th>
                                <th className="p-4">Content Preview</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No reports found
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-800">
                                            {new Date(report.reportDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-gray-600">{report.site.name}</td>
                                        <td className="p-4 text-gray-500 truncate max-w-xs">
                                            {report.content}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${report.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                report.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {report.status}
                                            </span>
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
                            Select Site
                        </label>
                        <select
                            value={formData.siteId}
                            onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                            className="input-field"
                            required
                        >
                            <option value="" disabled>Select a site</option>
                            {sites.map((site) => (
                                <option key={site.id} value={site.id}>
                                    {site.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            value={formData.reportDate}
                            onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Report Content
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="input-field h-32"
                            placeholder="Describe today's activities, issues, and progress..."
                            required
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

export default SupervisorReports;

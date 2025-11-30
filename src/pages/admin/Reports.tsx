import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import { FaFileAlt, FaCheck, FaTimes, FaSearch, FaComment } from 'react-icons/fa';

interface Report {
    id: string;
    reportDate: string;
    status: string;
    content: string;
    site: { name: string };
    supervisor: { name: string };
    _count: { photos: number; comments: number };
}

const Reports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchReports = async () => {
        try {
            const response = await api.get('/reports');
            if (response.data.success) {
                setReports(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch reports', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await api.put(`/reports/${id}/status`, { status });
            fetchReports();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to update report status', error);
        }
    };

    const openReportDetails = (report: Report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Daily Reports</h1>
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
                    <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Site</th>
                                <th className="p-4">Supervisor</th>
                                <th className="p-4">Content Preview</th>
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
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
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
                                        <td className="p-4 text-gray-600">{report.supervisor.name}</td>
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
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => openReportDetails(report)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                            >
                                                View Details
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
                title="Report Details"
            >
                {selectedReport && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Site</p>
                                <p className="font-medium text-gray-800">{selectedReport.site.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Supervisor</p>
                                <p className="font-medium text-gray-800">{selectedReport.supervisor.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Date</p>
                                <p className="font-medium text-gray-800">
                                    {new Date(selectedReport.reportDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Status</p>
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${selectedReport.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        selectedReport.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {selectedReport.status}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Report Content</h3>
                            <div className="bg-gray-50 p-4 rounded-lg text-gray-800 text-sm whitespace-pre-wrap">
                                {selectedReport.content}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <FaFileAlt /> {selectedReport._count.photos} Photos
                            </span>
                            <span className="flex items-center gap-1">
                                <FaComment /> {selectedReport._count.comments} Comments
                            </span>
                        </div>

                        {selectedReport.status === 'PENDING' && (
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    onClick={() => handleStatusUpdate(selectedReport.id, 'REJECTED')}
                                    className="btn-secondary text-red-600 hover:bg-red-50 border-red-200"
                                >
                                    <FaTimes className="inline mr-2" /> Reject
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedReport.id, 'APPROVED')}
                                    className="btn-primary bg-green-600 hover:bg-green-700 border-green-600"
                                >
                                    <FaCheck className="inline mr-2" /> Approve
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Reports;

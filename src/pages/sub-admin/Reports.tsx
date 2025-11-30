import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import { FaFileAlt, FaSearch, FaEye, FaMapMarkerAlt, FaUserTie, FaCheck, FaTimes, FaComment } from 'react-icons/fa';

interface Report {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    site?: {
        name: string;
    };
    supervisor?: {
        name: string;
    };
    workCompleted?: string;
    issues?: string;
    weatherConditions?: string;
    workersPresent?: number;
    comments?: Comment[];
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        name: string;
        role: string;
    };
}

const SubAdminReports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newComment, setNewComment] = useState('');

    const fetchReports = async () => {
        try {
            const response = await api.get('/reports');
            if (response.data.success) {
                setReports(response.data.data.data || response.data.data || []);
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

    const filteredReports = reports.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.site?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewReport = (report: Report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const handleAddComment = async () => {
        if (!selectedReport || !newComment.trim()) return;

        try {
            await api.post(`/reports/${selectedReport.id}/comments`, {
                content: newComment
            });
            setNewComment('');
            // Refresh report details
            const response = await api.get(`/reports/${selectedReport.id}`);
            if (response.data.success) {
                setSelectedReport(response.data.data);
                // Also update list
                fetchReports();
            }
        } catch (error) {
            console.error('Failed to add comment', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Site Reports</h1>
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
                                <th className="p-4">Supervisor</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        Loading reports...
                                    </td>
                                </tr>
                            ) : filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No reports found.
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
                                        <td className="p-4 text-gray-600">{report.supervisor?.name || 'N/A'}</td>
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
                                                onClick={() => handleViewReport(report)}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                            >
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
                title="Report Details"
            >
                {selectedReport && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{selectedReport.title}</h3>
                                <p className="text-sm text-gray-500">
                                    Submitted on {new Date(selectedReport.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`px-3 py-1 text-sm rounded-full font-medium ${selectedReport.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    selectedReport.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                }`}>
                                {selectedReport.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-1">
                                    <FaMapMarkerAlt />
                                    <span className="text-sm font-medium">Site</span>
                                </div>
                                <p className="font-medium text-gray-800">{selectedReport.site?.name}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-1">
                                    <FaUserTie />
                                    <span className="text-sm font-medium">Supervisor</span>
                                </div>
                                <p className="font-medium text-gray-800">{selectedReport.supervisor?.name}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Work Completed</h4>
                            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {selectedReport.workCompleted || 'No details provided'}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Issues / Challenges</h4>
                            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {selectedReport.issues || 'None reported'}
                            </p>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                                <FaComment className="text-blue-500" /> Remarks & Comments
                            </h4>

                            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                                {selectedReport.comments?.map((comment) => (
                                    <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-sm text-gray-800">{comment.user.name}</span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{comment.content}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a remark..."
                                    className="flex-1 input-field"
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim()}
                                    className="btn-primary"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="btn-secondary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SubAdminReports;

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaCheckCircle, FaRegCircle, FaTasks } from 'react-icons/fa';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    site: { name: string };
}

const SupervisorTasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks'); // Should return tasks assigned to supervisor
            if (response.data.success) {
                setTasks(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await api.put(`/tasks/${id}/status`, { status: newStatus });
            fetchTasks();
        } catch (error) {
            console.error('Failed to update task status', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        Loading tasks...
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
                        <FaTasks className="mx-auto text-4xl mb-4 text-gray-300" />
                        <p>No tasks assigned to you.</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                        task.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-100 text-blue-700'
                                    }`}>
                                    {task.priority} Priority
                                </span>
                                <span className="text-xs text-gray-500">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-2">{task.title}</h3>
                            <p className="text-sm text-gray-600 mb-4 flex-1">{task.description}</p>

                            <div className="text-xs text-gray-500 mb-4">
                                Site: {task.site.name}
                            </div>

                            <div className="pt-4 border-t mt-auto">
                                {task.status === 'COMPLETED' ? (
                                    <button
                                        disabled
                                        className="w-full py-2 bg-green-50 text-green-600 rounded-lg flex items-center justify-center gap-2 font-medium cursor-default"
                                    >
                                        <FaCheckCircle /> Completed
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStatusUpdate(task.id, 'COMPLETED')}
                                        className="w-full py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
                                    >
                                        <FaRegCircle /> Mark as Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SupervisorTasks;

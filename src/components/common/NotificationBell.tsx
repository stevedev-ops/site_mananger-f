import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaBell, FaCheck, FaTrash, FaTimes } from 'react-icons/fa';

interface Notification {
    id: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: string;
    metadata?: any;
}

const NotificationBell: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUnreadCount();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchUnreadCount = async () => {
        try {
            const response = await api.get('/notifications/unread-count');
            if (response.data.success) {
                setUnreadCount(response.data.data.count);
            }
        } catch (error) {
            console.error('Failed to fetch unread count', error);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await api.get('/notifications?limit=10');
            if (response.data.success) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(Math.max(0, unreadCount - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n.id !== id));
            const deletedNotif = notifications.find(n => n.id === id);
            if (deletedNotif && !deletedNotif.read) {
                setUnreadCount(Math.max(0, unreadCount - 1));
            }
        } catch (error) {
            console.error('Failed to delete notification', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        const iconClass = "text-lg";
        switch (type) {
            case 'LOW_RESOURCE':
                return <span className={`${iconClass} text-red-500`}>⚠️</span>;
            case 'REPORT_SUBMITTED':
                return <span className={`${iconClass} text-blue-500`}>📄</span>;
            case 'REPORT_APPROVED':
                return <span className={`${iconClass} text-green-500`}>✅</span>;
            case 'REPORT_REJECTED':
                return <span className={`${iconClass} text-red-500`}>❌</span>;
            case 'TASK_ASSIGNED':
                return <span className={`${iconClass} text-purple-500`}>📋</span>;
            case 'TASK_DUE':
                return <span className={`${iconClass} text-orange-500`}>⏰</span>;
            case 'COMMENT_ADDED':
                return <span className={`${iconClass} text-blue-500`}>💬</span>;
            default:
                return <span className={`${iconClass} text-gray-500`}>🔔</span>;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border z-50 max-h-[500px] flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">Notifications</h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">
                                    Loading...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No notifications
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-700'
                                                        }`}>
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatTime(notification.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-1 text-blue-600 hover:text-blue-800"
                                                            title="Mark as read"
                                                        >
                                                            <FaCheck className="text-xs" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-1 text-red-600 hover:text-red-800"
                                                        title="Delete"
                                                    >
                                                        <FaTrash className="text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;

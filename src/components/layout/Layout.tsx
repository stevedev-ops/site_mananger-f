import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationBell from '../common/NotificationBell';

const Layout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col h-screen">
                <header className="bg-white border-b px-8 py-4 flex items-center justify-end">
                    <NotificationBell />
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;

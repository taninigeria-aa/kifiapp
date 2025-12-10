import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar for Desktop */}
            <Sidebar />

            {/* Main Content Areas */}
            <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
                <TopBar />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 pb-20 md:pb-6">
                    {children}
                </main>

                {/* Bottom Nav for Mobile */}
                <BottomNav />
            </div>
        </div>
    );
};

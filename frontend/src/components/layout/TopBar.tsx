import { Bell, Menu, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopBar = () => {
    const { user } = useAuth();

    return (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center">
                <button className="md:hidden mr-4 text-gray-500 hover:text-gray-900">
                    <Menu className="h-6 w-6" />
                </button>
                <span className="md:hidden text-lg font-bold text-gray-900">TaniTrack</span>
                <h1 className="hidden md:block text-xl font-semibold text-gray-800">
                    {/* Default Title, will be dynamic later */}
                    Dashboard
                </h1>
            </div>

            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-gray-500">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                <div className="hidden md:flex items-center space-x-2">
                    <div className="bg-blue-100 p-1.5 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.full_name}</span>
                </div>
            </div>
        </div>
    );
};

import { NavLink } from 'react-router-dom';
import { Home, Fish, BarChart, LogOut, Users, Package, Activity, Layers, Building } from 'lucide-react';
import { NairaSign } from '../icons/NairaSign';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

const navItems = [
    { icon: Home, label: 'Dashboard', to: '/' },
    { icon: Layers, label: 'Batches', to: '/batches' },
    { icon: Fish, label: 'Spawns', to: '/spawns' },
    { icon: NairaSign, label: 'Sales', to: '/sales' },
    { icon: Users, label: 'Customers', to: '/customers' },
    { icon: Package, label: 'Feed', to: '/feed' },
    { icon: Activity, label: 'Expenses', to: '/expenses' },
    { icon: BarChart, label: 'Financials', to: '/financial-dashboard' },
    { icon: Users, label: 'Staff', to: '/workers' },
    { icon: Building, label: 'Suppliers', to: '/suppliers' },
];

export const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-50 bg-white border-r border-gray-200">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
                <h1 className="text-xl font-bold text-gray-900">TaniTrack</h1>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <p className="text-sm font-medium text-gray-900">{user?.full_name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Role'}</p>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto pt-4 pb-4">
                <nav className="flex-1 px-2 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                                    isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )
                            }
                        >
                            <item.icon
                                className={cn(
                                    'mr-3 flex-shrink-0 h-6 w-6',
                                    // isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500' 
                                    // keeping icon color consistent with text for now via parent class
                                )}
                                aria-hidden="true"
                            />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                    <LogOut className="mr-3 h-6 w-6" />
                    Logout
                </button>
            </div>
        </div>
    );
};

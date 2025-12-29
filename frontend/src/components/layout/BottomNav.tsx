import { NavLink } from 'react-router-dom';
import { Home, Fish, Layers, Building, Users } from 'lucide-react';
import { cn } from '../../lib/utils';


// Mobile only shows 5 primary items
const navItems = [
    { icon: Home, label: 'Home', to: '/dashboard' },
    { icon: Fish, label: 'Spawns', to: '/spawns' },
    { icon: Layers, label: 'Batches', to: '/batches' },
    { icon: Building, label: 'Tanks', to: '/tanks' },
    { icon: Users, label: 'Staff', to: '/workers' },
];

export const BottomNav = () => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                'flex flex-col items-center justify-center w-full h-full space-y-1',
                                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                            )
                        }
                    >
                        <item.icon className="h-6 w-6" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

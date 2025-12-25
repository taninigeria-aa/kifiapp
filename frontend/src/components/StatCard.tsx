import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendDirection?: 'up' | 'down';
    color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
    onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    trendDirection,
    color = 'blue',
    onClick
}) => {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-green-50 text-green-700',
        orange: 'bg-orange-50 text-orange-700',
        purple: 'bg-purple-50 text-purple-700',
        red: 'bg-red-50 text-red-700',
    };

    return (
        <div
            className={cn(
                "bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-200",
                onClick && "cursor-pointer hover:shadow-md hover:border-blue-200"
            )}
            onClick={onClick}
        >
            <div className="flex items-center">
                <div className={cn("p-3 rounded-lg", colorStyles[color])}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd>
                            <div className="text-2xl font-bold text-gray-900">{value}</div>
                        </dd>
                    </dl>
                </div>
            </div>
            {trend && (
                <div className="mt-2 flex items-center text-sm">
                    {trendDirection === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={cn(trendDirection === 'up' ? "text-green-600" : "text-red-600", "font-medium")}>
                        {trend}
                    </span>
                    <span className="text-gray-400 ml-1">vs last week</span>
                </div>
            )}
        </div>
    );
};

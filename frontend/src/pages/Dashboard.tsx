import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/StatCard';
import { Fish, Layers, Sprout, Plus, ClipboardList } from 'lucide-react';
import { NairaSign } from '../components/icons/NairaSign';
import api from '../lib/api';

interface DashboardSummary {
    active_batches: number;
    total_fish: number;
    spawns_this_week: number;
    sales_this_week: number;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/dashboard/summary');
                if (response.data.success) {
                    setSummary(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    return (
        <AppLayout>
            <div className="space-y-6">

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                        <p className="text-gray-500">Welcome back to TaniTrack.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/spawns/new')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Spawn
                        </button>
                        <button
                            onClick={() => navigate('/feed/log')}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-colors text-sm font-medium"
                        >
                            <ClipboardList className="w-4 h-4 mr-2" />
                            Log Feed
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    <StatCard
                        title="Active Batches"
                        value={loading ? '-' : summary?.active_batches || 0}
                        icon={Layers}
                        color="blue"
                    />

                    <StatCard
                        title="Total Fish Stock"
                        value={loading ? '-' : summary?.total_fish?.toLocaleString() || 0}
                        icon={Fish}
                        color="green"
                    />

                    <StatCard
                        title="Spawns (Week)"
                        value={loading ? '-' : summary?.spawns_this_week || 0}
                        icon={Sprout}
                        color="purple"
                    />

                    <StatCard
                        title="Sales (Week)"
                        value={loading ? '-' : `₦${summary?.sales_this_week?.toLocaleString() || 0} `}
                        icon={NairaSign}
                        color="orange"
                    />
                </div>

                {/* Empty State / Coming Soon Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[300px] flex flex-col justify-center items-center text-center">
                        <div className="bg-blue-50 p-4 rounded-full mb-4">
                            <ClipboardList className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Today's Tasks</h3>
                        <p className="text-gray-500 max-w-xs mt-2">Task management coming soon. You'll see feeding schedules and health checks here.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[300px] flex flex-col justify-center items-center text-center">
                        <div className="bg-green-50 p-4 rounded-full mb-4">
                            <Fish className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                        <p className="text-gray-500 max-w-xs mt-2">Activity feed coming soon. Tracks all important hatchery events.</p>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}

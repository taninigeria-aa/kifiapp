import { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Filter, Pencil, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import type { Spawn } from '../../types';

type SortKey = 'date' | 'code' | 'status';

export default function SpawnList() {
    const navigate = useNavigate();
    const [spawns, setSpawns] = useState<Spawn[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
        key: 'date',
        direction: 'desc'
    });

    useEffect(() => {
        fetchSpawns();
    }, []);

    const fetchSpawns = async () => {
        try {
            const response = await api.get('/spawns');
            if (response.data.success) {
                setSpawns(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch spawns', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key: SortKey) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedSpawns = useMemo(() => {
        return [...spawns].sort((a, b) => {
            let aValue: string | number = '';
            let bValue: string | number = '';

            switch (sortConfig.key) {
                case 'date':
                    aValue = new Date(a.spawn_date).getTime();
                    bValue = new Date(b.spawn_date).getTime();
                    break;
                case 'code':
                    aValue = a.spawn_code;
                    bValue = b.spawn_code;
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [spawns, sortConfig]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Incubating': return 'bg-yellow-100 text-yellow-800';
            case 'Hatched': return 'bg-green-100 text-green-800';
            case 'Failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const SortIcon = ({ column }: { column: SortKey }) => {
        if (sortConfig.key !== column) return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-50" />;
        return <ArrowUpDown className={`w-4 h-4 ml-1 ${sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-blue-600 rotate-180'}`} />;
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Spawning Records</h2>
                        <p className="text-gray-500">Manage your fish breeding events.</p>
                    </div>
                    <div className="flex gap-2">
                        {/* Broodstock link removed/modified per simplification preference, preserving existing code if needed but focusing on Spawns */}
                        <Link
                            to="/spawns/new"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Spawn
                        </Link>
                    </div>
                </div>

                {/* Filters & Search - Visual only for now */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search spawns..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center text-gray-700">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                </div>

                {/* List Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                        onClick={() => handleSort('date')}
                                    >
                                        <div className="flex items-center">Date <SortIcon column="date" /></div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                        onClick={() => handleSort('code')}
                                    >
                                        <div className="flex items-center">Spawn Code <SortIcon column="code" /></div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parents (F / M)</th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center">Status <SortIcon column="status" /></div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Eggs</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                                    </tr>
                                ) : sortedSpawns.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No spawns recorded yet.</td>
                                    </tr>
                                ) : (
                                    sortedSpawns.map((spawn) => (
                                        <tr key={spawn.spawn_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {format(new Date(spawn.spawn_date), 'dd MMM yyyy')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                {spawn.spawn_code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {spawn.female_code} x {spawn.male_code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(spawn.status)}`}>
                                                    {spawn.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {spawn.estimated_eggs?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => navigate(`/spawns/${spawn.spawn_id}/edit`)}
                                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

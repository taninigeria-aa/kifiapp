import { useEffect, useState, useMemo } from 'react';
import { Plus, Layers, Pencil, ArrowUpDown, Eye, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import type { Batch } from '../../types';
import { generateProductionReport } from '../../utils/pdfGenerator';

type SortKey = 'date' | 'code';

export default function BatchList() {
    const navigate = useNavigate();
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
        key: 'date',
        direction: 'desc'
    });

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const response = await api.get('/production/batches');
                if (response.data.success) {
                    setBatches(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch batches', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBatches();
    }, []);

    const handleDownloadReport = async () => {
        setDownloading(true);
        try {
            const response = await api.get('/production/batches/report/production');
            if (response.data.success) {
                generateProductionReport(response.data.data);
            }
        } catch (error) {
            console.error('Failed to generate report', error);
            alert('Failed to generate production report');
        } finally {
            setDownloading(false);
        }
    };

    const handleSort = (key: SortKey) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedBatches = useMemo(() => {
        return [...batches].sort((a, b) => {
            let aValue: any = '';
            let bValue: any = '';

            switch (sortConfig.key) {
                case 'date':
                    aValue = new Date(a.start_date).getTime();
                    bValue = new Date(b.start_date).getTime();
                    break;
                case 'code':
                    aValue = a.batch_code;
                    bValue = b.batch_code;
                    break;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [batches, sortConfig]);

    // Helper to calculate days active
    const getDaysActive = (startDate: string) => {
        const start = new Date(startDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const SortIcon = ({ column }: { column: SortKey }) => {
        if (sortConfig.key !== column) return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-50" />;
        return <ArrowUpDown className={`w-4 h-4 ml-1 ${sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-blue-600 rotate-180'}`} />;
    };

    return (
        <AppLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Production Batches</h2>
                        <p className="text-gray-500">Monitor and manage your fish batches.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDownloadReport}
                            disabled={downloading}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {downloading ? 'Generating...' : 'Download Report'}
                        </button>
                        <Link
                            to="/batches/new"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Batch
                        </Link>
                    </div>
                </div>

                {/* List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                        onClick={() => handleSort('code')}
                                    >
                                        <div className="flex items-center">Batch Code <SortIcon column="code" /></div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                        onClick={() => handleSort('date')}
                                    >
                                        <div className="flex items-center">Start Date <SortIcon column="date" /></div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tank</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Days</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                                    </tr>
                                ) : sortedBatches.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            <Layers className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                            <p>No active batches found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    sortedBatches.map((batch) => (
                                        <tr key={batch.batch_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                {batch.batch_code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(batch.start_date), 'dd/MM/yyyy')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {batch.tank_name || 'Unassigned'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {batch.current_count?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {batch.current_stage}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {getDaysActive(batch.start_date)} days
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => navigate(`/ production / batches / ${batch.batch_id} `)}
                                                    className="text-gray-400 hover:text-blue-600 transition-colors mr-2"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/ production / batches / edit / ${batch.batch_id} `)}
                                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Edit Batch"
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

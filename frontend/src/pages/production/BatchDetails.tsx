import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, ArrowRightLeft, TrendingUp, History } from 'lucide-react';
import { format } from 'date-fns';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import type { Batch } from '../../types';

interface GrowthSample {
    sample_id: number;
    sample_date: string;
    avg_weight_g: number;
    sample_size: number;
    notes: string;
}

interface BatchMovement {
    movement_id: number;
    from_tank_name: string;
    to_tank_name: string;
    movement_date: string;
    notes: string;
}

export default function BatchDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [batch, setBatch] = useState<Batch | null>(null);
    const [growthSamples, setGrowthSamples] = useState<GrowthSample[]>([]);
    const [movements, setMovements] = useState<BatchMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'growth' | 'movements'>('overview');

    // Modal States
    const [showGrowthModal, setShowGrowthModal] = useState(false);
    const [showMoveModal, setShowMoveModal] = useState(false);

    useEffect(() => {
        if (id) fetchBatchData();
    }, [id]);

    const fetchBatchData = async () => {
        try {
            const [batchRes, growthRes, moveRes] = await Promise.all([
                api.get(`/production/batches/${id}`),
                api.get(`/production/batches/${id}/growth`),
                api.get(`/production/batches/${id}/movements`)
            ]);

            if (batchRes.data.success) setBatch(batchRes.data.data);
            if (growthRes.data.success) setGrowthSamples(growthRes.data.data);
            if (moveRes.data.success) setMovements(moveRes.data.data);
        } catch (error) {
            console.error('Error fetching batch details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <AppLayout><div>Loading...</div></AppLayout>;
    if (!batch) return <AppLayout><div>Batch not found</div></AppLayout>;

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/production/batches')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{batch.batch_code}</h2>
                        <p className="text-sm text-gray-500">Started {format(new Date(batch.start_date), 'dd MMM yyyy')}</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <button
                            onClick={() => setShowGrowthModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                        >
                            <Scale className="w-4 h-4 mr-2" />
                            Add Sample
                        </button>
                        <button
                            onClick={() => setShowMoveModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                            <ArrowRightLeft className="w-4 h-4 mr-2" />
                            Move Batch
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500">Current Stage</p>
                        <p className="text-lg font-bold text-gray-900">{batch.current_stage}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500">Current Count</p>
                        <p className="text-lg font-bold text-gray-900">{batch.current_count?.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500">Avg Weight</p>
                        <p className="text-lg font-bold text-gray-900">{batch.current_avg_size_g || '-'} g</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500">Tank</p>
                        <p className="text-lg font-bold text-gray-900">{batch.tank_name}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {['overview', 'growth', 'movements'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                                    ${activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[300px]">
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Batch Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500 block">Source:</span>
                                    {batch.spawn_id ? `Spawn (${batch.spawn_code})` : 'Purchase'}
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Initial Count:</span>
                                    {batch.initial_count?.toLocaleString()}
                                </div>
                                <div className="col-span-2">
                                    <span className="text-gray-500 block">Notes:</span>
                                    {batch.notes || 'No notes'}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'growth' && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                                Growth History
                            </h3>
                            {growthSamples.length === 0 ? (
                                <p className="text-gray-500 text-sm">No growth samples recorded.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Avg Weight (g)</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sample Size</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {growthSamples.map((sample) => (
                                                <tr key={sample.sample_id}>
                                                    <td className="px-4 py-2 text-sm text-gray-900">{format(new Date(sample.sample_date), 'dd MMM yyyy')}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-900 font-medium">{sample.avg_weight_g} g</td>
                                                    <td className="px-4 py-2 text-sm text-gray-500">{sample.sample_size}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-500">{sample.notes}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'movements' && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                                <History className="w-5 h-5 mr-2 text-blue-600" />
                                Movement Log
                            </h3>
                            {movements.length === 0 ? (
                                <p className="text-gray-500 text-sm">No movements recorded.</p>
                            ) : (
                                <div className="space-y-4">
                                    {movements.map((move) => (
                                        <div key={move.movement_id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                                            <div className="min-w-[100px] text-sm text-gray-500">
                                                {format(new Date(move.movement_date), 'dd MMM yyyy')}
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-900">
                                                    Moved from <span className="font-medium">{move.from_tank_name}</span> to <span className="font-medium">{move.to_tank_name}</span>
                                                </p>
                                                {move.notes && <p className="text-xs text-gray-500 mt-1">{move.notes}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showGrowthModal && (
                <GrowthModal
                    batchId={Number(id)}
                    onClose={() => setShowGrowthModal(false)}
                    onSuccess={() => {
                        setShowGrowthModal(false);
                        fetchBatchData(); // Refresh data
                    }}
                />
            )}

            {showMoveModal && (
                <MoveModal
                    batchId={Number(id)}
                    onClose={() => setShowMoveModal(false)}
                    onSuccess={() => {
                        setShowMoveModal(false);
                        fetchBatchData(); // Refresh data
                    }}
                />
            )}
        </AppLayout>
    );
}

// Simple Modals (Internal Components for speed, can be split later)

function GrowthModal({ batchId, onClose, onSuccess }: { batchId: number, onClose: () => void, onSuccess: () => void }) {
    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/production/batches/${batchId}/growth`, {
                sample_date: date,
                avg_weight_g: parseFloat(weight),
                sample_size: 10, // Default or add input
                notes: 'Manual Entry'
            });
            onSuccess();
        } catch (err) {
            alert('Failed to save');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Add Growth Sample</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Avg Weight (g)</label>
                        <input type="number" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-2 border rounded" required autoFocus />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import type { Tank } from '../../types';

function MoveModal({ batchId, onClose, onSuccess }: { batchId: number, onClose: () => void, onSuccess: () => void }) {
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [targetTank, setTargetTank] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get('/production/tanks').then(res => {
            if (res.data.success) setTanks(res.data.data);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/production/batches/${batchId}/move`, {
                movement_date: date,
                to_tank_id: parseInt(targetTank),
                notes: 'Manual Move'
            });
            onSuccess();
        } catch (err) {
            alert('Failed to move');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Move Batch</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">To Tank</label>
                        <select value={targetTank} onChange={e => setTargetTank(e.target.value)} className="w-full p-2 border rounded" required>
                            <option value="">Select Tank</option>
                            {tanks.map(t => (
                                <option key={t.tank_id} value={t.tank_id}>{t.tank_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Move</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import type { Tank } from '../../types';

export default function TankList() {
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTanks = async () => {
            try {
                const response = await api.get('/production/tanks');
                if (response.data.success) {
                    setTanks(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch tanks', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTanks();
    }, []);

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Tanks & Ponds</h2>
                        <p className="text-gray-500">Manage your hatchery's water bodies.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity (L)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : tanks.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No tanks found.</td></tr>
                            ) : (
                                tanks.map(tank => (
                                    <tr key={tank.tank_id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{tank.tank_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{tank.tank_type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{tank.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{tank.capacity_liters.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tank.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {tank.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Tank {
  tank_id: number;
  tank_code: string;
  tank_name: string;
  tank_type: string;
  location: string;
  capacity_liters: number;
  is_active: boolean;
  created_at: string;
}

export default function TankList() {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTanks();
  }, []);

  const fetchTanks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/tanks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTanks(response.data.data || []);
      setError('');
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to load tanks');
      console.error('Error fetching tanks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this tank?')) return;

    try {
      await axios.delete(`/api/v1/tanks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTanks(tanks.filter(t => t.tank_id !== id));
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to delete tank');
    }
  };

  if (loading) return <div className="p-6">Loading tanks...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tank Management</h1>
        <Link
          to="/tanks/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add Tank
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tank Code</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tank Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Location</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Capacity (L)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tanks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No tanks found. Create your first tank to get started.
                </td>
              </tr>
            ) : (
              tanks.map(tank => (
                <tr key={tank.tank_id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{tank.tank_code}</td>
                  <td className="px-6 py-4 text-gray-700">{tank.tank_name}</td>
                  <td className="px-6 py-4 text-gray-700">{tank.tank_type}</td>
                  <td className="px-6 py-4 text-gray-700">{tank.location}</td>
                  <td className="px-6 py-4 text-gray-700">{tank.capacity_liters.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tank.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tank.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      to={`/tanks/${tank.tank_id}`}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      to={`/tanks/${tank.tank_id}/edit`}
                      className="text-green-600 hover:text-green-800 transition"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(tank.tank_id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

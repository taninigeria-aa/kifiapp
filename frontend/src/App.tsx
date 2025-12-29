import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SpawnList from './pages/production/SpawnList';
import NewSpawn from './pages/production/NewSpawn';
import EditSpawn from './pages/production/EditSpawn';
import BatchList from './pages/production/BatchList';
import NewBatch from './pages/production/NewBatch';
import EditBatch from './pages/production/EditBatch';
import BatchDetails from './pages/production/BatchDetails';
import SalesList from './pages/sales/SalesList';
import NewSale from './pages/sales/NewSale';
import CustomerList from './pages/sales/CustomerList';
import TankList from './pages/production/TankList';

import FeedInventory from './pages/feed/FeedInventory';
import FeedLog from './pages/feed/FeedLog';
import ExpensesList from './pages/finance/ExpensesList';
import FinancialDashboard from './pages/finance/FinancialDashboard';
import SuppliersList from './pages/people/SuppliersList';
import WorkersList from './pages/people/WorkersList';
import ExpenseCategories from './pages/finance/ExpenseCategories';
import { ReloadPrompt } from './components/ReloadPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <OfflineIndicator />
        <ReloadPrompt />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/spawns" element={<ProtectedRoute><SpawnList /></ProtectedRoute>} />
          <Route path="/spawns/new" element={<ProtectedRoute><NewSpawn /></ProtectedRoute>} />
          <Route path="/spawns/:id/edit" element={<ProtectedRoute><EditSpawn /></ProtectedRoute>} />
          <Route path="/batches" element={<ProtectedRoute><BatchList /></ProtectedRoute>} />
          <Route path="/batches/new" element={<ProtectedRoute><NewBatch /></ProtectedRoute>} />
          <Route path="/batches/:id" element={<ProtectedRoute><BatchDetails /></ProtectedRoute>} />
          <Route path="/batches/:id/edit" element={<ProtectedRoute><EditBatch /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute><SalesList /></ProtectedRoute>} />
          <Route path="/sales/new" element={<ProtectedRoute><NewSale /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />

          <Route path="/feed" element={<ProtectedRoute><FeedInventory /></ProtectedRoute>} />
          <Route path="/feed/log" element={<ProtectedRoute><FeedLog /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpensesList /></ProtectedRoute>} />
          <Route path="/expenses/categories" element={<ProtectedRoute><ExpenseCategories /></ProtectedRoute>} />
          <Route path="/financial-dashboard" element={<ProtectedRoute><FinancialDashboard /></ProtectedRoute>} />
          <Route path="/suppliers" element={<ProtectedRoute><SuppliersList /></ProtectedRoute>} />
          <Route path="/workers" element={<ProtectedRoute><WorkersList /></ProtectedRoute>} />
          <Route path="/tanks" element={<ProtectedRoute><TankList /></ProtectedRoute>} />

          {/* Catch-all for 404 */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-8">Page Not Found</p>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go Home
              </button>
            </div>
          } />
        </Routes>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;

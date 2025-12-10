import { Wifi, WifiOff, RefreshCw, CheckCircle } from 'lucide-react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { useState } from 'react';

export const OfflineIndicator = () => {
    const { isOnline, isSyncing, pendingCount, triggerSync, lastSyncTime } = useOfflineSync();
    const [showToast, setShowToast] = useState(false);

    const handleManualSync = async () => {
        try {
            const result = await triggerSync();
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            console.error('Manual sync failed:', error);
        }
    };

    if (isOnline && pendingCount === 0) {
        return null; // Don't show anything when online with no pending items
    }

    return (
        <>
            {/* Status Badge */}
            <div className="fixed top-4 right-4 z-50">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-all ${isOnline
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {isOnline ? (
                        <Wifi className="w-4 h-4" />
                    ) : (
                        <WifiOff className="w-4 h-4" />
                    )}

                    <span>{isOnline ? 'Online' : 'Offline'}</span>

                    {pendingCount > 0 && (
                        <>
                            <span className="text-gray-400">•</span>
                            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                {pendingCount} pending
                            </span>
                        </>
                    )}

                    {isOnline && pendingCount > 0 && !isSyncing && (
                        <button
                            onClick={handleManualSync}
                            className="ml-1 p-1 hover:bg-blue-100 rounded transition-colors"
                            title="Sync now"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                    )}

                    {isSyncing && (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    )}
                </div>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div className="fixed top-20 right-4 z-50 animate-fade-in">
                    <div className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg shadow-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Sync complete!</span>
                    </div>
                </div>
            )}
        </>
    );
};

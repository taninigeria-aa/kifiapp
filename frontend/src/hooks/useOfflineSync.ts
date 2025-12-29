import { useState, useEffect, useCallback } from 'react';
import { offlineStorage } from '../lib/offlineStorage';
import api from '../lib/api';

interface SyncStatus {
    isOnline: boolean;
    isSyncing: boolean;
    pendingCount: number;
    lastSyncTime: number | null;
}

export const useOfflineSync = () => {
    const [status, setStatus] = useState<SyncStatus>({
        isOnline: navigator.onLine,
        isSyncing: false,
        pendingCount: 0,
        lastSyncTime: null,
    });

    // Update pending count
    const updatePendingCount = useCallback(async () => {
        const count = await offlineStorage.getSyncQueueCount();
        setStatus(prev => ({ ...prev, pendingCount: count }));
    }, []);

    // Sync queue with server
    const syncQueue = useCallback(async () => {
        if (!navigator.onLine) {
            console.log('Offline: Cannot sync queue');
            return;
        }

        setStatus(prev => ({ ...prev, isSyncing: true }));

        try {
            const queue = await offlineStorage.getSyncQueue();
            console.log(`Syncing ${queue.length} pending requests...`);

            let successCount = 0;
            let failCount = 0;

            for (const item of queue) {
                try {
                    // Execute the queued request
                    await api.request({
                        method: item.method,
                        url: item.url,
                        data: item.data,
                    });

                    // Remove from queue on success
                    await offlineStorage.removeFromSyncQueue(item.id);
                    successCount++;
                } catch (error) {
                    console.error(`Failed to sync ${item.method} ${item.url}:`, error);

                    // Increment retry count
                    await offlineStorage.incrementRetryCount(item.id);

                    // Remove if too many retries (max 5)
                    if (item.retryCount >= 5) {
                        console.warn(`Removing item after 5 failed retries: ${item.id}`);
                        await offlineStorage.removeFromSyncQueue(item.id);
                    }

                    failCount++;
                }
            }

            console.log(`Sync complete: ${successCount} succeeded, ${failCount} failed`);

            await updatePendingCount();
            setStatus(prev => ({
                ...prev,
                isSyncing: false,
                lastSyncTime: Date.now()
            }));

            return { successCount, failCount };
        } catch (error) {
            console.error('Sync queue error:', error);
            setStatus(prev => ({ ...prev, isSyncing: false }));
            throw error;
        }
    }, [updatePendingCount]);

    // Handle online/offline events
    useEffect(() => {
        const handleOnline = async () => {
            console.log('Network: Online');
            setStatus(prev => ({ ...prev, isOnline: true }));

            // Auto-sync when coming back online
            const count = await offlineStorage.getSyncQueueCount();
            if (count > 0) {
                console.log(`Auto-syncing ${count} pending items...`);
                await syncQueue();
            }
        };

        const handleOffline = () => {
            console.log('Network: Offline');
            setStatus(prev => ({ ...prev, isOnline: false }));
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial pending count
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void updatePendingCount();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [syncQueue, updatePendingCount]);

    // Manual sync trigger
    const triggerSync = useCallback(async () => {
        if (!navigator.onLine) {
            throw new Error('Cannot sync while offline');
        }
        return await syncQueue();
    }, [syncQueue]);

    // Add to queue
    const queueRequest = useCallback(async (
        method: 'POST' | 'PUT' | 'DELETE',
        url: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any
    ) => {
        const id = await offlineStorage.addToSyncQueue(method, url, data);
        await updatePendingCount();
        return id;
    }, [updatePendingCount]);

    return {
        ...status,
        triggerSync,
        queueRequest,
        updatePendingCount,
    };
};

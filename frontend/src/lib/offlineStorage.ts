/* eslint-disable @typescript-eslint/no-explicit-any */
import { openDB } from 'idb';

interface SyncQueueItem {
    id: string;
    method: 'POST' | 'PUT' | 'DELETE';
    url: string;
    data: any;
    timestamp: number;
    retryCount: number;
}

interface CachedDataItem {
    key: string;
    data: any;
    timestamp: number;
    expiresAt?: number;
}

class OfflineStorage {
    private dbPromise: Promise<any>;
    private readonly DB_NAME = 'kifiapp-offline';
    private readonly DB_VERSION = 1;

    constructor() {
        this.dbPromise = this.initDB();
    }

    private async initDB(): Promise<any> {
        return openDB(this.DB_NAME, this.DB_VERSION, {
            upgrade(db) {
                // Sync Queue Store
                if (!db.objectStoreNames.contains('sync-queue')) {
                    db.createObjectStore('sync-queue', { keyPath: 'id' });
                }

                // Cached Data Store
                if (!db.objectStoreNames.contains('cached-data')) {
                    db.createObjectStore('cached-data', { keyPath: 'key' });
                }
            },
        });
    }

    // ===== SYNC QUEUE METHODS =====

    async addToSyncQueue(method: 'POST' | 'PUT' | 'DELETE', url: string, data: any): Promise<string> {
        const db = await this.dbPromise;
        const id = `${method}-${url}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const item: SyncQueueItem = {
            id,
            method,
            url,
            data,
            timestamp: Date.now(),
            retryCount: 0,
        };

        await db.add('sync-queue', item);
        return id;
    }

    async getSyncQueue(): Promise<SyncQueueItem[]> {
        const db = await this.dbPromise;
        return db.getAll('sync-queue');
    }

    async removeFromSyncQueue(id: string): Promise<void> {
        const db = await this.dbPromise;
        await db.delete('sync-queue', id);
    }

    async incrementRetryCount(id: string): Promise<void> {
        const db = await this.dbPromise;
        const item = await db.get('sync-queue', id);
        if (item) {
            item.retryCount += 1;
            await db.put('sync-queue', item);
        }
    }

    async clearSyncQueue(): Promise<void> {
        const db = await this.dbPromise;
        await db.clear('sync-queue');
    }

    async getSyncQueueCount(): Promise<number> {
        const db = await this.dbPromise;
        return (await db.getAllKeys('sync-queue')).length;
    }

    // ===== CACHED DATA METHODS =====

    async cacheData(key: string, data: any, expiresInMs?: number): Promise<void> {
        const db = await this.dbPromise;
        const timestamp = Date.now();
        const expiresAt = expiresInMs ? timestamp + expiresInMs : undefined;

        const item: CachedDataItem = {
            key,
            data,
            timestamp,
            expiresAt,
        };

        await db.put('cached-data', item);
    }

    async getCachedData(key: string): Promise<any | null> {
        const db = await this.dbPromise;
        const cached = await db.get('cached-data', key);

        if (!cached) return null;

        // Check if expired
        if (cached.expiresAt && Date.now() > cached.expiresAt) {
            await db.delete('cached-data', key);
            return null;
        }

        return cached.data;
    }

    async removeCachedData(key: string): Promise<void> {
        const db = await this.dbPromise;
        await db.delete('cached-data', key);
    }

    async clearExpiredCache(): Promise<void> {
        const db = await this.dbPromise;
        const allCached = await db.getAll('cached-data');
        const now = Date.now();

        for (const item of allCached) {
            if (item.expiresAt && now > item.expiresAt) {
                await db.delete('cached-data', item.key);
            }
        }
    }

    async clearAllCache(): Promise<void> {
        const db = await this.dbPromise;
        await db.clear('cached-data');
    }

    // ===== UTILITY METHODS =====

    async getStorageStats(): Promise<{
        syncQueueCount: number;
        cachedDataCount: number;
    }> {
        const db = await this.dbPromise;
        const syncQueueCount = (await db.getAllKeys('sync-queue')).length;
        const cachedDataCount = (await db.getAllKeys('cached-data')).length;

        return {
            syncQueueCount,
            cachedDataCount,
        };
    }

    async clearAll(): Promise<void> {
        await this.clearSyncQueue();
        await this.clearAllCache();
    }
}

// Export singleton instance
export const offlineStorage = new OfflineStorage();

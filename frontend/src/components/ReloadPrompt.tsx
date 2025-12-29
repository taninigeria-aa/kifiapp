import { useRegisterSW } from 'virtual:pwa-register/react'

export function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r: unknown) {
            console.log('SW Registered: ' + r)
        },
        onRegisterError(error: unknown) {
            console.log('SW registration error', error)
        },
    })

    const close = () => {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    return (
        <div className="fixed bottom-0 right-0 m-4 z-50">
            {(offlineReady || needRefresh) && (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            {offlineReady ? (
                                <p className="text-sm text-gray-700">App ready to work offline</p>
                            ) : (
                                <p className="text-sm text-gray-700">New content available, click reload to update.</p>
                            )}
                        </div>
                        <button
                            onClick={close}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                    {needRefresh && (
                        <button
                            onClick={() => updateServiceWorker(true)}
                            className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                            Reload
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export default function FlashMessages() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState({ success: false, error: false });

    useEffect(() => {
        if (flash?.success) {
            setVisible((v) => ({ ...v, success: true }));
            const timer = setTimeout(() => setVisible((v) => ({ ...v, success: false })), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) {
            setVisible((v) => ({ ...v, error: true }));
            const timer = setTimeout(() => setVisible((v) => ({ ...v, error: false })), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash?.error]);

    return (
        <div className="fixed top-4 right-4 z-[100] space-y-2">
            {visible.success && flash?.success && (
                <div className="flex items-center gap-3 px-4 py-3 text-green-800 border border-green-200 rounded-lg shadow-lg bg-green-50 animate-slide-in">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <p className="text-sm font-medium">{flash.success}</p>
                    <button onClick={() => setVisible((v) => ({ ...v, success: false }))} className="ml-2 text-green-400 hover:text-green-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
            {visible.error && flash?.error && (
                <div className="flex items-center gap-3 px-4 py-3 text-red-800 border border-red-200 rounded-lg shadow-lg bg-red-50 animate-slide-in">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-sm font-medium">{flash.error}</p>
                    <button onClick={() => setVisible((v) => ({ ...v, error: false }))} className="ml-2 text-red-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
// resources/js/Components/ConfirmDialog.jsx
import { Button } from '@/Components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = 'Confirmar', variant = 'destructive' }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
            <div className="relative w-full max-w-sm p-6 mx-4 bg-white rounded-lg shadow-xl">
                <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{message}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={onCancel}>Cancelar</Button>
                    <Button variant={variant} onClick={onConfirm}>{confirmText}</Button>
                </div>
            </div>
        </div>
    );
}
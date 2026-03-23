import { ShoppingCart } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-12 h-12 mb-4 bg-indigo-600 rounded-xl">
                        <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Chivo Pedidos</h1>
                    <p className="mt-1 text-sm text-gray-500">Sistema de gestión de pedidos</p>
                </div>

                {children}
            </div>
        </div>
    );
}
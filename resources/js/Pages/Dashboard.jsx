import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Package, Users, ShoppingCart, CreditCard } from 'lucide-react';

const stats = [
    { name: 'Productos', value: '0', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Clientes', value: '0', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Pedidos', value: '0', icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Ingresos', value: '$0.00', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-100' },
];

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Resumen general del sistema
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.name}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            {stat.name}
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-gray-900">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.bg}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Pedidos recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500">
                            Aún no hay pedidos registrados.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { ShieldX } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Error({ status }) {
    const title = {
        403: 'Acceso denegado',
        404: 'Página no encontrada',
        500: 'Error del servidor',
    }[status] || 'Error';

    const description = {
        403: 'No tenés permiso para acceder a esta página.',
        404: 'La página que buscás no existe.',
        500: 'Ocurrió un error interno. Intentalo de nuevo más tarde.',
    }[status] || 'Ocurrió un error inesperado.';

    return (
        <GuestLayout>
            <Card>
                <CardContent className="p-6 text-center">
                    <ShieldX className="w-12 h-12 mx-auto mb-4 text-red-400" />
                    <h2 className="text-lg font-semibold text-gray-900">{status} — {title}</h2>
                    <p className="mt-2 mb-6 text-sm text-gray-500">{description}</p>
                    <Link href="/dashboard">
                        <Button variant="outline">Volver al Dashboard</Button>
                    </Link>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}
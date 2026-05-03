// resources/js/Pages/Clientes/Index.jsx
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { usePermissions } from '@/hooks/usePermissions';
import {
    Plus,
    Search,
    Pencil,
    ToggleLeft,
    ToggleRight,
    Mail,
    Phone,
    MapPin,
} from 'lucide-react';

export default function Index({ clientes, filters }) {
    const { can } = usePermissions();
    const [search, setSearch] = useState(filters?.search || '');
    const [confirmToggle, setConfirmToggle] = useState(null);

    function handleSearch(e) {
        e.preventDefault();
        router.get('/clientes', { search, activo: filters?.activo }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleFilterActivo(value) {
        router.get('/clientes', { search: filters?.search, activo: value }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleToggle() {
        if (!confirmToggle) return;
        router.patch(`/clientes/${confirmToggle.id}/toggle`, {}, {
            preserveScroll: true,
            onFinish: () => setConfirmToggle(null),
        });
    }

    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
                        <p className="mt-1 text-sm text-gray-500">Gestión de clientes del sistema</p>
                    </div>
                    {can('clientes.crear') && (
                        <Link href="/clientes/crear">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo cliente
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Filtros */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <Input
                                type="text"
                                placeholder="Buscar por nombre, email, teléfono..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="outline">Buscar</Button>
                    </form>

                    <div className="flex gap-2">
                        <Button
                            variant={filters?.activo === '' || filters?.activo === undefined ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilterActivo('')}
                        >
                            Todos
                        </Button>
                        <Button
                            variant={filters?.activo === '1' || filters?.activo === true ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilterActivo('1')}
                        >
                            Activos
                        </Button>
                        <Button
                            variant={filters?.activo === '0' || filters?.activo === false ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilterActivo('0')}
                        >
                            Inactivos
                        </Button>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-4 py-3 font-medium text-left text-gray-600">Cliente</th>
                                    <th className="hidden px-4 py-3 font-medium text-left text-gray-600 md:table-cell">Contacto</th>
                                    <th className="hidden px-4 py-3 font-medium text-left text-gray-600 lg:table-cell">Dirección</th>
                                    <th className="px-4 py-3 font-medium text-center text-gray-600">Estado</th>
                                    {can('clientes.editar') && (
                                        <th className="w-32 px-4 py-3 font-medium text-center text-gray-600">Acciones</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {clientes.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                            No se encontraron clientes.
                                        </td>
                                    </tr>
                                ) : (
                                    clientes.data.map((cliente) => (
                                        <tr key={cliente.id} className="transition-colors hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">{cliente.nombre}</p>
                                                    {/* Mostrar contacto en móvil */}
                                                    <div className="flex flex-col gap-0.5 mt-1 md:hidden">
                                                        {cliente.email && (
                                                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                                                <Mail className="w-3 h-3" />
                                                                {cliente.email}
                                                            </span>
                                                        )}
                                                        {cliente.telefono && (
                                                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                                                <Phone className="w-3 h-3" />
                                                                {cliente.telefono}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden px-4 py-3 md:table-cell">
                                                <div className="flex flex-col gap-1">
                                                    {cliente.email ? (
                                                        <span className="text-gray-600 flex items-center gap-1.5">
                                                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                            {cliente.email}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-300">Sin email</span>
                                                    )}
                                                    {cliente.telefono ? (
                                                        <span className="text-gray-600 flex items-center gap-1.5">
                                                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                            {cliente.telefono}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-300">Sin teléfono</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="hidden px-4 py-3 lg:table-cell">
                                                {cliente.direccion ? (
                                                    <span className="text-gray-600 flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                        <span className="max-w-xs truncate">{cliente.direccion}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-300">Sin dirección</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant={cliente.activo ? 'success' : 'secondary'}>
                                                    {cliente.activo ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </td>
                                            {can('clientes.editar') && (
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Link href={`/clientes/${cliente.id}/editar`}>
                                                            <Button variant="ghost" size="icon" title="Editar">
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title={cliente.activo ? 'Desactivar' : 'Activar'}
                                                            onClick={() => setConfirmToggle(cliente)}
                                                        >
                                                            {cliente.activo ? (
                                                                <ToggleRight className="w-4 h-4 text-green-600" />
                                                            ) : (
                                                                <ToggleLeft className="w-4 h-4 text-gray-400" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 pb-4">
                        <Pagination
                            links={clientes.links}
                            meta={{
                                from: clientes.from,
                                to: clientes.to,
                                total: clientes.total,
                            }}
                        />
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={!!confirmToggle}
                title={confirmToggle?.activo ? 'Desactivar cliente' : 'Activar cliente'}
                message={
                    confirmToggle?.activo
                        ? `¿Estás seguro de desactivar al cliente "${confirmToggle?.nombre}"? No podrá ser asignado a nuevos pedidos.`
                        : `¿Deseas reactivar al cliente "${confirmToggle?.nombre}"?`
                }
                confirmText={confirmToggle?.activo ? 'Desactivar' : 'Activar'}
                variant={confirmToggle?.activo ? 'destructive' : 'default'}
                onConfirm={handleToggle}
                onCancel={() => setConfirmToggle(null)}
            />
        </AuthenticatedLayout>
    );
}
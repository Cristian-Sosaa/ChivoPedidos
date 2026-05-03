// resources/js/Pages/Categorias/Index.jsx
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { usePermissions } from '@/hooks/usePermissions';
import { Plus, Search, Pencil, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Index({ categorias, filters }) {
    const { can } = usePermissions();
    const [search, setSearch] = useState(filters?.search || '');
    const [confirmToggle, setConfirmToggle] = useState(null);

    function handleSearch(e) {
        e.preventDefault();
        router.get('/categorias', { search, activo: filters?.activo }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleFilterActivo(value) {
        router.get('/categorias', { search: filters?.search, activo: value }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleToggle() {
        if (!confirmToggle) return;
        router.patch(`/categorias/${confirmToggle.id}/toggle`, {}, {
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
                        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
                        <p className="mt-1 text-sm text-gray-500">Gestión de categorías de productos</p>
                    </div>
                    {can('categorias.crear') && (
                        <Link href="/categorias/crear">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Nueva categoría
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
                                placeholder="Buscar categoría..."
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
                            Todas
                        </Button>
                        <Button
                            variant={filters?.activo === '1' || filters?.activo === true ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilterActivo('1')}
                        >
                            Activas
                        </Button>
                        <Button
                            variant={filters?.activo === '0' || filters?.activo === false ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilterActivo('0')}
                        >
                            Inactivas
                        </Button>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-4 py-3 font-medium text-left text-gray-600">Nombre</th>
                                    <th className="hidden px-4 py-3 font-medium text-left text-gray-600 sm:table-cell">Descripción</th>
                                    <th className="px-4 py-3 font-medium text-center text-gray-600">Estado</th>
                                    {can('categorias.editar') && (
                                        <th className="w-32 px-4 py-3 font-medium text-center text-gray-600">Acciones</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categorias.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                                            No se encontraron categorías.
                                        </td>
                                    </tr>
                                ) : (
                                    categorias.data.map((categoria) => (
                                        <tr key={categoria.id} className="transition-colors hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {categoria.nombre}
                                            </td>
                                            <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                                                {categoria.descripcion || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant={categoria.activo ? 'success' : 'secondary'}>
                                                    {categoria.activo ? 'Activa' : 'Inactiva'}
                                                </Badge>
                                            </td>
                                            {can('categorias.editar') && (
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Link href={`/categorias/${categoria.id}/editar`}>
                                                            <Button variant="ghost" size="icon" title="Editar">
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title={categoria.activo ? 'Desactivar' : 'Activar'}
                                                            onClick={() => setConfirmToggle(categoria)}
                                                        >
                                                            {categoria.activo ? (
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

                    {/* Paginación */}
                    <div className="px-4 pb-4">
                        <Pagination
                            links={categorias.links}
                            meta={{
                                from: categorias.from,
                                to: categorias.to,
                                total: categorias.total,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Modal de confirmación */}
            <ConfirmDialog
                open={!!confirmToggle}
                title={confirmToggle?.activo ? 'Desactivar categoría' : 'Activar categoría'}
                message={
                    confirmToggle?.activo
                        ? `¿Estás seguro de desactivar la categoría "${confirmToggle?.nombre}"? Los productos asociados no serán eliminados.`
                        : `¿Deseas reactivar la categoría "${confirmToggle?.nombre}"?`
                }
                confirmText={confirmToggle?.activo ? 'Desactivar' : 'Activar'}
                variant={confirmToggle?.activo ? 'destructive' : 'default'}
                onConfirm={handleToggle}
                onCancel={() => setConfirmToggle(null)}
            />
        </AuthenticatedLayout>
    );
}
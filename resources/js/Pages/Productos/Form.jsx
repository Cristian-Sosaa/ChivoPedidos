// resources/js/Pages/Productos/Form.jsx
import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent } from '@/Components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

export default function Form({ producto, categorias }) {
    const isEditing = !!producto;

    const { data, setData, post, put, processing, errors } = useForm({
        categoria_id: producto?.categoria_id || '',
        nombre: producto?.nombre || '',
        descripcion: producto?.descripcion || '',
        precio: producto?.precio || '',
        stock: producto?.stock ?? 0,
    });

    function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            ...data,
            categoria_id: data.categoria_id || null,
        };

        if (isEditing) {
            put(`/productos/${producto.id}`, { data: payload });
        } else {
            post('/productos', { data: payload });
        }
    }

    return (
        <AuthenticatedLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/productos">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Editar producto' : 'Nuevo producto'}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {isEditing
                                ? 'Modificá los datos del producto'
                                : 'Completá los datos para crear un nuevo producto'}
                        </p>
                    </div>
                </div>

                {/* Formulario */}
                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="nombre">
                                    Nombre <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="nombre"
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Ej: Coca-Cola 600ml, Chocolatina..."
                                    autoFocus
                                />
                                {errors.nombre && (
                                    <p className="text-sm text-red-600">{errors.nombre}</p>
                                )}
                            </div>

                            {/* Categoría */}
                            <div className="space-y-2">
                                <Label htmlFor="categoria_id">Categoría</Label>
                                <select
                                    id="categoria_id"
                                    value={data.categoria_id}
                                    onChange={(e) => setData('categoria_id', e.target.value)}
                                    className="flex w-full px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                                >
                                    <option value="">Sin categoría</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoria_id && (
                                    <p className="text-sm text-red-600">{errors.categoria_id}</p>
                                )}
                            </div>

                            {/* Precio y Stock */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="precio">
                                        Precio ($) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="precio"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={data.precio}
                                        onChange={(e) => setData('precio', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {errors.precio && (
                                        <p className="text-sm text-red-600">{errors.precio}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock">
                                        Stock <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        placeholder="0"
                                    />
                                    {errors.stock && (
                                        <p className="text-sm text-red-600">{errors.stock}</p>
                                    )}
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <textarea
                                    id="descripcion"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    placeholder="Descripción opcional del producto..."
                                    rows={3}
                                    className="flex w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                                />
                                {errors.descripcion && (
                                    <p className="text-sm text-red-600">{errors.descripcion}</p>
                                )}
                            </div>

                            {/* Botones */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link href="/productos">
                                    <Button type="button" variant="outline">Cancelar</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing
                                        ? 'Guardando...'
                                        : isEditing
                                            ? 'Actualizar producto'
                                            : 'Crear producto'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
// resources/js/Pages/Categorias/Form.jsx
import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

export default function Form({ categoria }) {
    const isEditing = !!categoria;

    const { data, setData, post, put, processing, errors } = useForm({
        nombre: categoria?.nombre || '',
        descripcion: categoria?.descripcion || '',
    });

    function handleSubmit(e) {
        e.preventDefault();

        if (isEditing) {
            put(`/categorias/${categoria.id}`);
        } else {
            post('/categorias');
        }
    }

    return (
        <AuthenticatedLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/categorias">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Editar categoría' : 'Nueva categoría'}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {isEditing
                                ? 'Modificá los datos de la categoría'
                                : 'Completá los datos para crear una nueva categoría'}
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
                                    placeholder="Ej: Bebidas, Electrónica, Alimentos..."
                                    autoFocus
                                />
                                {errors.nombre && (
                                    <p className="text-sm text-red-600">{errors.nombre}</p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <textarea
                                    id="descripcion"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    placeholder="Descripción opcional de la categoría..."
                                    rows={3}
                                    className="flex w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                                />
                                {errors.descripcion && (
                                    <p className="text-sm text-red-600">{errors.descripcion}</p>
                                )}
                            </div>

                            {/* Botones */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link href="/categorias">
                                    <Button type="button" variant="outline">Cancelar</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing
                                        ? 'Guardando...'
                                        : isEditing
                                            ? 'Actualizar categoría'
                                            : 'Crear categoría'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
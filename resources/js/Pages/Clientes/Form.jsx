// resources/js/Pages/Clientes/Form.jsx
import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent } from '@/Components/ui/card';
import { ArrowLeft, Save, User, Mail, Phone, MapPin } from 'lucide-react';

export default function Form({ cliente }) {
    const isEditing = !!cliente;

    const { data, setData, post, put, processing, errors } = useForm({
        nombre: cliente?.nombre || '',
        email: cliente?.email || '',
        telefono: cliente?.telefono || '',
        direccion: cliente?.direccion || '',
    });

    function handleSubmit(e) {
        e.preventDefault();

        if (isEditing) {
            put(`/clientes/${cliente.id}`);
        } else {
            post('/clientes');
        }
    }

    return (
        <AuthenticatedLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/clientes">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Editar cliente' : 'Nuevo cliente'}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {isEditing
                                ? 'Modificá los datos del cliente'
                                : 'Completá los datos para registrar un nuevo cliente'}
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
                                    Nombre completo <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <User className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                                    <Input
                                        id="nombre"
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        placeholder="Ej: Juan Pérez, Empresa ABC..."
                                        className="pl-9"
                                        autoFocus
                                    />
                                </div>
                                {errors.nombre && (
                                    <p className="text-sm text-red-600">{errors.nombre}</p>
                                )}
                            </div>

                            {/* Email y Teléfono */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <div className="relative">
                                        <Mail className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="cliente@email.com"
                                            className="pl-9"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <div className="relative">
                                        <Phone className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                                        <Input
                                            id="telefono"
                                            type="text"
                                            value={data.telefono}
                                            onChange={(e) => setData('telefono', e.target.value)}
                                            placeholder="7000-0000"
                                            className="pl-9"
                                        />
                                    </div>
                                    {errors.telefono && (
                                        <p className="text-sm text-red-600">{errors.telefono}</p>
                                    )}
                                </div>
                            </div>

                            {/* Dirección */}
                            <div className="space-y-2">
                                <Label htmlFor="direccion">Dirección</Label>
                                <div className="relative">
                                    <MapPin className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                                    <textarea
                                        id="direccion"
                                        value={data.direccion}
                                        onChange={(e) => setData('direccion', e.target.value)}
                                        placeholder="Dirección del cliente..."
                                        rows={2}
                                        className="flex w-full py-2 pr-3 text-sm bg-white border border-gray-300 rounded-md shadow-sm pl-9 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
                                    />
                                </div>
                                {errors.direccion && (
                                    <p className="text-sm text-red-600">{errors.direccion}</p>
                                )}
                            </div>

                            {/* Botones */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link href="/clientes">
                                    <Button type="button" variant="outline">Cancelar</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing
                                        ? 'Guardando...'
                                        : isEditing
                                            ? 'Actualizar cliente'
                                            : 'Crear cliente'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
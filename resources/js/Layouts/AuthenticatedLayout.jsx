import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    CreditCard,
    FolderOpen,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Categorías', href: '/categorias', icon: FolderOpen },
    { name: 'Productos', href: '/productos', icon: Package },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Pedidos', href: '/pedidos', icon: ShoppingCart },
    { name: 'Pagos', href: '/pagos', icon: CreditCard },
    { name: 'Reportes', href: '/reportes', icon: BarChart3 },
];

function Sidebar({ open, setOpen }) {
    const { url } = usePage();

    return (
        <>
            {/* Overlay móvil */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                            <ShoppingCart className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                            Chivo Pedidos
                        </span>
                    </Link>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-gray-500 lg:hidden hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navegación */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer del sidebar */}
                <div className="p-3 border-t border-gray-200">
                    <Link
                        href="/configuracion"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 transition-colors rounded-lg hover:bg-gray-50 hover:text-gray-900"
                    >
                        <Settings className="w-5 h-5 text-gray-400" />
                        Configuración
                    </Link>
                </div>
            </aside>
        </>
    );
}

function Topbar({ setOpen, user }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6">
            {/* Botón menú móvil */}
            <button
                onClick={() => setOpen(true)}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Título de página (se puede hacer dinámico después) */}
            <div className="hidden lg:block" />

            {/* Usuario */}
            <div className="relative">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-gray-900"
                >
                    <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden font-medium sm:block">{user?.name || 'Usuario'}</span>
                    <ChevronDown className="w-4 h-4" />
                </button>

                {dropdownOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setDropdownOpen(false)}
                        />
                        <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <LogOut className="w-4 h-4" />
                                Cerrar sesión
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Topbar setOpen={setSidebarOpen} user={auth?.user} />

                <main className="flex-1 p-4 overflow-y-auto sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
// resources/js/Layouts/AuthenticatedLayout.jsx
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { usePermissions } from '@/hooks/usePermissions';
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
    UserCog,
} from 'lucide-react';

function getNavigation(can, isAdmin) {
    const items = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, show: true },
        { name: 'Usuarios', href: '/usuarios', icon: UserCog, show: can('usuarios.ver') },
        { name: 'Categorías', href: '/categorias', icon: FolderOpen, show: can('categorias.ver') },
        { name: 'Productos', href: '/productos', icon: Package, show: can('productos.ver') },
        { name: 'Clientes', href: '/clientes', icon: Users, show: can('clientes.ver') },
        { name: 'Pedidos', href: '/pedidos', icon: ShoppingCart, show: can('pedidos.ver') },
        { name: 'Pagos', href: '/pagos', icon: CreditCard, show: can('pagos.ver') },
        { name: 'Reportes', href: '/reportes', icon: BarChart3, show: can('reportes.ver') },
    ];

    return items.filter((item) => item.show);
}

function Sidebar({ open, setOpen }) {
    const { url } = usePage();
    const { can, isAdmin } = usePermissions();
    const navigation = getNavigation(can, isAdmin);

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                            <ShoppingCart className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">Chivo Pedidos</span>
                    </Link>
                    <button onClick={() => setOpen(false)} className="text-gray-500 lg:hidden hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

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

                {isAdmin() && (
                    <div className="p-3 border-t border-gray-200">
                        <Link
                            href="/configuracion"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 transition-colors rounded-lg hover:bg-gray-50 hover:text-gray-900"
                        >
                            <Settings className="w-5 h-5 text-gray-400" />
                            Configuración
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
}

function Topbar({ setOpen, user }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { isAdmin } = usePermissions();

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6">
            <button onClick={() => setOpen(true)} className="text-gray-500 hover:text-gray-700 lg:hidden">
                <Menu className="w-6 h-6" />
            </button>

            <div className="hidden lg:block" />

            <div className="relative">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-gray-900"
                >
                    <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-col items-start hidden sm:flex">
                        <span className="font-medium">{user?.name || 'Usuario'}</span>
                        <span className="text-xs text-gray-400 capitalize">
                            {user?.roles?.[0] || 'sin rol'}
                        </span>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                </button>

                {dropdownOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                        <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700 capitalize">
                                    {user?.roles?.[0]}
                                </span>
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
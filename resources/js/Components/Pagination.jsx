// resources/js/Components/Pagination.jsx
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ links, meta }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-500">
                Mostrando {meta?.from || 0} a {meta?.to || 0} de {meta?.total || 0} resultados
            </p>
            <div className="flex items-center gap-1">
                {links.map((link, index) => {
                    if (index === 0) {
                        return (
                            <Link
                                key="prev"
                                href={link.url || '#'}
                                className={`p-2 rounded-md text-sm ${
                                    link.url
                                        ? 'text-gray-600 hover:bg-gray-100'
                                        : 'text-gray-300 pointer-events-none'
                                }`}
                                preserveScroll
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Link>
                        );
                    }
                    if (index === links.length - 1) {
                        return (
                            <Link
                                key="next"
                                href={link.url || '#'}
                                className={`p-2 rounded-md text-sm ${
                                    link.url
                                        ? 'text-gray-600 hover:bg-gray-100'
                                        : 'text-gray-300 pointer-events-none'
                                }`}
                                preserveScroll
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        );
                    }
                    return (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                                link.active
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            preserveScroll
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
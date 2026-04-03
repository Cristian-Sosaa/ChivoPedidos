import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Package, Users, ShoppingCart, CreditCard } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const stats = [
    { name: 'Productos',  value: '0',     icon: Package },
    { name: 'Clientes',   value: '0',     icon: Users },
    { name: 'Pedidos',    value: '0',     icon: ShoppingCart },
    { name: 'Ingresos',   value: '$0.00', icon: CreditCard },
];

const dateLabel = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
});

const styles = `
    .dash-header { animation: dashFadeUp 0.5s ease both; }
    .stat-card   { animation: dashFadeUp 0.45s ease both; }

    .stat-card:nth-child(1) { animation-delay: 80ms;  }
    .stat-card:nth-child(2) { animation-delay: 140ms; }
    .stat-card:nth-child(3) { animation-delay: 200ms; }
    .stat-card:nth-child(4) { animation-delay: 260ms; }

    @keyframes dashFadeUp {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .stat-card {
        border-top: 1.5px solid #1A1A18;
        padding: 1.25rem 0 1.5rem;
        cursor: default;
        transition: border-color 0.2s ease;
    }
    .stat-card:hover { border-top-color: #C8470A; }
    .stat-card:hover .stat-value { color: #C8470A; }

    .stat-value {
        font-family: 'JetBrains Mono', monospace;
        transition: color 0.2s ease;
    }

    .dash-section-title {
        font-family: 'Syne', sans-serif;
    }
`;

export default function Dashboard() {
    const { auth } = usePage().props;
    const firstName = auth?.user?.name?.split(' ')[0] ?? 'Hola';

    return (
        <AuthenticatedLayout>
            <style>{styles}</style>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 4px' }}>

                {/* ── Encabezado ── */}
                <div className="dash-header" style={{ marginBottom: '3rem', paddingTop: '0.25rem' }}>
                    <p style={{
                        fontFamily:    "'JetBrains Mono', monospace",
                        fontSize:      '11px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color:         '#C8470A',
                        marginBottom:  '10px',
                    }}>
                        {dateLabel}
                    </p>

                    <h1 style={{
                        fontFamily:  "'Syne', sans-serif",
                        fontSize:    'clamp(26px, 3.5vw, 40px)',
                        fontWeight:  800,
                        color:       '#111110',
                        letterSpacing: '-0.025em',
                        lineHeight:  1.05,
                        margin:      0,
                    }}>
                        Bienvenido, {firstName}
                    </h1>

                    <p style={{
                        marginTop: '10px',
                        fontSize:  '13.5px',
                        color:     '#737370',
                        lineHeight: 1.5,
                    }}>
                        Vista general de Chivo Pedidos
                    </p>
                </div>

                {/* ── Estadísticas ── */}
                <div style={{
                    display:             'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap:                 '0 2rem',
                }}
                    className="lg:grid-cols-4"
                >
                    {stats.map((stat) => (
                        <div key={stat.name} className="stat-card">
                            <div style={{
                                display:        'flex',
                                alignItems:     'center',
                                justifyContent: 'space-between',
                                marginBottom:   '14px',
                            }}>
                                <span style={{
                                    fontSize:      '10.5px',
                                    fontWeight:    600,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color:         '#737370',
                                }}>
                                    {stat.name}
                                </span>
                                <stat.icon size={13} style={{ color: '#ADADAB' }} />
                            </div>

                            <p className="stat-value" style={{
                                fontSize:   'clamp(28px, 3vw, 38px)',
                                fontWeight: 600,
                                color:      '#111110',
                                lineHeight: 1,
                                margin:     0,
                            }}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── Divisor ── */}
                <div style={{ height: '1px', backgroundColor: '#E8E8E6', margin: '2.5rem 0 2rem' }} />

                {/* ── Pedidos recientes ── */}
                <div>
                    <div style={{
                        display:        'flex',
                        alignItems:     'baseline',
                        justifyContent: 'space-between',
                        marginBottom:   '1.25rem',
                    }}>
                        <h2 className="dash-section-title" style={{
                            fontSize:      '14px',
                            fontWeight:    700,
                            color:         '#111110',
                            letterSpacing: '-0.01em',
                            margin:        0,
                        }}>
                            Pedidos recientes
                        </h2>
                        <span style={{
                            fontFamily:    "'JetBrains Mono', monospace",
                            fontSize:      '10.5px',
                            color:         '#ADADAB',
                            letterSpacing: '0.06em',
                        }}>
                            0 registros
                        </span>
                    </div>

                    <div style={{
                        borderTop:      '1px solid #E8E8E6',
                        padding:        '3.5rem 0',
                        display:        'flex',
                        flexDirection:  'column',
                        alignItems:     'center',
                        gap:            '8px',
                    }}>
                        <ShoppingCart size={18} style={{ color: '#D8D8D6', marginBottom: '4px' }} />
                        <p style={{ fontSize: '13px', color: '#ADADAB', margin: 0 }}>
                            Sin pedidos registrados aún
                        </p>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

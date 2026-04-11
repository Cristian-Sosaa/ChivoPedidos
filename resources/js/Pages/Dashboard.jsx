import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Package, Users, ShoppingCart, DollarSign,
    ArrowUpRight, FolderOpen, BarChart3, CreditCard,
    ChevronRight,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   Animated counter — counts up from 0 with quartic ease-out
────────────────────────────────────────────────────────── */
function CountUp({ to, prefix = '', decimals = 0 }) {
    const [val, setVal] = useState(0);

    useEffect(() => {
        if (to === 0) { setVal(0); return; }
        const DUR = 1400;
        const t0 = performance.now();
        const tick = (now) => {
            const p = Math.min((now - t0) / DUR, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            setVal(eased * to);
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [to]);

    const formatted = decimals
        ? val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : Math.round(val).toLocaleString('es-MX');

    return <>{prefix}{formatted}</>;
}

/* ──────────────────────────────────────────────────────────
   Data config
────────────────────────────────────────────────────────── */
const STAT_DEFS = [
    { key: 'productos', label: 'Productos',  icon: Package,      sub: 'en catálogo',  accent: '#2563eb' },
    { key: 'clientes',  label: 'Clientes',   icon: Users,        sub: 'registrados',  accent: '#0891b2' },
    { key: 'pedidos',   label: 'Pedidos',    icon: ShoppingCart, sub: 'este mes',     accent: '#7c3aed' },
    { key: 'ingresos',  label: 'Ingresos',   icon: DollarSign,   sub: 'acumulado',    accent: '#059669', prefix: '$', decimals: 2 },
];

const QUICK_LINKS = [
    { label: 'Categorías', href: '/categorias', icon: FolderOpen },
    { label: 'Productos',  href: '/productos',  icon: Package },
    { label: 'Clientes',   href: '/clientes',   icon: Users },
    { label: 'Pedidos',    href: '/pedidos',    icon: ShoppingCart },
    { label: 'Pagos',      href: '/pagos',      icon: CreditCard },
    { label: 'Reportes',   href: '/reportes',   icon: BarChart3 },
];

/* ──────────────────────────────────────────────────────────
   Dashboard
────────────────────────────────────────────────────────── */
export default function Dashboard({ stats: propStats }) {
    const stats = STAT_DEFS.map((s) => ({
        ...s,
        value: propStats?.[s.key] ?? 0,
    }));

    const today = new Date().toLocaleDateString('es-MX', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;400;500&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <style>{`
                :root {
                    --bg:        #f8f8f6;
                    --surface:   #ffffff;
                    --border:    #e8e7e3;
                    --border-md: #d4d2cc;
                    --text-1:    #1a1916;
                    --text-2:    #6b6862;
                    --text-3:    #a8a49e;
                    --font-sans: 'DM Sans', sans-serif;
                    --font-serif:'Instrument Serif', Georgia, serif;
                }

                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .d-anim { animation: fade-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .d-0 { animation-delay: 0.00s; }
                .d-1 { animation-delay: 0.06s; }
                .d-2 { animation-delay: 0.12s; }
                .d-3 { animation-delay: 0.18s; }
                .d-4 { animation-delay: 0.24s; }
                .d-5 { animation-delay: 0.32s; }
                .d-6 { animation-delay: 0.40s; }

                .stat-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    padding: 1.5rem 1.75rem;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
                    cursor: default;
                    position: relative;
                    overflow: hidden;
                }
                .stat-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: color-mix(in srgb, var(--card-accent) 4%, transparent);
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }
                .stat-card:hover {
                    border-color: var(--card-accent);
                    box-shadow: 0 4px 24px color-mix(in srgb, var(--card-accent) 12%, transparent);
                    transform: translateY(-1px);
                }
                .stat-card:hover::before { opacity: 1; }

                .quick-link {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.75rem;
                    font-family: var(--font-sans);
                    font-size: 0.8125rem;
                    font-weight: 400;
                    color: var(--text-2);
                    text-decoration: none;
                    padding: 0.6rem 0.75rem;
                    border: 1px solid transparent;
                    border-radius: 6px;
                    transition: color 0.15s, border-color 0.15s, background 0.15s;
                }
                .quick-link:hover {
                    color: var(--text-1);
                    border-color: var(--border);
                    background: var(--surface);
                }
                .quick-link .arrow {
                    color: var(--text-3);
                    transition: transform 0.15s ease, color 0.15s;
                }
                .quick-link:hover .arrow {
                    transform: translate(2px, -2px);
                    color: var(--text-2);
                }

                .btn-outline {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-family: var(--font-sans);
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: var(--text-2);
                    text-decoration: none;
                    border: 1px solid var(--border-md);
                    border-radius: 6px;
                    padding: 0.35rem 0.85rem;
                    transition: background 0.15s, border-color 0.15s, color 0.15s;
                    background: var(--surface);
                }
                .btn-outline:hover {
                    color: var(--text-1);
                    border-color: var(--text-3);
                    background: var(--bg);
                }

                .divider {
                    height: 1px;
                    background: var(--border);
                    border: none;
                    margin: 0;
                }
            `}</style>

            {/* ── Shell ── */}
            <div style={{
                minHeight: '100%',
                margin: '-1rem',
                background: 'var(--bg)',
                fontFamily: 'var(--font-sans)',
                color: 'var(--text-1)',
                padding: '2.5rem 2.25rem',
                boxSizing: 'border-box',
            }}>

                {/* ── Header ── */}
                <header className="d-anim d-0" style={{ marginBottom: '2.5rem' }}>
                    <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        fontWeight: 400,
                        letterSpacing: '0.02em',
                        color: 'var(--text-3)',
                        marginBottom: '0.4rem',
                        textTransform: 'capitalize',
                    }}>
                        {today}
                    </p>
                    <div style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                    }}>
                        <h1 style={{
                            fontFamily: 'var(--font-serif)',
                            fontWeight: 400,
                            fontSize: '2.25rem',
                            letterSpacing: '-0.01em',
                            color: 'var(--text-1)',
                            margin: 0,
                            lineHeight: 1.1,
                        }}>
                            Panel de Control
                        </h1>
                        <span style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.75rem',
                            color: 'var(--text-3)',
                            fontWeight: 400,
                            letterSpacing: '0.01em',
                        }}>
                            Chivo Pedidos · Sistema de Gestión
                        </span>
                    </div>
                    <hr className="divider" style={{ marginTop: '1.5rem' }} />
                </header>

                {/* ── Stats grid ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2.5rem',
                }}>
                    {stats.map((s, i) => (
                        <div
                            key={s.key}
                            className={`stat-card d-anim d-${i + 1}`}
                            style={{ '--card-accent': s.accent }}
                        >
                            {/* Top accent dot */}
                            <div style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: s.accent,
                                marginBottom: '1.25rem',
                            }} />

                            {/* Icon + sub */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem',
                            }}>
                                <s.icon
                                    size={15}
                                    strokeWidth={1.75}
                                    style={{ color: s.accent, opacity: 0.8 }}
                                />
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--text-3)',
                                    fontWeight: 400,
                                    letterSpacing: '0.01em',
                                }}>
                                    {s.sub}
                                </span>
                            </div>

                            {/* Number */}
                            <div style={{
                                fontFamily: 'var(--font-serif)',
                                fontStyle: 'italic',
                                fontSize: '2.75rem',
                                lineHeight: 1,
                                color: 'var(--text-1)',
                                letterSpacing: '-0.02em',
                                marginBottom: '0.5rem',
                            }}>
                                <CountUp
                                    to={s.value}
                                    prefix={s.prefix || ''}
                                    decimals={s.decimals || 0}
                                />
                            </div>

                            {/* Label */}
                            <div style={{
                                fontSize: '0.775rem',
                                color: 'var(--text-2)',
                                fontWeight: 400,
                                letterSpacing: '0.01em',
                            }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Bottom: recent orders + quick nav ── */}
                <div
                    className="d-anim d-5"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 220px',
                        gap: '1.5rem',
                        alignItems: 'start',
                    }}
                >
                    {/* Pedidos recientes */}
                    <div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem',
                        }}>
                            <h2 style={{
                                fontFamily: 'var(--font-serif)',
                                fontWeight: 400,
                                fontSize: '1.25rem',
                                color: 'var(--text-1)',
                                margin: 0,
                                letterSpacing: '-0.01em',
                            }}>
                                Pedidos recientes
                            </h2>
                            <a href="/pedidos" className="btn-outline">
                                Ver todos <ArrowUpRight size={12} />
                            </a>
                        </div>

                        {/* Empty state */}
                        <div style={{
                            background: 'var(--surface)',
                            border: '1px dashed var(--border-md)',
                            padding: '4rem 2rem',
                            textAlign: 'center',
                            borderRadius: 0,
                        }}>
                            <ShoppingCart
                                size={24}
                                strokeWidth={1.25}
                                style={{
                                    color: 'var(--text-3)',
                                    margin: '0 auto 1rem',
                                    display: 'block',
                                    opacity: 0.5,
                                }}
                            />
                            <p style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-3)',
                                margin: 0,
                                fontWeight: 400,
                            }}>
                                Sin pedidos registrados
                            </p>
                        </div>
                    </div>

                    {/* Acceso rápido */}
                    <div className="d-anim d-6">
                        <p style={{
                            fontSize: '0.7rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--text-3)',
                            fontWeight: 500,
                            marginBottom: '0.65rem',
                        }}>
                            Acceso rápido
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {QUICK_LINKS.map((ql) => (
                                <a key={ql.href} href={ql.href} className="quick-link">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <ql.icon size={13} strokeWidth={1.5} style={{ color: 'var(--text-3)' }} />
                                        {ql.label}
                                    </div>
                                    <span className="arrow">
                                        <ChevronRight size={13} />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <hr className="divider" style={{ marginTop: '3rem', marginBottom: '1rem' }} />
                <p style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-3)',
                    textAlign: 'center',
                    fontWeight: 400,
                    letterSpacing: '0.01em',
                }}>
                    © {new Date().getFullYear()} Chivo Pedidos
                </p>

            </div>
        </AuthenticatedLayout>
    );
}

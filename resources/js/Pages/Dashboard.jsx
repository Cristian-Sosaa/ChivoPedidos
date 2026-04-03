import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Package, Users, ShoppingCart, DollarSign,
    ArrowUpRight, FolderOpen, BarChart3, CreditCard,
    Zap, ChevronRight,
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
   Data config — pass real values via props.stats
────────────────────────────────────────────────────────── */
const STAT_DEFS = [
    {
        key: 'productos', label: 'Productos',
        icon: Package, sub: 'en catálogo',
        color: '#a3e635',                       // lime
    },
    {
        key: 'clientes', label: 'Clientes',
        icon: Users, sub: 'registrados',
        color: '#38bdf8',                       // sky
    },
    {
        key: 'pedidos', label: 'Pedidos',
        icon: ShoppingCart, sub: 'este mes',
        color: '#f97316',                       // orange
    },
    {
        key: 'ingresos', label: 'Ingresos',
        icon: DollarSign, sub: 'acumulado',
        color: '#facc15', prefix: '$', decimals: 2, // yellow
    },
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
                    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@300;400;500&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* ── Keyframes & utility classes ── */}
            <style>{`
                @keyframes dash-up {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }
                .dash-anim { animation: dash-up 0.5s cubic-bezier(.22,.68,0,1.15) both; }
                .dash-d0 { animation-delay: 0.00s; }
                .dash-d1 { animation-delay: 0.07s; }
                .dash-d2 { animation-delay: 0.14s; }
                .dash-d3 { animation-delay: 0.21s; }
                .dash-d4 { animation-delay: 0.28s; }
                .dash-d5 { animation-delay: 0.36s; }
                .dash-d6 { animation-delay: 0.44s; }

                .stat-card {
                    transition: border-color 0.2s, box-shadow 0.2s;
                    cursor: default;
                }
                .stat-card:hover {
                    border-color: var(--accent-color) !important;
                    box-shadow: 0 0 0 1px var(--accent-color),
                                inset 0 0 32px color-mix(in srgb, var(--accent-color) 6%, transparent);
                }

                .quick-link {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.75rem;
                    font-size: 0.7rem;
                    letter-spacing: 0.05em;
                    color: #555a6e;
                    text-decoration: none;
                    padding: 0.45rem 0.6rem;
                    border: 1px solid transparent;
                    transition: color 0.15s, border-color 0.15s, background 0.15s;
                }
                .quick-link:hover {
                    color: #a3e635;
                    border-color: rgba(163,230,53,0.2);
                    background: rgba(163,230,53,0.04);
                }
                .quick-link-arrow { transition: transform 0.15s ease; }
                .quick-link:hover .quick-link-arrow { transform: translate(2px, -2px); }

                .view-all-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.6rem;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: #a3e635;
                    text-decoration: none;
                    border: 1px solid rgba(163,230,53,0.25);
                    padding: 0.3rem 0.7rem;
                    transition: background 0.15s, border-color 0.15s;
                    font-family: 'JetBrains Mono', monospace;
                }
                .view-all-btn:hover {
                    background: rgba(163,230,53,0.08);
                    border-color: rgba(163,230,53,0.5);
                }
            `}</style>

            {/* ── Full-bleed dark shell ── */}
            <div
                style={{
                    minHeight: '100%',
                    margin: '-1rem',
                    background: '#090a0e',
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    color: '#c0c4d0',
                    padding: '2.25rem 2rem',
                    boxSizing: 'border-box',
                }}
            >
                {/* ── Header ── */}
                <div className="dash-anim dash-d0" style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                    }}>
                        <div>
                            <p style={{
                                fontSize: '0.6rem',
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                color: '#383c4d',
                                marginBottom: '0.35rem',
                            }}>
                                {today}
                            </p>
                            <h1 style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
                                letterSpacing: '0.07em',
                                lineHeight: 1,
                                color: '#eceff7',
                                margin: 0,
                            }}>
                                Panel de Control
                            </h1>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.6rem',
                            color: '#a3e635',
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                        }}>
                            <Zap size={10} strokeWidth={2} />
                            Sistema activo
                        </div>
                    </div>

                    {/* Gradient rule */}
                    <div style={{
                        marginTop: '1.25rem',
                        height: '1px',
                        background: 'linear-gradient(90deg, #a3e635 0%, #1e222e 40%, transparent 100%)',
                    }} />
                </div>

                {/* ── Stats grid ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))',
                    gap: '0.75rem',
                    marginBottom: '2rem',
                }}>
                    {stats.map((s, i) => (
                        <div
                            key={s.key}
                            className={`stat-card dash-anim dash-d${i + 1}`}
                            style={{
                                '--accent-color': s.color,
                                background: '#0d0e14',
                                border: '1px solid #1a1d27',
                                padding: '1.4rem',
                                position: 'relative',
                            }}
                        >
                            {/* Top accent bar */}
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0,
                                height: '2px',
                                background: s.color,
                                opacity: 0.9,
                            }} />

                            {/* Icon + sub label */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem',
                            }}>
                                <s.icon
                                    size={16}
                                    strokeWidth={1.5}
                                    style={{ color: s.color, opacity: 0.65 }}
                                />
                                <span style={{
                                    fontSize: '0.58rem',
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: '#30333f',
                                }}>
                                    {s.sub}
                                </span>
                            </div>

                            {/* Big number */}
                            <div style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: '2.9rem',
                                lineHeight: 1,
                                color: s.color,
                                letterSpacing: '0.03em',
                                marginBottom: '0.35rem',
                            }}>
                                <CountUp
                                    to={s.value}
                                    prefix={s.prefix || ''}
                                    decimals={s.decimals || 0}
                                />
                            </div>

                            {/* Metric label */}
                            <div style={{
                                fontSize: '0.62rem',
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                color: '#454857',
                            }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Bottom section: recent orders + quick nav ── */}
                <div
                    className="dash-anim dash-d5"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 180px',
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
                            marginBottom: '0.8rem',
                        }}>
                            <h2 style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: '1.35rem',
                                letterSpacing: '0.08em',
                                color: '#6b6f80',
                                margin: 0,
                            }}>
                                Pedidos Recientes
                            </h2>
                            <a href="/pedidos" className="view-all-btn">
                                Ver todos <ArrowUpRight size={10} />
                            </a>
                        </div>

                        {/* Empty state */}
                        <div style={{
                            background: '#09090d',
                            border: '1px dashed #1a1d27',
                            padding: '3.5rem 2rem',
                            textAlign: 'center',
                        }}>
                            <ShoppingCart
                                size={26}
                                strokeWidth={1}
                                style={{
                                    color: '#1a1d27',
                                    margin: '0 auto 1rem',
                                    display: 'block',
                                }}
                            />
                            <p style={{
                                fontSize: '0.62rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: '#252831',
                                margin: 0,
                            }}>
                                Sin pedidos registrados
                            </p>
                        </div>
                    </div>

                    {/* Acceso rápido */}
                    <div className="dash-anim dash-d6">
                        <p style={{
                            fontSize: '0.58rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: '#2e3140',
                            marginBottom: '0.55rem',
                        }}>
                            Acceso rápido
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {QUICK_LINKS.map((ql) => (
                                <a key={ql.href} href={ql.href} className="quick-link">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <ql.icon size={12} strokeWidth={1.5} />
                                        {ql.label}
                                    </div>
                                    <span className="quick-link-arrow">
                                        <ChevronRight size={10} />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Footer rule ── */}
                <div style={{
                    marginTop: '2.5rem',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, #1a1d27 30%, #1a1d27 70%, transparent 100%)',
                }} />
                <p style={{
                    marginTop: '0.75rem',
                    fontSize: '0.58rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#252831',
                    textAlign: 'center',
                }}>
                    Chivo Pedidos · Sistema de Gestión
                </p>
            </div>
        </AuthenticatedLayout>
    );
}

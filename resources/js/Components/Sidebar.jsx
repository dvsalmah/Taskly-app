import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

const NAV_ITEMS = [
    { label: 'Dashboard', href: 'dashboard', icon: '/assets/homepage.svg' },
    { label: 'Vital Task', href: 'vital-task', icon: '/assets/vital-task.svg' },
    { label: 'My Task', href: 'my-task', icon: '/assets/my-task.svg' },
    { label: 'Task Categories', href: 'task-category', icon: '/assets/category.svg' },
    { label: 'Help', href: 'help', icon: '/assets/help.svg' },
];

/* ───────────── Logout Confirmation Overlay ───────────── */
function LogoutOverlay({ onCancel, onConfirm }) {
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        >
            {/* Card */}
            <div
                className="bg-surface rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-8 flex flex-col items-center gap-5 w-[320px]"
                style={{ animation: 'overlayFadeIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
            >
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-error-bg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                        className="text-error-text"
                        style={{ color: 'var(--color-error-text, #dc2626)' }}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </div>

                {/* Text */}
                <div className="text-center">
                    <p className="text-[16px] font-bold text-ink mb-1">Logout?</p>
                    <p className="text-[13px] text-muted leading-relaxed">
                        Are you sure you want to sign out<br />of your account?
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold
                                   border border-border text-ink bg-fore
                                   hover:bg-border transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold
                                   text-white border-none cursor-pointer transition-all
                                   hover:-translate-y-px"
                        style={{ background: '#e84393' }}
                    >
                        Yes, Logout
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes overlayFadeIn {
                    from { opacity: 0; transform: scale(0.88) translateY(10px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0px); }
                }
            `}</style>
        </div>
    );
}

/* ───────────── Sidebar ───────────── */
export default function Sidebar() {
    const { url } = usePage();
    const [showLogout, setShowLogout] = useState(false);

    const isActive = (href) => {
        try {
            return route().current(href);
        } catch {
            const path = route(href);
            const urlPath = url.split('?')[0];
            return urlPath === path || urlPath.startsWith(path + '/');
        }
    };

    const handleLogoutConfirm = () => {
        router.post(route('logout'));
    };

    return (
        <>
            <aside className="fixed top-0 left-0 bottom-0 w-56 bg-sidebar flex flex-col z-50">
                <nav className="flex-1 px-4 mt-20">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={route(item.href)}
                            className={[
                                'flex items-center gap-4 px-4 py-2 rounded-xl mb-2',
                                'text-[14px] font-medium no-underline transition-all duration-200',
                                isActive(item.href)
                                    ? 'bg-white/30 text-white'
                                    : 'text-white/85 hover:bg-white/15 hover:text-white',
                            ].join(' ')}
                        >
                            <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                <img src={item.icon} alt=""
                                    className="w-max-[30px] h-max-[30px] shrink-0 brightness-0 invert" />
                            </div>
                            <span className="pt-0.5 tracking-wide">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Logout button — triggers overlay, NOT direct POST */}
                <button
                    onClick={() => setShowLogout(true)}
                    className="flex items-center gap-4 px-6 py-4 border-t border-white/5
                               text-white/80 text-[14px] font-medium w-full text-left bg-transparent
                               hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                >
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="shrink-0">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </div>
                    <span className="pt-0.5">Logout</span>
                </button>
            </aside>

            {/* Logout confirmation overlay — mounted outside aside so it covers everything */}
            {showLogout && (
                <LogoutOverlay
                    onCancel={() => setShowLogout(false)}
                    onConfirm={handleLogoutConfirm}
                />
            )}
        </>
    );
}
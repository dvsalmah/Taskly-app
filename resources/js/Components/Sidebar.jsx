import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, router, usePage } from '@inertiajs/react';

const NAV_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: '/assets/homepage.svg' },
    { label: 'Vital Task', path: '/vital-task', icon: '/assets/vital-task.svg' },
    { label: 'My Task', path: '/my-task', icon: '/assets/my-task.svg' },
    { label: 'Task Categories', path: '/task-category', icon: '/assets/category.svg' },
    { label: 'Help', path: '/help', icon: '/assets/help.svg' },
];

function LogoutOverlay({ onCancel, onConfirm }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        >
            <div
                className="bg-surface rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center gap-4 h-54 w-100 overflow-hidden"
                style={{ animation: 'overlayFadeIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                        viewBox="0 0 24 24" fill="none" stroke="#dc2626"
                        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </div>

                {/* Text */}
                <div className="text-center">
                    <p className="text-md font-bold text-ink mb-1">Logout?</p>
                    <p className="text-sm text-muted leading-relaxed">
                        Are you sure you want to sign out<br />of your account?
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center w-60 gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-8 rounded-xl text-sm font-semibold
                                   border border-gray-200 text-ink bg-fore
                                   hover:bg-border hover:-translate-y-px transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 h-8 bg-red-500 text-white rounded-xl text-sm font-semibold
                                   cursor-pointer transition-all
                                   hover:-translate-y-px"
                    >
                        Yes, Logout
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes overlayFadeIn {
                    from { opacity: 0; transform: scale(0.88) translateY(10px); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>,
        document.body
    );
}

export default function Sidebar() {
    const { url } = usePage();
    const [showLogout, setShowLogout] = useState(false);

    const isActive = (path) => {
        const currentPath = url.split('?')[0];
        return currentPath === path || currentPath.startsWith(path + '/');
    };

    const handleLogoutConfirm = () => {
        router.post('/logout');
    };

    return (
        <>
            <aside className="w-56 bg-sidebar flex flex-col z-50 shrink-0 sticky top-0 left-0 h-screen">
    
                {/* Spacer top */}
                <div className="h-16" />
                <nav className="flex flex-col gap-3 items-center">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={[
                                'w-50 h-8 flex items-center ml-4 gap-3 py-3 rounded-md',
                                'text-sm font-medium no-underline transition-all duration-200',
                                isActive(item.path)
                                    ? 'bg-white/30 text-white'
                                    : 'text-white/85 hover:bg-white/15 hover:text-white',
                            ].join(' ')}
                        >
                            <div className="w-7 h-7 flex items-center justify-center shrink-0">
                                <img
                                    src={item.icon}
                                    alt=""
                                    className="shrink-0 brightness-0 invert"
                                    style={{ width: 20, height: 20 }}
                                />
                            </div>
                            <span className="tracking-wide">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="flex-1 border-b border-white/50"/>
                <button
                    onClick={() => setShowLogout(true)}
                    className="flex items-center justify-center h-14 gap-3 
                            text-white/80 text-sm font-medium w-50 text-left
                            bg-transparent border-none hover:text-red-500
                            transition-colors duration-200 cursor-pointer"
                >
                    <div className="w-auto h-7 flex items-center shrink-0 hover:red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="shrink-0">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </div>
                    <span className='tracking-wide'>Logout</span>
                </button>
            </aside>

            {showLogout && (
                <LogoutOverlay
                    onCancel={() => setShowLogout(false)}
                    onConfirm={handleLogoutConfirm}
                />
            )}
        </>
    );
}
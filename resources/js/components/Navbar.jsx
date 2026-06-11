import { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { useSidebar } from '@/components/ui/sidebar';
import { X, BellRing, Calendar, Search, Menu } from 'lucide-react';
import useNotifications from '@/hooks/useNotifications';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

function MiniCalendar() {
    const now = new Date();
    const [viewYear,  setViewYear]  = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());

    const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const dateFullStr = now.toLocaleDateString('en-GB', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });

    const prev = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const next = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    return (
        <div className="flex flex-col w-[280px] bg-surface rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-border !p-5 z-[500] cal-popup-enter">
            <div className="flex items-center justify-between mb-4">
                <button onClick={prev} className="flex items-center justify-center w-6 h-6 text-muted hover:bg-fore rounded-md text-xl leading-none transition-colors bg-transparent border-none cursor-pointer">‹</button>
                <span className="text-[14px] font-bold text-ink tracking-wide">{MONTHS[viewMonth]} {viewYear}</span>
                <button onClick={next} className="flex items-center justify-center w-6 h-6 text-muted hover:bg-fore rounded-md text-xl leading-none transition-colors bg-transparent border-none cursor-pointer">›</button>
            </div>
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1 gap-x-1">
                {Array.from({ length: firstDay }).map((_, i) => <span key={'e' + i} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                    const isToday = d === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();
                    return (
                        <span key={d} className={`flex items-center justify-center w-8 h-8 mx-auto text-[13px] rounded-full cursor-default transition-colors ${isToday ? 'bg-pink-dark text-white font-bold shadow-sm' : 'text-ink hover:bg-fore'}`}>
                            {d}
                        </span>
                    );
                })}
            </div>
            <div className="mt-4 pt-3 border-t border-border text-center text-[12px] font-medium text-muted">
                {dateFullStr}
            </div>
        </div>
    );
}

//Notification Popover
function timeAgoShort(iso) {
    if (!iso) return '';
    const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function NotifPopover({ invitations, onRespond, onClose }) {
    return (
        <div className="absolute right-0 top-[calc(100%+10px)] w-[360px] sm:w-[400px] bg-surface rounded-lg shadow-modal border border-border z-[500] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between !px-4 !py-1 border-b border-border bg-surface/95 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <span className="text-[15px] font-bold text-ink">Notifications</span>
                    {invitations.length > 0 && (
                        <span className="text-[11px] font-bold bg-pink-dark text-white rounded-full !px-2 !py-0.5">
                            {invitations.length}
                        </span>
                    )}
                </div>
                <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink hover:bg-fore text-[16px] leading-none border-none bg-transparent cursor-pointer rounded-lg transition-colors">
                    <X size={20} className="opacity-80" />
                </button>
            </div>

            {/* List */}
            <div className="max-h-[380px] overflow-y-auto !p-4 flex flex-col gap-3">
                {invitations.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-6 px-4 text-center">
                        <div className="w-10 h-10 rounded-2xl bg-fore flex items-center justify-center shadow-sm">
                            <BellRing size={20} className="opacity-40" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-ink m-0">All caught up!</p>
                            <p className="text-xs text-muted m-0 mt-1">No pending join requests right now.</p>
                        </div>
                    </div>
                ) : (
                    invitations.map(inv => (
                        <div key={inv.id} className="flex flex-col gap-3 !px-4 !py-2 bg-surface-alt/40 border border-border/60 rounded-xl hover:bg-surface-alt/70 transition-colors">
                            <div className="flex items-start gap-3">
                                <img
                                    src={inv.requester_photo}
                                    alt=""
                                    onError={(e) => { e.target.src = '/assets/avatar.png'; }}
                                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-border"
                                />
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <p className="text-sm text-ink m-0 leading-relaxed">
                                        <span className="font-bold">{inv.requester_name}</span>
                                        <span className="text-muted"> wants to join </span>
                                        <span className="font-semibold text-pink-dark">"{inv.task_title}"</span>
                                    </p>
                                    <span className="text-[11px] text-muted mt-1 block">{timeAgoShort(inv.created_at)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button onClick={() => onRespond(inv.id, 'accept')} className="flex-1 h-8 bg-pink-dark text-white rounded-lg text-[12px] font-semibold cursor-pointer border-none transition-all hover:bg-pink-dark/85 active:scale-[0.98]">Accept</button>
                                <button onClick={() => onRespond(inv.id, 'decline')} className="flex-1 h-8 bg-surface border border-border text-ink rounded-lg text-[12px] font-semibold cursor-pointer transition-all hover:bg-fore active:scale-[0.98]">Decline</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

//Navbar
export default function Navbar({ user }) {
    const { toggleSidebar } = useSidebar();
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1]);
    const [calOpen,      setCalOpen]      = useState(false);
    const [notifOpen,    setNotifOpen]    = useState(false);
    const [searchQuery,  setSearchQuery]  = useState(params.get('search') || '');
    const calRef   = useRef(null);
    const notifRef = useRef(null);

    const { invitations, unreadCount, fetchInvitations, handleRespond } = useNotifications();

    useEffect(() => {
        const handler = (e) => {
            if (calRef.current   && !calRef.current.contains(e.target))   setCalOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('taskly:search', { detail: searchQuery }));
    }, [searchQuery]);

    const handleNotifOpen = (e) => {
        e.stopPropagation();
        if (notifOpen) { setNotifOpen(false); return; }
        setCalOpen(false);
        fetchInvitations();
        setNotifOpen(true);
    };

    const photoUrl = user?.photo_url || '/assets/avatar.png';
    const todayStr = new Date().toLocaleDateString('en-GB', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });

    return (
        <header className="bg-surface h-[72px] w-full flex items-center justify-between !px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="lg:hidden p-2 -ml-2 rounded-lg text-muted hover:bg-fore transition-colors">
                    <Menu size={24} />
                </button>
                <Link href="/dashboard" className="flex items-center shrink-0 no-underline">
                    <img src="/assets/taskly-HD.png" alt="Taskly" className="h-10 w-auto object-contain" />
                </Link>
            </div>

            {/* Search bar */}
            <div className="hidden sm:flex flex-1 max-w-lg px-4 sm:px-8">
                <div className="flex items-center w-full h-10 gap-3 px-4 rounded-lg bg-fore border border-transparent focus-within:border-gray-200 overflow-hidden transition-colors">
                    <Search size={16} className="shrink-0 opacity-40 !ml-6" />
                    <input
                        type="text"
                        placeholder="Search your task here"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.get('/my-task', { search: searchQuery.trim() });
                            }
                        }}
                        className="flex-1 min-w-0 bg-transparent border-none outline-none focus:ring-0 text-[14px] text-ink placeholder:text-muted"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {/* Notifications */}
                <div className="relative flex items-center" ref={notifRef}>
                    <button
                        onClick={handleNotifOpen}
                        className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-transparent border-none cursor-pointer hover:bg-fore transition-colors"
                        title="Notifications"
                    >
                        <BellRing size={20} className="opacity-80" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ef4444] shadow-sm ring-2 ring-surface" />
                        )}
                    </button>
                    {notifOpen && (
                        <NotifPopover
                            invitations={invitations}
                            onRespond={handleRespond}
                            onClose={() => setNotifOpen(false)}
                        />
                    )}
                </div>

                {/* Calendar */}
                <div className="relative flex items-center" ref={calRef}>
                    <button
                        title={todayStr}
                        onClick={(e) => { e.stopPropagation(); setCalOpen(o => !o); setNotifOpen(false); }}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-transparent border-none cursor-pointer hover:bg-fore transition-colors"
                    >
                        <Calendar size={20} className="opacity-80" />
                    </button>
                    {calOpen && (
                        <div className="absolute right-0 top-[calc(100%+10px)] w-[260px] bg-surface rounded-[14px] shadow-modal border border-border p-4 z-[500] animate-in fade-in slide-in-from-top-2 duration-200">
                            <MiniCalendar />
                        </div>
                    )}
                </div>

                {/* Profile */}
                <Link href="/profile" title="My Profile" className="flex items-center outline-none rounded-full ring-2 ring-border ring-offset-2 ring-offset-surface hover:ring-pink-dark transition-all duration-300">
                    <img
                        src={photoUrl}
                        alt="Profile"
                        onError={(e) => { e.target.src = '/assets/avatar.png'; }}
                        className="h-12 w-auto rounded-full object-cover"
                    />
                </Link>
            </div>
        </header>
    );
}
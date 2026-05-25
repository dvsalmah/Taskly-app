import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { useSidebar } from '@/components/ui/sidebar';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function MiniCalendar() {
    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const dateFullStr = now.toLocaleDateString('en-GB', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
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
        <div className="flex flex-col w-[280px] bg-surface rounded-[14px]
                        shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-border !p-5 z-[500] cal-popup-enter">
            <div className="flex items-center justify-between mb-4">
                <button onClick={prev}
                    className="flex items-center justify-center w-6 h-6 text-muted hover:bg-fore rounded-md text-xl leading-none
                               transition-colors bg-transparent border-none cursor-pointer">‹</button>
                <span className="text-[14px] font-bold text-ink tracking-wide">{MONTHS[viewMonth]} {viewYear}</span>
                <button onClick={next}
                    className="flex items-center justify-center w-6 h-6 text-muted hover:bg-fore rounded-md text-xl leading-none
                               transition-colors bg-transparent border-none cursor-pointer">›</button>
            </div>
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1 gap-x-1">
                {Array.from({ length: firstDay }).map((_, i) => <span key={'e' + i} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                    const isToday = d === now.getDate()
                        && viewMonth === now.getMonth()
                        && viewYear === now.getFullYear();
                    return (
                        <span key={d} className={`flex items-center justify-center w-8 h-8 mx-auto text-[13px] rounded-full cursor-default transition-colors
                            ${isToday ? 'bg-pink-dark text-white font-bold shadow-sm' : 'text-ink hover:bg-fore'}`}>
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

export default function Navbar({ user }) {
    const { toggleSidebar } = useSidebar();
    const [calOpen, setCalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const calRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (calRef.current && !calRef.current.contains(e.target)) setCalOpen(false);
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('taskly:search', { detail: searchQuery }));
    }, [searchQuery]);

    const photoUrl = user?.photo_url || 'https://i.pravatar.cc/150?img=8';
    const todayStr = new Date().toLocaleDateString('en-GB', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });

    return (
        <header className="bg-surface h-[72px] w-full flex items-center justify-between !px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button 
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 -ml-2 rounded-lg text-muted hover:bg-fore transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                {/* Logo */}
                <Link href="/dashboard" className="flex items-center shrink-0 no-underline">
                    <img
                        src="/assets/taskly-HD.png"
                        alt="Taskly"
                        className="h-10 w-auto object-contain"
                    />
                </Link>
            </div>

            {/* Search bar */}
            <div className="hidden sm:flex flex-1 max-w-lg px-4 sm:px-8">
                <div
                    className="flex items-center w-full h-10 gap-3 px-4
                            rounded-lg bg-fore border border-transparent
                            focus-within:border-gray-200 overflow-hidden transition-colors"
                >
                    <img
                        src="/assets/seacrh.svg"
                        alt="Search"
                        className="w-4 h-4 shrink-0 opacity-40 !ml-6"
                    />
                    <input
                        type="text"
                        placeholder="Search your task here"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 min-w-0 bg-transparent border-none outline-none focus:ring-0
                                text-[14px] text-ink placeholder:text-muted"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <div className="relative flex items-center" ref={calRef}>
                    <button
                        title={todayStr}
                        onClick={(e) => { e.stopPropagation(); setCalOpen(o => !o); }}
                        className="w-10 h-10 flex items-center justify-center rounded-xl
                                   bg-transparent border-none cursor-pointer hover:bg-fore transition-colors"
                    >
                        <img src="/assets/calendar.svg" alt="Calendar" className="w-5 h-5 object-contain opacity-80" />
                    </button>
                    {calOpen && (
                        <div className="absolute right-0 top-[calc(100%+10px)] w-[260px] bg-surface rounded-[14px]
                                      shadow-modal border border-border p-4 z-[500] animate-in fade-in slide-in-from-top-2 duration-200">
                            <MiniCalendar />
                        </div>
                    )}
                </div>

                <Link href="/profile" title='My Profile' className="flex items-center outline-none rounded-full ring-2 ring-border ring-offset-2 ring-offset-surface hover:ring-pink-dark transition-all duration-300">
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
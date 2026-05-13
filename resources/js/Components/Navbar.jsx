import { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';

const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
];

function MiniCalendar({ onClose }) {
    const now = new Date();
    const [viewYear, setViewYear]   = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());

    const firstDay     = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
    const dateFullStr  = now.toLocaleDateString('en-GB', { weekday:'long', day:'2-digit', month:'long', year:'numeric' });

    const prev = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const next = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    return (
        <div className="absolute top-[calc(100%+10px)] right-0 w-[260px] bg-surface rounded-[14px]
                        shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-border p-4 z-[500] cal-popup-enter">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <button onClick={prev} className="text-muted hover:bg-fore rounded px-1.5 text-xl leading-none transition-colors">‹</button>
                <span className="text-[14px] font-bold text-ink">{MONTHS[viewMonth]} {viewYear}</span>
                <button onClick={next} className="text-muted hover:bg-fore rounded px-1.5 text-xl leading-none transition-colors">›</button>
            </div>
            {/* Day-of-week labels */}
            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
            </div>
            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: firstDay }).map((_, i) => <span key={'e'+i} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                    const isToday = d === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();
                    return (
                        <span key={d} className={`text-center py-1 text-[12px] rounded-full cursor-default transition-colors
                            ${isToday ? 'bg-pink-dark text-white font-bold' : 'text-ink hover:bg-fore'}`}>
                            {d}
                        </span>
                    );
                })}
            </div>
            {/* Today label */}
            <div className="mt-3 pt-2.5 border-t border-border text-center text-[11px] font-medium text-muted">
                {dateFullStr}
            </div>
        </div>
    );
}

export default function Navbar({ user }) {
    const [calOpen, setCalOpen]       = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const calRef = useRef(null);

    // Close calendar on outside click
    useEffect(() => {
        const handler = (e) => {
            if (calRef.current && !calRef.current.contains(e.target)) {
                setCalOpen(false);
            }
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    // Dispatch global search event so pages can listen
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('taskly:search', { detail: searchQuery }));
    }, [searchQuery]);

    const photoUrl = user?.photo_url || 'https://i.pravatar.cc/150?img=8';

    return (
        <header className="bg-surface border-b border-border px-6 py-2.5 flex items-center gap-3
                           sticky top-0 z-10">
            {/* Logo */}
            <Link href={route('dashboard')} className="flex items-center flex-shrink-0 no-underline">
                <img src="/assets/taskly-HD.png" alt="Taskly" className="h-[50px] w-auto object-contain" />
            </Link>

            {/* Search bar */}
            <div className="flex-1 flex justify-center">
                <div className="flex items-center bg-fore rounded-lg px-6 py-3.5 gap-2.5 w-full max-w-[420px]">
                    <img src="/assets/seacrh.svg" alt="" className="w-4 h-4 flex-shrink-0 opacity-50" />
                    <input
                        type="text"
                        placeholder="Search your task here"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[16px] text-ink font-sans min-w-0"
                    />
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Notifications */}
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border-none bg-transparent
                                   cursor-pointer hover:bg-fore transition-colors">
                    <img src="/assets/notif.svg" alt="Notifications" className="w-5 h-5 object-contain" />
                </button>

                {/* Calendar toggle */}
                <div className="relative flex items-center" ref={calRef}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setCalOpen(o => !o); }}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border-none bg-transparent
                                   cursor-pointer hover:bg-fore transition-colors"
                    >
                        <img src="/assets/calendar.svg" alt="Calendar" className="w-5 h-5 object-contain" />
                    </button>
                    {calOpen && <MiniCalendar onClose={() => setCalOpen(false)} />}
                </div>

                {/* Avatar */}
                <Link href={route('profile.edit')} className="flex items-center ml-1.5 no-underline group">
                    <img
                        src={photoUrl}
                        alt="Profile"
                        onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?img=8'; }}
                        className="w-14 h-14 rounded-full object-cover border-2 border-border
                                   transition-all duration-200 group-hover:border-pink-dark
                                   group-hover:shadow-[0_0_0_3px_rgba(134,16,67,0.15)]"
                    />
                </Link>
            </div>
        </header>
    );
}

import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

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
        <div className="absolute top-[calc(100%+10px)] right-0 w-[260px] bg-surface rounded-[14px]
                        shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-border p-4 z-[500] cal-popup-enter">
            <div className="flex items-center justify-between mb-3">
                <button onClick={prev}
                    className="text-muted hover:bg-fore rounded px-1.5 text-xl leading-none
                               transition-colors bg-transparent border-none cursor-pointer">‹</button>
                <span className="text-[14px] font-bold text-ink">{MONTHS[viewMonth]} {viewYear}</span>
                <button onClick={next}
                    className="text-muted hover:bg-fore rounded px-1.5 text-xl leading-none
                               transition-colors bg-transparent border-none cursor-pointer">›</button>
            </div>
            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-muted uppercase tracking-wide">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: firstDay }).map((_, i) => <span key={'e' + i} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                    const isToday = d === now.getDate()
                        && viewMonth === now.getMonth()
                        && viewYear === now.getFullYear();
                    return (
                        <span key={d} className={`text-center py-1 text-[12px] rounded-full cursor-default
                            ${isToday ? 'bg-pink-dark text-white font-bold' : 'text-ink hover:bg-fore'}`}>
                            {d}
                        </span>
                    );
                })}
            </div>
            <div className="mt-3 pt-2.5 border-t border-border text-center text-[11px] font-medium text-muted">
                {dateFullStr}
            </div>
        </div>
    );
}

export default function Navbar({ user }) {
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
        <header className="bg-surface border-t-[4px] border-t-pink-dark border-b border-b-border h-[64px] w-full flex items-center justify-between px-8 sticky top-0 z-10">

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center shrink-0 no-underline">
                <img
                    src="/assets/taskly-HD.png"
                    alt="Taskly"
                    className="h-8 w-auto object-contain pl-6"
                />
            </Link>

            {/* Search bar */}
            <div className="flex-1 flex justify-center">
                <div className="flex items-center bg-fore border border-border rounded-lg
                                px-4 py-2 gap-2 w-full max-w-[420px]">
                    <img src="/assets/seacrh.svg" alt="" className="w-4 h-4 shrink-0 opacity-40" />
                    <input
                        type="text"
                        placeholder="Search your task here"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 min-w-0 bg-transparent border-none outline-none ring-0
                                   text-[14px] text-ink placeholder:text-muted"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 shrink-0 mr-4">
                <div className="relative flex items-center" ref={calRef}>
                    <button
                        title={todayStr}
                        onClick={(e) => { e.stopPropagation(); setCalOpen(o => !o); }}
                        className="w-10 h-10 flex items-center justify-center rounded-xl
                                   bg-transparent border-none cursor-pointer hover:bg-fore transition-colors"
                    >
                        <img src="/assets/calendar.svg" alt="Calendar" className="w-6 h-6 object-contain" />
                    </button>
                    {calOpen && <MiniCalendar />}
                </div>

                <Link href="/profile" title='My Profile' className="flex items-center ml-1 no-underline group rounded-full outline-none">
                    <img
                        src={photoUrl}
                        alt="Profile"
                        onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?img=8'; }}
                        className="w-10 h-10 pr-6 rounded-full object-cover transition-all duration-300 ring-2 ring-border ring-offset-2 ring-offset-surface
                           group-hover:ring-pink-dark"
                    />
                </Link>
            </div>
        </header>
    );
}
import { Link, usePage } from '@inertiajs/react';

const NAV_ITEMS = [
    { label: 'Homepage',        href: 'dashboard',     icon: '/assets/homepage.svg' },
    { label: 'Vital Task',      href: 'vital-task',    icon: '/assets/vital-task.svg' },
    { label: 'My Task',         href: 'my-task',       icon: '/assets/my-task.svg' },
    { label: 'Task Categories', href: 'task-category', icon: '/assets/category.svg' },
    { label: 'Help',            href: 'help',          icon: '/assets/help.svg' },
];

export default function Sidebar() {
    const { url } = usePage();

    const isActive = (routeName) => {
        const paths = {
            'dashboard':     '/dashboard',
            'vital-task':    '/vital-task',
            'my-task':       '/my-task',
            'task-category': '/task-category',
            'help':          '/help',
        };
        return url.startsWith(paths[routeName]);
    };

    return (
        <aside className="fixed top-0 left-0 bottom-0 w-[220px] bg-sidebar flex flex-col z-50 overflow-y-auto">

            {/* Nav items */}
            <nav className="flex-1 px-3 pt-6">
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={route(item.href)}
                        className={`
                            flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] mb-0.5
                            text-[14px] font-medium text-white/90 no-underline
                            transition-colors duration-200
                            ${isActive(item.href)
                                ? 'bg-white/25 text-white'
                                : 'hover:bg-white/20 hover:text-white'}
                        `}
                    >
                        <span className="sidebar-icon w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
                            <img src={item.icon} alt="" className="w-[18px] h-[18px] object-contain" />
                        </span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Logout */}
            <Link
                href={route('logout')}
                method="post"
                as="button"
                className="flex items-center gap-2 px-6 py-3 border-t border-white/30
                           text-white/90 text-[14px] font-medium no-underline
                           hover:text-white transition-colors duration-200 w-full text-left"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
            </Link>
        </aside>
    );
}

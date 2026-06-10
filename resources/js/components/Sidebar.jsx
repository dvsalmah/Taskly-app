import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { Menu, LayoutDashboard, Flame, CheckSquare, FolderOpen, CircleHelp, LogOut } from 'lucide-react';
import ConfirmOverlay from '@/components/shared/ConfirmOverlay';

const NAV_ITEMS = [
    { label: 'Dashboard',       path: '/dashboard',     Icon: LayoutDashboard },
    { label: 'Vital Task',      path: '/vital-task',    Icon: Flame },
    { label: 'My Task',         path: '/my-task',       Icon: CheckSquare },
    { label: 'Task Categories', path: '/task-category', Icon: FolderOpen },
    { label: 'Help',            path: '/help',          Icon: CircleHelp },
];

export default function Sidebar() {
    const { url } = usePage();
    const [showLogout, setShowLogout] = useState(false);
    const { state, toggleSidebar } = useSidebar();
    const isExpanded = state === 'expanded';

    const isActive = (path) => {
        const currentPath = url.split('?')[0];
        return currentPath === path || currentPath.startsWith(path + '/');
    };

    const handleLogoutConfirm = () => {
        router.post('/logout');
    };

    return (
        <>
            <ShadcnSidebar collapsible="icon" className="border-r-0 bg-sidebar text-white w-56">
                {/* Toggle button */}
                <div className={`h-16 flex items-center mb-2 px-2 ${isExpanded ? 'justify-end pr-4' : 'justify-center'}`}>
                    <button
                        onClick={toggleSidebar}
                        className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-white/15 transition-colors cursor-pointer border-none bg-transparent"
                    >
                        <Menu size={24} className="text-white" />
                    </button>
                </div>

                {/* Navigation */}
                <SidebarContent>
                    <nav className="flex flex-col gap-3 items-center w-full">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={[
                                    'h-10 flex items-center rounded-md transition-all duration-200',
                                    'text-sm font-medium no-underline',
                                    isExpanded ? 'w-11/12 gap-3 px-3' : 'w-10 justify-center px-0',
                                    isActive(item.path)
                                        ? 'bg-white/30 text-white'
                                        : 'text-white/85 hover:bg-white/15 hover:text-white',
                                ].join(' ')}
                            >
                                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                                    <item.Icon size={20} className="shrink-0" />
                                </div>
                                {isExpanded && <span className="tracking-wide">{item.label}</span>}
                            </Link>
                        ))}
                    </nav>
                </SidebarContent>

                {/* Logout button */}
                <SidebarFooter className="border-t border-white/50 p-0 overflow-hidden">
                    <button
                        onClick={() => setShowLogout(true)}
                        className="flex items-center justify-center h-14 bg-surface/10 border-none hover:bg-surface/50 group/logout transition-colors duration-200 cursor-pointer w-full gap-3"
                    >
                        <div className="w-7 h-7 flex items-center justify-center shrink-0 text-white/80 group-hover/logout:text-pink-dark transition-colors">
                            <LogOut size={18} className="shrink-0" />
                        </div>
                        {isExpanded && (
                            <span className="tracking-wide text-white/80 text-sm font-medium group-hover/logout:text-pink-dark">
                                Logout
                            </span>
                        )}
                    </button>
                </SidebarFooter>
            </ShadcnSidebar>

            {showLogout && (
                <ConfirmOverlay
                    icon={LogOut}
                    iconColor="text-[#dc2626]"
                    title="Logout?"
                    message={<>Are you sure you want to sign out<br />of your account?</>}
                    cancelLabel="Cancel"
                    confirmLabel="Yes, Logout"
                    confirmVariant="danger"
                    onCancel={() => setShowLogout(false)}
                    onConfirm={handleLogoutConfirm}
                />
            )}
        </>
    );
}
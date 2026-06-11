import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <SidebarProvider style={{ '--sidebar-width': '14rem' }}>
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden bg-fore font-sans relative">
                <Navbar user={auth?.user} />
                <main className="flex-1 w-full bg-[#f0f2f8] overflow-y-auto !p-8 lg:!p-10">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
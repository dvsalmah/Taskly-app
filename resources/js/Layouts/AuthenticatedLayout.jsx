import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-fore font-sans relative overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out`}>
                <Sidebar />
            </div>
            <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
                <Navbar user={auth?.user} onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 w-full bg-[#f0f2f8] overflow-y-auto !p-8 lg:!p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
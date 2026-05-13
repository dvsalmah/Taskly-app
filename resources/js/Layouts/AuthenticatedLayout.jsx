import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="flex min-h-screen bg-fore font-sans">
            {/* Fixed sidebar */}
            <Sidebar />

            {/* Main area — offset by sidebar width */}
            <div className="ml-[220px] flex-1 flex flex-col min-h-screen">
                <Navbar user={auth?.user} />
                <main className="flex-1 p-7">
                    {children}
                </main>
            </div>
        </div>
    );
}

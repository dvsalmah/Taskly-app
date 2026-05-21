import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-fore font-sans">
            <Sidebar />

            <div className="flex flex-col min-h-screen" style={{ marginLeft: '224px' }}>
                <Navbar user={auth?.user} />

                <main className="flex-1 pl-6 bg-[#f0f2f8]">
                    <section className='justify-center items-center '>
                        {children}
                    </section>
                </main>
            </div>
        </div>
    );
}
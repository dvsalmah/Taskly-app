import { usePage } from '@inertiajs/react';
import AnimatedTask from '@/Components/AnimatedTask';

export default function GuestLayout({ children }) {
    const { url } = usePage();
    const isRegister = url.startsWith('/register');

    return (
        <div className="min-h-screen bg-surface w-full overflow-hidden font-['DM_Sans'] relative flex">
            <div 
                className={`absolute top-0 bottom-0 w-full md:w-1/2 bg-surface z-10 hidden md:flex items-center justify-center p-8 transition-transform duration-700 ease-in-out ${isRegister ? 'translate-x-full' : 'translate-x-0'}`}
            >
                <div className="w-full max-w-lg">
                    <AnimatedTask />
                </div>
            </div>

            <div className={`w-full md:w-1/2 min-h-screen flex items-center justify-center p-8 sm:p-12 z-0 absolute top-0 bottom-0 ${isRegister ? 'left-0' : 'right-0'}`}>
                {children}
            </div>
        </div>
    );
}
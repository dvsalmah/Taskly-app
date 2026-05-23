export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#FF9EAA] relative">
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: "url('/assets/pattern-bg.svg')", backgroundSize: '60px' }}
            ></div>

            <div className="w-full flex justify-center relative z-10">
                {children}
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

function EyeOpen() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    );
}
function EyeOff() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
    );
}

function InputGroup({ icon, children, className = '' }) {
    return (
        <div className={`flex items-center border-[1.5px] border-border rounded-[50px] px-5 py-3.5 gap-3
                         bg-surface transition-all duration-300 focus-within:border-pink-dark ${className}`}>
            {icon && <img src={icon} alt="" className="w-4 h-4 opacity-55 flex-shrink-0" />}
            {children}
        </div>
    );
}

export default function Login({ status }) {
    const [showPw, setShowPw] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        login:    '',
        password: '',
        remember: false,
    });

    useEffect(() => () => reset('password'), []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Sign In" />

            {/* Card: form left, logo right */}
            <div className="bg-surface rounded-2xl w-full max-w-[1050px] min-h-[560px]
                            flex overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.13)]">

                {/* Form side */}
                <div className="flex-1 flex flex-col justify-center px-16 py-12">
                    <h1 className="text-[32px] font-bold text-ink text-center mb-2 tracking-tight">Welcome Back!</h1>
                    <p className="text-center text-[18px] text-muted mb-7">Continue where you left off</p>

                    {/* Server error / status */}
                    {status && (
                        <div className="bg-ok-bg text-ok-text border border-ok-border rounded-[10px]
                                        px-4 py-3 text-[13px] font-medium mb-5">{status}</div>
                    )}
                    {errors.login && (
                        <div className="bg-error-bg text-error-text border border-error-border rounded-[10px]
                                        px-4 py-3 text-[13px] font-medium mb-5">{errors.login}</div>
                    )}

                    <form onSubmit={submit} className="flex flex-col gap-2.5">
                        {/* Username or Email */}
                        <InputGroup icon="/assets/user.svg">
                            <input
                                type="text"
                                placeholder="Username or Email"
                                value={data.login}
                                onChange={(e) => setData('login', e.target.value)}
                                required
                                autoComplete="username"
                                className="flex-1 border-none outline-none bg-transparent text-[14px] text-ink font-sans py-1 placeholder-border"
                            />
                        </InputGroup>

                        {/* Password */}
                        <InputGroup icon="/assets/password.svg">
                            <input
                                type={showPw ? 'text' : 'password'}
                                placeholder="Enter Password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                autoComplete="current-password"
                                className="flex-1 border-none outline-none bg-transparent text-[14px] text-ink font-sans py-1 placeholder-border"
                            />
                            <button type="button" onClick={() => setShowPw(v => !v)}
                                    className="text-muted hover:text-ink transition-colors flex-shrink-0 border-none bg-transparent cursor-pointer p-0">
                                {showPw ? <EyeOff /> : <EyeOpen />}
                            </button>
                        </InputGroup>

                        {/* Remember me */}
                        <label className="flex items-center gap-2 text-[15px] text-ink cursor-pointer mt-1">
                            <input type="checkbox" checked={data.remember}
                                   onChange={(e) => setData('remember', e.target.checked)}
                                   className="w-4 h-4 accent-pink-dark cursor-pointer" />
                            Keep me signed in
                        </label>

                        {/* Submit */}
                        <button type="submit" disabled={processing}
                                className="bg-pink-dark text-white rounded-[50px] py-4 text-[15px] font-semibold
                                           border-none cursor-pointer tracking-wide mt-2 transition-all duration-300
                                           hover:bg-pink-medium hover:-translate-y-0.5
                                           hover:shadow-[0_4px_12px_rgba(165,56,96,0.3)]
                                           active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed">
                            {processing ? 'Signing in…' : 'Sign In'}
                        </button>

                        <p className="text-center text-[15px] text-ink mt-4">
                            Don&apos;t have an account?{' '}
                            <Link href={route('register')} className="text-[#2979FF] font-semibold no-underline hover:underline">
                                Register here
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Logo side */}
                <div className="flex-1 flex items-center justify-center bg-fore/50
                                hidden sm:flex">
                    <img src="/assets/taskly.svg" alt="Taskly Logo"
                         className="w-[250px] h-[250px] object-contain" />
                </div>
            </div>
        </GuestLayout>
    );
}

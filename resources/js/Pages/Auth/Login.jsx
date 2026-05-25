import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import AnimatedTask from '@/Components/AnimatedTask';

function EyeOpen() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}
function EyeOff() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}

function MailIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );
}

function LockIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

const Login = ({ status }) => {
    const [showPw, setShowPw] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    useEffect(() => () => reset('password'), []);

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Sign In" />
            <div className="w-full max-w-md flex flex-col gap-6">
                <div className="text-center">
                    <img src="/assets/taskly-HD.png" alt="Taskly Logo" className="flex items-center justify-center h-12 !mx-auto !mb-6" />
                    <h1 className="text-[32px] font-bold text-[#2D2D2D] tracking-tight mb-2">Stay on track!</h1>
                    <p className="text-gray-500 text-[15px]">Continue where you left off</p>
                </div>

                {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                {Object.keys(errors).length > 0 && (
                    <div className="bg-[#FFEBEE] text-[#C62828] border border-[#EF9A9A] rounded-xl px-4 py-3 text-sm">
                        Please check your email and password.
                    </div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div>
                        <div className="relative flex items-center">
                            <div className="absolute left-4 pointer-events-none text-gray-400">
                                <MailIcon className="w-5 h-5 opacity-80" />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter Your Email or Username"
                                value={data.login}
                                onChange={(e) => setData('login', e.target.value)}
                                className="w-full h-11 border-0 border-b-2 border-gray-300 rounded-xl !pl-12 pr-4 text-sm text-ink bg-fore font-sans outline-none transition-all duration-200 focus:border-pink-dark focus:ring-0 placeholder-gray-400"
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative flex items-center">
                            <div className="absolute left-4 pointer-events-none text-gray-400">
                                <LockIcon className="w-5 h-5 opacity-80" />
                            </div>
                            <input
                                type={showPw ? 'text' : 'password'}
                                placeholder="Password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full h-11 border-0 border-b-2 border-gray-300 rounded-xl !pl-12 pr-4 text-sm text-ink bg-fore font-sans outline-none transition-all duration-200 focus:border-pink-dark focus:ring-0 placeholder-gray-400"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPw ? <EyeOff /> : <EyeOpen />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-[18px] h-[18px] rounded-[6px] border-2 border-gray-300 text-pink-dark focus:ring-pink-dark focus:ring-offset-0 transition-all group-hover:border-pink-dark"
                            />
                            <span className="text-[14px] text-gray-500 font-medium select-none group-hover:text-gray-700 transition-colors">Remember me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center bg-pink-dark hover:brightness-110 text-white h-14 rounded-[16px] font-bold text-[15px] transition-all hover:shadow-lg active:scale-[0.98] mt-2"
                    >
                        {processing ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-[15px] font-medium mt-2">
                    Don't have an account?{' '}
                    <Link
                        href="/register"
                        className="text-pink-dark font-bold hover:text-pink-dark/80 transition-colors"
                    >
                        Register Here
                    </Link>
                </p>
            </div>
        </>
    );
};

Login.layout = page => <GuestLayout children={page} />;
export default Login;

import { useState, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';

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

export default function ResetPassword({ token, email }) {
    const [showPw, setShowPw] = useState(false);
    const [showCfm, setShowCfm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />
            <div className="w-full max-w-md flex flex-col gap-6">
                <div className="text-center">
                    <img src="/assets/taskly-HD.png" alt="Taskly Logo" className="flex items-center justify-center h-12 !mx-auto !mb-6 object-contain" />
                    <h1 className="text-[32px] font-bold text-[#2D2D2D] tracking-tight mb-2">Create New Password</h1>
                    <p className="text-gray-500 text-[15px]">Please enter your new password below.</p>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="bg-[#FFEBEE] text-[#C62828] border border-[#EF9A9A] rounded-xl px-4 py-3 text-sm">
                        {errors.email || errors.password || "Something went wrong."}
                    </div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-5">
                    {/* Email */}
                    <div>
                        <div className="relative flex items-center">
                            <img src="/assets/mail.svg" alt="" className="absolute left-4 w-5 h-5 opacity-40" />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full h-11 border-0 border-b-2 border-gray-300 rounded-xl !pl-12 pr-4 text-sm text-ink bg-fore font-sans outline-none transition-all duration-200 focus:border-pink-dark focus:ring-0 placeholder-gray-400 opacity-60 bg-gray-50"
                                required
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className="relative flex items-center">
                            <img src="/assets/password.svg" alt="" className="absolute left-4 w-5 h-5 opacity-40" />
                            <input 
                                type={showPw ? 'text' : 'password'} 
                                placeholder="New Password"
                                value={data.password} 
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full h-11 border-0 border-b-2 border-gray-300 rounded-xl !pl-12 pr-[46px] text-sm text-ink bg-fore font-sans outline-none transition-all duration-200 focus:border-pink-dark focus:ring-0 placeholder-gray-400"
                                required 
                                autoFocus
                            />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
                                {showPw ? <EyeOff /> : <EyeOpen />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <div className="relative flex items-center">
                            <img src="/assets/password.svg" alt="" className="absolute left-4 w-5 h-5 opacity-40" />
                            <input 
                                type={showCfm ? 'text' : 'password'} 
                                placeholder="Confirm New Password"
                                value={data.password_confirmation} 
                                onChange={e => setData('password_confirmation', e.target.value)} 
                                className="w-full h-11 border-0 border-b-2 border-gray-300 rounded-xl !px-12 text-sm text-ink bg-fore font-sans outline-none transition-all duration-200 focus:border-pink-dark focus:ring-0 placeholder-gray-400"
                                required 
                            />
                            <button type="button" onClick={() => setShowCfm(!showCfm)} className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
                                {showCfm ? <EyeOff /> : <EyeOpen />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center bg-pink-dark hover:brightness-110 text-white h-14 rounded-[16px] font-bold text-[15px] transition-all hover:shadow-lg active:scale-[0.98] mt-2 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}

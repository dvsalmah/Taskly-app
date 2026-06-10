import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Lock } from 'lucide-react';

export default function ConfirmPassword() {
    const [showPw, setShowPw] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => () => reset('password'), []);

    const submit = (e) => {
        e.preventDefault();
        post('/confirm-password');
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="w-full max-w-md flex flex-col gap-6">
                <div className="text-center">
                    <img src="/assets/taskly-HD.png" alt="Taskly Logo" className="flex items-center justify-center h-12 !mx-auto !mb-6" />
                    <h1 className="text-[28px] font-bold text-[#2D2D2D] tracking-tight mb-2">Confirm Password</h1>
                    <p className="text-gray-500 text-[14px]">Please confirm your password before continuing.</p>
                </div>

                {errors.password && (
                    <div className="bg-[#FFEBEE] text-[#C62828] border border-[#EF9A9A] rounded-xl px-4 py-3 text-sm">
                        {errors.password}
                    </div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div className="relative flex items-center">
                        <div className="absolute left-4 pointer-events-none text-gray-400">
                            <Lock size={20} className="opacity-80" />
                        </div>
                        <input
                            type={showPw ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full h-11 border-0 border-b-2 border-gray-300 rounded-xl !pl-12 pr-4 text-sm text-ink bg-fore font-sans outline-none transition-all duration-200 focus:border-pink-dark focus:ring-0 placeholder-gray-400"
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none text-sm"
                        >
                            {showPw ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center bg-pink-dark hover:brightness-110 text-white h-14 rounded-[16px] font-bold text-[15px] transition-all hover:shadow-lg active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Confirming…' : 'Confirm Password'}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}

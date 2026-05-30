import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Mail } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />
            <div className="w-full max-w-md flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="text-[32px] font-bold text-[#2D2D2D] tracking-tight mb-2">Reset Password</h1>
                    <p className="text-gray-500 text-[15px]">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                {status && <div className="font-medium text-sm text-green-600 bg-green-50 rounded-xl px-4 py-3 border border-green-200">{status}</div>}
                
                {Object.keys(errors).length > 0 && (
                    <div className="bg-[#FFEBEE] text-[#C62828] border border-[#EF9A9A] rounded-xl !px-4 !py-2 text-sm">
                        Email doesn't exists.
                    </div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div>
                        <div className="relative flex items-center">
                            <Mail size={20} className="absolute left-4 opacity-40" />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter Your Email Address"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full h-11 border-0 border-b-2 border-gray-300 rounded-xl !pl-12 pr-4 text-sm text-ink bg-fore font-sans outline-none transition-all duration-200 focus:border-pink-dark focus:ring-0 placeholder-gray-400"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center bg-pink-dark hover:brightness-110 text-white h-14 rounded-[16px] font-bold text-[15px] transition-all hover:shadow-lg active:scale-[0.98] mt-2"
                    >
                        {processing ? 'Sending Link...' : 'Confirm Email'}
                    </button>
                    
                    <p className="text-center text-gray-500 text-[15px] font-medium mt-2">
                        Remember your password?{' '}
                        <Link
                            href="/login"
                            className="text-pink-dark font-bold hover:text-pink-dark/80 transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </GuestLayout>
    );
}

import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import AuthInput from '@/components/shared/AuthInput';
import { Mail, Lock } from 'lucide-react';

const Login = ({ status }) => {
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
        <GuestLayout>
            <Head title="Sign In" />
            <div className="w-full max-w-[340px] sm:max-w-md flex flex-col gap-6">
                <div className="text-center">
                    <img src="/assets/taskly-HD.png" alt="Taskly Logo" className="flex items-center justify-center h-12 !mx-auto !mb-6" />
                    <h1 className="text-[32px] font-bold text-[#2D2D2D] tracking-tight mb-2">Stay on track!</h1>
                    <p className="text-gray-500 text-[15px]">Continue where you left off</p>
                </div>

                {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                {Object.keys(errors).length > 0 && (
                    <div className="bg-[#FFEBEE] text-[#C62828] border border-[#EF9A9A] rounded-xl !px-4 !py-3 text-sm">
                        Please check your email and password.
                    </div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div>
                        <AuthInput
                            icon={Mail}
                            type="text"
                            placeholder="Enter Your Email or Username"
                            value={data.login}
                            onChange={(e) => setData('login', e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <AuthInput
                            icon={Lock}
                            type="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            autoComplete="current-password"
                        />
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
                        className="cursor-pointer w-full flex items-center justify-center bg-pink-dark hover:brightness-130 text-white h-14 rounded-[16px] font-bold text-[15px] transition-all hover:shadow-lg active:scale-[0.98] mt-2"
                    >
                        {processing ? 'Signing In' : 'Sign In'}
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
        </GuestLayout>
    );
};

export default Login;

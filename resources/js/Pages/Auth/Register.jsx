import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import AuthInput from '@/components/shared/AuthInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserRoundPen, User, Mail, Lock } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        agree: false
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Create Account" />
            
            <div className="w-full max-w-[340px] sm:max-w-lg flex flex-col gap-5 lg:gap-6 py-2">
                <div className="text-center">
                    <img src="/assets/taskly-HD.png" alt="Taskly Logo" className="flex items-center justify-center h-[42px] lg:h-12 !mx-auto !mb-4 lg:!mb-6" />
                    <h1 className="text-[26px] lg:text-[32px] font-bold text-[#2D2D2D] tracking-tight mb-1.5 lg:mb-2">Create an account</h1>
                    <p className="text-gray-500 text-[14px] lg:text-[15px]">Sign up now and start managing your tasks</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-4 lg:gap-5">
                    
                    {/* Name Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <AuthInput 
                                icon={UserRoundPen}
                                type="text" 
                                placeholder="First Name"
                                value={data.first_name} 
                                onChange={e => setData('first_name', e.target.value)} 
                                required 
                            />
                            {errors.first_name && <span className="text-[#C62828] text-xs font-medium ml-1">{errors.first_name}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <AuthInput 
                                icon={UserRoundPen}
                                type="text" 
                                placeholder="Last Name"
                                value={data.last_name} 
                                onChange={e => setData('last_name', e.target.value)} 
                                required 
                            />
                            {errors.last_name && <span className="text-[#C62828] text-xs font-medium ml-1">{errors.last_name}</span>}
                        </div>
                    </div>

                    {/* Username */}
                    <div className="flex flex-col gap-1">
                        <AuthInput 
                            icon={User}
                            type="text" 
                            placeholder="Username"
                            value={data.username} 
                            onChange={e => setData('username', e.target.value.toLowerCase().replace(/\s+/g, ''))} 
                            required 
                        />
                        {errors.username && <span className="text-[#C62828] text-xs font-medium ml-1">{errors.username}</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                        <AuthInput 
                            icon={Mail}
                            type="email" 
                            placeholder="Email Address"
                            value={data.email} 
                            onChange={e => setData('email', e.target.value)} 
                            required 
                        />
                        {errors.email && <span className="text-[#C62828] text-xs font-medium ml-1">{errors.email}</span>}
                    </div>

                    {/* Password Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <AuthInput 
                                icon={Lock}
                                type="password" 
                                placeholder="Password"
                                value={data.password} 
                                onChange={e => setData('password', e.target.value)} 
                                required 
                            />
                            {errors.password && <span className="text-[#C62828] text-xs font-medium ml-1">{errors.password}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <AuthInput 
                                icon={Lock}
                                type="password" 
                                placeholder="Confirm Password"
                                value={data.password_confirmation} 
                                onChange={e => setData('password_confirmation', e.target.value)} 
                                required 
                            />
                            {errors.password_confirmation && <span className="text-[#C62828] text-xs font-medium ml-1">{errors.password_confirmation}</span>}
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-2.5 mt-1.5">
                        <label className="flex items-start gap-2.5 cursor-pointer group pt-0.5">
                            <input 
                                type="checkbox" 
                                checked={data.agree}
                                onChange={e => setData('agree', e.target.checked)}
                                className="w-[18px] h-[18px] rounded-[6px] border-2 border-gray-300 text-pink-dark focus:ring-pink-dark focus:ring-offset-0 transition-all group-hover:border-pink-dark mt-0.5" 
                                required
                            />
                            <span className="text-[13px] text-gray-500 leading-snug font-medium select-none group-hover:text-gray-700 transition-colors">
                                I agree to Taskly's{' '}
                                <Link href="#" className="text-pink-dark hover:underline font-bold">Terms of Service</Link>
                                {' '}and{' '}
                                <Link href="#" className="text-pink-dark hover:underline font-bold">Privacy Policy</Link>
                            </span>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing || !data.agree}
                        className="cursor-pointer w-full flex items-center justify-center bg-pink-dark hover:brightness-110 text-white h-14 rounded-[16px] font-bold text-[15px] transition-all hover:shadow-lg active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Creating Account' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-[14px] lg:text-[15px] font-medium mt-1 lg:mt-2">
                    Already have an account?{' '}
                    <Link 
                        href="/login" 
                        className="text-pink-dark font-bold hover:text-pink-dark/80 transition-colors"
                    >
                        Sign In Here
                    </Link>
                </p>
            </div>
        </>
    );
}

Register.layout = page => <GuestLayout children={page} />;

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

function strengthInfo(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'];
    return { score, label: labels[score], color: colors[score] };
}

const Register = () => {
    const [showPw, setShowPw] = useState(false);
    const [showCfm, setShowCfm] = useState(false);
    const [pwStrength, setPwStrength] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        agree: false,
    });

    useEffect(() => () => reset('password', 'password_confirmation'), []);

    const handlePasswordChange = (val) => {
        setData('password', val);
        if (val.length >= 6) setPwStrength(strengthInfo(val));
        else setPwStrength(null);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Register" />
            <div className="w-full max-w-md flex flex-col gap-5">
                <div className="text-center mb-1">
                    <img src="/assets/taskly-HD.png" alt="Taskly Logo" className="flex items-center justify-center h-12 !mx-auto !mb-6 object-contain" />
                    <h1 className="text-[32px] font-bold text-[#2D2D2D] tracking-tight mb-2">Get Started!</h1>
                    <p className="text-gray-500 text-[15px]">Start your productive journey</p>
                </div>

                {errors.email && (
                    <div className="bg-[#FFEBEE] text-[#C62828] border border-[#EF9A9A] rounded-xl px-4 py-3 text-sm">
                        {errors.email}
                    </div>
                )}
                {errors.username && (
                    <div className="bg-[#FFEBEE] text-[#C62828] border border-[#EF9A9A] rounded-xl px-4 py-3 text-sm">
                        {errors.username}
                    </div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-4">
                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="relative flex items-center">
                                <img src="/assets/username.svg" alt="" className="absolute left-4 w-5 h-5 opacity-40" />
                                <input 
                                    type="text" 
                                    placeholder="First Name"
                                    value={data.first_name} 
                                    onChange={e => setData('first_name', e.target.value)} 
                                    className="w-full h-11 border-0 border-b-2 border-gray-300 rounded-xl !pl-12 text-sm text-ink bg-fore font-sans outline-none transition-all duration-200 focus:border-pink-dark focus:ring-0 placeholder-gray-400"
                                    required 
                                />
                            </div>
                            {errors.first_name && <p className="text-xs text-[#C62828] mt-1 ml-1">{errors.first_name}</p>}
                        </div>
                        <div>
                            <div className="relative flex items-center">
                                <img src="/assets/username.svg" alt="" className="absolute left-4 w-5 h-5 opacity-40" />
                                <input 
                                    type="text" 
                                    placeholder="Last Name"
                                    value={data.last_name} 
                                    onChange={e => setData('last_name', e.target.value)} 
                                    className="w-full h-11 border-0 border-b-2 border-gray-300 rounded-xl !px-12 text-sm text-ink bg-fore font-sans outline-none transition-all duration-200 focus:border-pink-dark focus:ring-0 placeholder-gray-400"
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <div className="relative flex items-center ">
                            <img src="/assets/mail.svg" alt="" className="absolute left-4 w-5 h-5 opacity-40" />
                            <input 
                                type="email" 
                                placeholder="Email Address"
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)} 
                                className="w-full h-11 border-0 border-b-2 border-gray-300 rounded-xl !pl-12 pr-4 text-sm text-ink bg-fore font-sans outline-none transition-all duration-200 focus:border-pink-dark focus:ring-0 placeholder-gray-400"
                                required 
                            />
                        </div>
                    </div>

                    {/* Username */}
                    <div>
                        <div className="relative flex items-center">
                            <svg className="absolute left-4 w-5 h-5 opacity-40 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <input 
                                type="text" 
                                placeholder="Username"
                                value={data.username} 
                                onChange={e => setData('username', e.target.value)} 
                                className="w-full h-11 border-0 border-b-2 border-gray-300 rounded-xl !pl-12 pr-4 text-sm text-ink bg-fore font-sans outline-none transition-all duration-200 focus:border-pink-dark focus:ring-0 placeholder-gray-400"
                                required 
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className="relative flex items-center">
                            <img src="/assets/password.svg" alt="" className="absolute left-4 w-5 h-5 opacity-40" />
                            <input 
                                type={showPw ? 'text' : 'password'} 
                                placeholder="Password"
                                value={data.password} 
                                onChange={e => handlePasswordChange(e.target.value)} 
                                className="w-full h-11 border-0 border-b-2 border-gray-300 rounded-xl !pl-12 pr-[46px] text-sm text-ink bg-fore font-sans outline-none transition-all duration-200 focus:border-pink-dark focus:ring-0 placeholder-gray-400"
                                required 
                            />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
                                {showPw ? <EyeOff /> : <EyeOpen />}
                            </button>
                        </div>
                        {pwStrength && (
                            <div className="mt-2 ml-1">
                                <div className="flex gap-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div 
                                            key={i} 
                                            className="flex-1 h-full transition-all duration-300"
                                            style={{ backgroundColor: i <= pwStrength.score ? pwStrength.color : 'transparent' }}
                                        />
                                    ))}
                                </div>
                                <p className="text-[11px] font-semibold mt-1" style={{ color: pwStrength.color }}>
                                    {pwStrength.label} Password
                                </p>
                            </div>
                        )}
                        {errors.password && <p className="text-xs text-[#C62828] mt-1 ml-1">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <div className="relative flex items-center">
                            <img src="/assets/password.svg" alt="" className="absolute left-4 w-5 h-5 opacity-40" />
                            <input 
                                type={showCfm ? 'text' : 'password'} 
                                placeholder="Confirm Password"
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

                    {/* Checkbox */}
                    <div className="flex mt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={data.agree}
                                onChange={e => setData('agree', e.target.checked)}
                                className="mt-0.5 w-[18px] h-[18px] rounded-[6px] border-2 border-gray-300 text-pink-dark focus:ring-pink-dark focus:ring-offset-0 transition-all group-hover:border-pink-dark"
                                required
                            />
                            <span className="text-[13px] text-gray-500 font-medium leading-tight">
                                I agree to the <a href="#" className="text-pink-dark hover:underline font-bold">Terms of Service</a> and <a href="#" className="text-pink-dark hover:underline font-bold">Privacy Policy</a>
                            </span>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing || !data.agree}
                        className="w-full flex items-center justify-center bg-pink-dark hover:brightness-110 text-white h-14 rounded-[16px] font-bold text-[15px] transition-all hover:shadow-lg active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-[15px] font-medium mt-2">
                    Already have an account?{' '}
                    <Link 
                        href="/login" 
                        className="text-pink-dark font-bold hover:text-pink-dark/80 transition-colors"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </>
    );
};

Register.layout = page => <GuestLayout children={page} />;
export default Register;

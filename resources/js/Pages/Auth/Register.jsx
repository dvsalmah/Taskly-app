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

function InputGroup({ icon, children }) {
    return (
        <div className="flex items-center border-[1.5px] border-border rounded-[50px] px-5 py-3.5 gap-3
                        bg-surface transition-all duration-300 focus-within:border-pink-dark">
            {icon && <img src={icon} alt="" className="w-4 h-4 opacity-55 flex-shrink-0" />}
            {children}
        </div>
    );
}

function strengthInfo(password) {
    let score = 0;
    if (password.length >= 8)           score++;
    if (/[A-Z]/.test(password))         score++;
    if (/[0-9]/.test(password))         score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'];
    return { score, label: labels[score], color: colors[score] };
}

export default function Register() {
    const [showPw, setShowPw]       = useState(false);
    const [showCfm, setShowCfm]     = useState(false);
    const [pwStrength, setPwStrength] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name:            '',
        last_name:             '',
        username:              '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        agree:                 false,
    });

    useEffect(() => () => reset('password', 'password_confirmation'), []);

    const handlePasswordChange = (val) => {
        setData('password', val);
        if (val.length >= 6) setPwStrength(strengthInfo(val));
        else setPwStrength(null);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {/* Card: logo left, form right */}
            <div className="bg-surface rounded-2xl w-full max-w-[1100px] min-h-[600px]
                            flex overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.13)]">

                {/* Logo side */}
                <div className="flex-1 items-center justify-center bg-fore/50 hidden sm:flex">
                    <img src="/assets/taskly.svg" alt="Taskly Logo"
                         className="w-[220px] h-[220px] object-contain" />
                </div>

                {/* Form side */}
                <div className="flex-1 flex flex-col justify-center px-14 py-10 overflow-y-auto">
                    <h1 className="text-[30px] font-bold text-ink text-center mb-1.5 tracking-tight">Stay on track!</h1>
                    <p className="text-center text-[16px] text-muted mb-6">Start your productive journey</p>

                    {errors.email && (
                        <div className="bg-error-bg text-error-text border border-error-border rounded-[10px]
                                        px-4 py-3 text-[13px] font-medium mb-4">{errors.email}</div>
                    )}
                    {errors.username && (
                        <div className="bg-error-bg text-error-text border border-error-border rounded-[10px]
                                        px-4 py-3 text-[13px] font-medium mb-4">{errors.username}</div>
                    )}

                    <form onSubmit={submit} className="flex flex-col gap-2.5">
                        {/* First name */}
                        <InputGroup icon="/assets/username.svg">
                            <input type="text" placeholder="Enter First Name"
                                   value={data.first_name} onChange={e => setData('first_name', e.target.value)} required
                                   className="flex-1 border-none outline-none bg-transparent text-[14px] text-ink font-sans py-1 placeholder-border" />
                        </InputGroup>
                        {errors.first_name && <p className="text-[12px] text-error-text pl-1">{errors.first_name}</p>}

                        {/* Last name */}
                        <InputGroup icon="/assets/username.svg">
                            <input type="text" placeholder="Enter Last Name"
                                   value={data.last_name} onChange={e => setData('last_name', e.target.value)} required
                                   className="flex-1 border-none outline-none bg-transparent text-[14px] text-ink font-sans py-1 placeholder-border" />
                        </InputGroup>

                        {/* Username */}
                        <InputGroup icon="/assets/user.svg">
                            <input type="text" placeholder="Enter Username"
                                   value={data.username} onChange={e => setData('username', e.target.value)} required
                                   className="flex-1 border-none outline-none bg-transparent text-[14px] text-ink font-sans py-1 placeholder-border" />
                        </InputGroup>

                        {/* Email */}
                        <InputGroup icon="/assets/mail.svg">
                            <input type="email" placeholder="Enter Email"
                                   value={data.email} onChange={e => setData('email', e.target.value)} required
                                   className="flex-1 border-none outline-none bg-transparent text-[14px] text-ink font-sans py-1 placeholder-border" />
                        </InputGroup>

                        {/* Password */}
                        <InputGroup icon="/assets/password.svg">
                            <input type={showPw ? 'text' : 'password'} placeholder="Enter Password"
                                   value={data.password} onChange={e => handlePasswordChange(e.target.value)} required
                                   className="flex-1 border-none outline-none bg-transparent text-[14px] text-ink font-sans py-1 placeholder-border" />
                            <button type="button" onClick={() => setShowPw(v => !v)}
                                    className="text-muted hover:text-ink transition-colors flex-shrink-0 border-none bg-transparent cursor-pointer p-0">
                                {showPw ? <EyeOff /> : <EyeOpen />}
                            </button>
                        </InputGroup>
                        {pwStrength && pwStrength.score < 4 && (
                            <p className="text-[12px] font-medium pl-1" style={{ color: pwStrength.color }}>
                                ● Strength: {pwStrength.label}
                            </p>
                        )}

                        {/* Confirm password */}
                        <InputGroup icon="/assets/password.svg">
                            <input type={showCfm ? 'text' : 'password'} placeholder="Confirm Password"
                                   value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required
                                   className="flex-1 border-none outline-none bg-transparent text-[14px] text-ink font-sans py-1 placeholder-border" />
                            <button type="button" onClick={() => setShowCfm(v => !v)}
                                    className="text-muted hover:text-ink transition-colors flex-shrink-0 border-none bg-transparent cursor-pointer p-0">
                                {showCfm ? <EyeOff /> : <EyeOpen />}
                            </button>
                        </InputGroup>
                        {errors.password && <p className="text-[12px] text-error-text pl-1">{errors.password}</p>}

                        {/* Agree */}
                        <label className="flex items-center gap-2 text-[14px] text-ink cursor-pointer mt-1">
                            <input type="checkbox" checked={data.agree} onChange={e => setData('agree', e.target.checked)}
                                   required className="w-4 h-4 accent-pink-dark cursor-pointer" />
                            I agree to Terms of Service and Privacy Policy
                        </label>

                        {/* Submit */}
                        <button type="submit" disabled={processing}
                                className="bg-pink-dark text-white rounded-[50px] py-4 text-[15px] font-semibold
                                           border-none cursor-pointer tracking-wide mt-2 transition-all duration-300
                                           hover:bg-pink-medium hover:-translate-y-0.5
                                           hover:shadow-[0_4px_12px_rgba(165,56,96,0.3)]
                                           active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed">
                            {processing ? 'Creating account…' : 'Register'}
                        </button>

                        <p className="text-center text-[14px] text-ink mt-3">
                            Already have an account?{' '}
                            <Link href={route('login')} className="text-[#2979FF] font-semibold no-underline hover:underline">
                                Login here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}

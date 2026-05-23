import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

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

export default function Register() {
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
        <GuestLayout>
            <Head title="Register" />

            {/* Card */}
            <div className="auth-card" style={{
                borderRadius: '20px',
                width: '100%',
                maxWidth: '1100px',
                display: 'flex',
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
            }}>
                {/* Logo side */}
                <div className="auth-logo-side">
                    <img src="/assets/taskly.svg" alt="Taskly Logo" style={{ width: '200px', height: '200px', objectFit: 'contain' }} />
                </div>

                {/* Form side */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '40px 48px',
                    overflowY: 'auto',
                }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#2D2D2D',
                        textAlign: 'center',
                        marginBottom: '6px',
                        letterSpacing: '-0.5px',
                        fontFamily: "'DM Sans', sans-serif",
                    }}>Stay on track!</h1>
                    <p style={{
                        textAlign: 'center',
                        fontSize: '15px',
                        color: '#888',
                        marginBottom: '24px',
                        fontFamily: "'DM Sans', sans-serif",
                    }}>Start your productive journey</p>

                    {errors.email && (
                        <div style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #EF9A9A', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', marginBottom: '12px' }}>
                            {errors.email}
                        </div>
                    )}
                    {errors.username && (
                        <div style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #EF9A9A', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', marginBottom: '12px' }}>
                            {errors.username}
                        </div>
                    )}

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {/* First name */}
                        <div className="auth-input-group">
                            <img src="/assets/username.svg" alt="" style={{ width: '16px', height: '16px', opacity: 0.55, flexShrink: 0 }} />
                            <input type="text" placeholder="Enter First Name"
                                value={data.first_name} onChange={e => setData('first_name', e.target.value)} required />
                        </div>
                        {errors.first_name && <p style={{ fontSize: '12px', color: '#C62828', paddingLeft: '4px' }}>{errors.first_name}</p>}

                        {/* Last name */}
                        <div className="auth-input-group">
                            <img src="/assets/username.svg" alt="" style={{ width: '16px', height: '16px', opacity: 0.55, flexShrink: 0 }} />
                            <input type="text" placeholder="Enter Last Name"
                                value={data.last_name} onChange={e => setData('last_name', e.target.value)} required />
                        </div>

                        {/* Username */}
                        <div className="auth-input-group">
                            <img src="/assets/user.svg" alt="" style={{ width: '16px', height: '16px', opacity: 0.55, flexShrink: 0 }} />
                            <input type="text" placeholder="Enter Username"
                                value={data.username} onChange={e => setData('username', e.target.value)} required />
                        </div>

                        {/* Email */}
                        <div className="auth-input-group">
                            <img src="/assets/mail.svg" alt="" style={{ width: '16px', height: '16px', opacity: 0.55, flexShrink: 0 }} />
                            <input type="email" placeholder="Enter Email"
                                value={data.email} onChange={e => setData('email', e.target.value)} required />
                        </div>

                        {/* Password */}
                        <div className="auth-input-group">
                            <img src="/assets/password.svg" alt="" style={{ width: '16px', height: '16px', opacity: 0.55, flexShrink: 0 }} />
                            <input type={showPw ? 'text' : 'password'} placeholder="Enter Password"
                                value={data.password} onChange={e => handlePasswordChange(e.target.value)} required />
                            <button type="button" className="eye-btn" onClick={() => setShowPw(v => !v)}>
                                {showPw ? <EyeOpen /> : <EyeOff />}
                            </button>
                        </div>
                        {pwStrength && pwStrength.score < 4 && (
                            <p style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '4px', color: pwStrength.color }}>
                                ● Strength: {pwStrength.label}
                            </p>
                        )}

                        {/* Confirm password */}
                        <div className="auth-input-group">
                            <img src="/assets/password.svg" alt="" style={{ width: '16px', height: '16px', opacity: 0.55, flexShrink: 0 }} />
                            <input type={showCfm ? 'text' : 'password'} placeholder="Confirm Password"
                                value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required />
                            <button type="button" className="eye-btn" onClick={() => setShowCfm(v => !v)}>
                                {showCfm ? <EyeOpen /> : <EyeOff />}
                            </button>
                        </div>
                        {errors.password && <p style={{ fontSize: '12px', color: '#C62828', paddingLeft: '4px' }}>{errors.password}</p>}

                        {/* Agree */}
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            fontSize: '13px', color: '#2D2D2D', cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif", marginTop: '2px',
                        }}>
                            <input type="checkbox" checked={data.agree}
                                onChange={e => setData('agree', e.target.checked)}
                                required style={{ width: '15px', height: '15px', flexShrink: 0, accentColor: '#861043', cursor: 'pointer' }} />
                            I agree to Terms of Service and Privacy Policy
                        </label>

                        {/* Submit */}
                        <button type="submit" disabled={processing} style={{
                            width: '100%',
                            background: '#861043',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50px',
                            padding: '14px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: processing ? 'not-allowed' : 'pointer',
                            opacity: processing ? 0.7 : 1,
                            fontFamily: "'DM Sans', sans-serif",
                            letterSpacing: '0.5px',
                            marginTop: '6px',
                            transition: 'background 0.2s',
                        }}>
                            {processing ? 'Creating account…' : 'Register'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '13px', color: '#2D2D2D', marginTop: '10px', fontFamily: "'DM Sans', sans-serif" }}>
                            Already have an account?{' '}
                            <Link href="/login" style={{ color: '#2979FF', fontWeight: '600', textDecoration: 'none' }}>
                                Login here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}

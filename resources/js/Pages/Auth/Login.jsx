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

export default function Login({ status }) {
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
        <GuestLayout>
            <Head title="Sign In" />

            {/* Card */}
            <div className="auth-card" style={{
                borderRadius: '20px',
                width: '100%',
                maxWidth: '1050px',
                minHeight: '460px',
                display: 'flex',
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
            }}>
                {/* Form side */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '48px 40px',
                }}>
                    <h1 style={{
                        fontSize: '30px',
                        fontWeight: '700',
                        color: '#2D2D2D',
                        textAlign: 'center',
                        marginBottom: '6px',
                        letterSpacing: '-0.5px',
                        fontFamily: "'DM Sans', sans-serif",
                    }}>Welcome Back!</h1>
                    <p style={{
                        textAlign: 'center',
                        fontSize: '16px',
                        color: '#888',
                        marginBottom: '28px',
                        fontFamily: "'DM Sans', sans-serif",
                    }}>Continue where you left off</p>

                    {status && (
                        <div style={{ background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
                            {status}
                        </div>
                    )}
                    {errors.login && (
                        <div style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #EF9A9A', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
                            {errors.login}
                        </div>
                    )}

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Username */}
                        <div className="auth-input-group">
                            <img src="/assets/user.svg" alt="" style={{ width: '16px', height: '16px', opacity: 0.55, flexShrink: 0 }} />
                            <input
                                type="text"
                                placeholder="Username or Email"
                                value={data.login}
                                onChange={(e) => setData('login', e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div className="auth-input-group">
                            <img src="/assets/password.svg" alt="" style={{ width: '16px', height: '16px', opacity: 0.55, flexShrink: 0 }} />
                            <input
                                type={showPw ? 'text' : 'password'}
                                placeholder="Enter Password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            <button type="button" className="eye-btn" onClick={() => setShowPw(v => !v)}>
                                {showPw ? <EyeOpen /> : <EyeOff />}
                            </button>
                        </div>

                        {/* Remember me */}
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            fontSize: '14px', color: '#2D2D2D', cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            <input type="checkbox" checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                style={{ width: '16px', height: '16px', accentColor: '#861043', cursor: 'pointer' }} />
                            Keep me signed in
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
                            transition: 'background 0.2s, transform 0.2s',
                        }}
                            onMouseEnter={e => { if (!processing) e.currentTarget.style.background = '#C97B84'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = processing ? '#861043' : '#861043'; }}
                        >
                            {processing ? 'Signing in…' : 'Sign In'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '14px', color: '#2D2D2D', marginTop: '12px', fontFamily: "'DM Sans', sans-serif" }}>
                            Don&apos;t have an account?{' '}
                            <Link href="/register" style={{ color: '#2979FF', fontWeight: '600', textDecoration: 'none' }}>
                                Register here
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Logo side */}
                <div className="auth-logo-side">
                    <img src="/assets/taskly.svg" alt="Taskly Logo" style={{ width: '220px', height: '220px', objectFit: 'contain' }} />
                </div>
            </div>
        </GuestLayout>
    );
}

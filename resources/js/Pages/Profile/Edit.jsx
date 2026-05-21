import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/* ───────────── Toast notification ───────────── */
function Toast({ type, msg, onClose }) {
    return (
        <div
            className="fixed top-6 right-6 z-[9000] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
            style={{
                background: type === 'success' ? '#f0fdf4' : '#fef2f2',
                border: `1.5px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                color: type === 'success' ? '#15803d' : '#dc2626',
                animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
                minWidth: '260px',
            }}
        >
            <span className="text-lg mt-[-2px]">{type === 'success' ? '✅' : '❌'}</span>
            <div className="flex-1 text-[13px] font-semibold leading-snug">{msg}</div>
            <button
                onClick={onClose}
                className="ml-2 mt-[-2px] text-[18px] font-bold bg-transparent border-none cursor-pointer opacity-40 hover:opacity-80 transition-opacity"
                style={{ color: 'inherit' }}
            >×</button>

            <style>{`
                @keyframes toastIn {
                    from { opacity: 0; transform: translateX(40px) scale(0.95); }
                    to   { opacity: 1; transform: translateX(0)     scale(1); }
                }
            `}</style>
        </div>
    );
}

/* ───────────── Avatar upload ring ───────────── */
function AvatarUploader({ previewUrl, currentUrl, onFileChange, onCancel, fileRef }) {
    const [dragging, setDragging] = useState(false);
    const displaySrc = previewUrl ?? currentUrl;

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            // synthetic event
            onFileChange({ target: { files: [file] } });
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar ring */}
            <div
                className="relative group cursor-pointer"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                <div
                    className="w-28 h-28 rounded-full overflow-hidden transition-all duration-300"
                    style={{
                        boxShadow: dragging
                            ? '0 0 0 4px #e84393, 0 0 0 8px rgba(232,67,147,0.2)'
                            : '0 0 0 3px #e84393, 0 0 0 6px rgba(232,67,147,0.15)',
                    }}
                >
                    <img
                        src={displaySrc}
                        alt="Profile"
                        onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?img=8'; }}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
                    />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="flex flex-col items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                            viewBox="0 0 24 24" fill="none" stroke="white"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                        <span className="text-[10px] font-bold text-white">Change</span>
                    </div>
                </div>

                {/* Preview badge */}
                {previewUrl && (
                    <div
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg"
                        style={{ background: '#e84393' }}
                        title="Preview — not saved yet"
                    >✦</div>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={onFileChange}
            />

            {/* Hint / cancel */}
            <div className="text-center">
                {previewUrl ? (
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[12px] font-semibold" style={{ color: '#e84393' }}>
                            Preview active — not saved yet
                        </span>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-[12px] text-muted underline bg-transparent border-none cursor-pointer hover:text-ink transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <p className="text-[12px] text-muted">
                        Click or drag to change photo
                    </p>
                )}
            </div>
        </div>
    );
}

/* ───────────── Field component ───────────── */
function Field({ label, children }) {
    return (
        <div>
            <label className="block text-[12px] font-bold text-muted uppercase tracking-wider mb-1.5">
                {label}
            </label>
            {children}
        </div>
    );
}

/* ───────────── Main page ───────────── */
export default function ProfileEdit({ user }) {
    const [form, setForm] = useState({
        first_name: user.first_name ?? '',
        last_name:  user.last_name  ?? '',
        email:      user.email      ?? '',
        contact:    user.contact    ?? '',
        position:   user.position   ?? '',
    });
    const [photoFile, setPhotoFile]       = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [busy, setBusy]                 = useState(false);
    const [toast, setToast]               = useState(null);
    const fileRef = useRef();

    const field = (key) => ({
        value: form[key],
        onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
        className: inputCls,
    });

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setPhotoPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const cancelPreview = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 4000);
    };

    const submit = (e) => {
        e.preventDefault();
        setBusy(true);
        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));
        if (photoFile) data.append('photo', photoFile);

        router.post(route('profile.update'), data, {
            forceFormData: true,
            onSuccess: () => {
                showToast('success', 'Profile updated successfully!');
                setPhotoFile(null);
                setPhotoPreview(null);
                if (fileRef.current) fileRef.current.value = '';
            },
            onError: (errs) => {
                const firstErr = Object.values(errs)[0];
                showToast('error', firstErr || 'Something went wrong.');
            },
            onFinish: () => setBusy(false),
        });
    };

    const inputCls = [
        'w-full border-[1.5px] border-border rounded-xl px-4 py-3 text-[14px] text-ink',
        'bg-fore font-sans outline-none transition-all duration-200',
        'focus:border-pink-dark focus:bg-surface focus:shadow-[0_0_0_3px_rgba(232,67,147,0.1)]',
    ].join(' ');

    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            {/* Toast */}
            {toast && <Toast type={toast.type} msg={toast.msg} onClose={() => setToast(null)} />}

            <div className="max-w-3xl">
                {/* Page header */}
                <div className="mb-6">
                    <h1 className="text-[22px] font-extrabold text-ink tracking-tight">My Profile</h1>
                    <p className="text-[13px] text-muted mt-0.5">Manage your account information and photo</p>
                </div>

                <form onSubmit={submit} encType="multipart/form-data">
                    {/* ── Card ── */}
                    <div className="bg-surface rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] overflow-hidden">

                        {/* Top banner */}
                        <div
                            className="h-24 w-full"
                            style={{
                                background: 'linear-gradient(135deg, #e84393 0%, #f97316 60%, #facc15 100%)',
                                opacity: 0.85,
                            }}
                        />

                        {/* Avatar — overlaps banner */}
                        <div className="px-8 pb-0 -mt-14 flex items-end gap-6">
                            <AvatarUploader
                                previewUrl={photoPreview}
                                currentUrl={user.photo_url}
                                onFileChange={handleFileChange}
                                onCancel={cancelPreview}
                                fileRef={fileRef}
                            />
                            <div className="pb-3">
                                <p className="text-[18px] font-extrabold text-ink leading-tight">
                                    {form.first_name || 'First'} {form.last_name || 'Last'}
                                </p>
                                <p className="text-[13px] text-muted">
                                    {user.username && `@${user.username}`}
                                </p>
                                {form.position && (
                                    <span
                                        className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white"
                                        style={{ background: '#e84393' }}
                                    >
                                        {form.position}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="mx-8 mt-5 mb-6 border-t border-border" />

                        {/* Fields grid */}
                        <div className="px-8 pb-8">
                            <p className="text-[12px] font-bold text-muted uppercase tracking-widest mb-5">
                                Account Information
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Field label="First Name">
                                    <input type="text" placeholder="First name" {...field('first_name')} />
                                </Field>

                                <Field label="Last Name">
                                    <input type="text" placeholder="Last name" {...field('last_name')} />
                                </Field>

                                <Field label="Email Address">
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className={[inputCls, 'sm:col-span-2'].join(' ')}
                                        value={form.email}
                                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                    />
                                </Field>

                                <Field label="Contact Number">
                                    <input type="text" placeholder="+62..." {...field('contact')} />
                                </Field>

                                <Field label="Position / Role">
                                    <input type="text" placeholder="e.g. Designer" {...field('position')} />
                                </Field>

                                {/* Username — read-only */}
                                <Field label="Username">
                                    <input
                                        type="text"
                                        value={user.username ?? ''}
                                        readOnly
                                        className={[inputCls, 'opacity-60 cursor-not-allowed'].join(' ')}
                                        title="Username cannot be changed"
                                    />
                                </Field>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 mt-8 pt-5 border-t border-border">
                                <button
                                    type="submit"
                                    disabled={busy}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-bold
                                               text-white border-none cursor-pointer transition-all duration-200
                                               hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(232,67,147,0.4)]
                                               disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                                    style={{ background: busy ? '#e84393' : 'linear-gradient(135deg,#e84393,#c02070)' }}
                                >
                                    {busy ? (
                                        <>
                                            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg"
                                                width="14" height="14" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="3">
                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                            </svg>
                                            Saving…
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                                <polyline points="17 21 17 13 7 13 7 21" />
                                                <polyline points="7 3 7 8 15 8" />
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>

                                {photoPreview && (
                                    <button
                                        type="button"
                                        onClick={cancelPreview}
                                        className="px-4 py-3 rounded-xl text-[13px] font-semibold
                                                   border border-border text-muted bg-transparent
                                                   hover:bg-fore transition-colors cursor-pointer"
                                    >
                                        Cancel Photo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

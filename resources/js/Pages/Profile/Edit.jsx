import { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Camera, Loader2, Save, Trash2 } from 'lucide-react';

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
            <div className="flex-1 text-sm !p-2 font-semibold leading-snug">{msg}</div>

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
                    className={`w-20 h-20 rounded-full overflow-hidden transition-all duration-300 ring-2 ring-offset-2 ring-offset-surface
                               ${dragging ? 'ring-pink-dark scale-105' : 'ring-pink-dark'}`}
                >
                    <img
                        src={displaySrc}
                        alt="Profile"
                        onError={(e) => { e.target.src = '/assets/avatar.png'; }}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
                    />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="flex flex-col items-center gap-1">
                        <Camera size={22} className="text-white" />
                        <span className="text-[10px] font-bold text-white">Change</span>
                    </div>
                </div>
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
            <div className="text-center h-10 flex flex-col items-center justify-start">
                {previewUrl ? (
                    <div className="flex flex-col">
                        <span className="text-sm text-pink-dark font-semibold leading-tight">
                            Not saved yet
                        </span>
                    </div>
                ) : (
                    <p className="text-xs text-muted leading-tight">
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
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
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
        last_name: user.last_name ?? '',
        email: user.email ?? '',
        contact: user.contact ?? '',
        position: user.position ?? '',
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState(null);
    const fileRef = useRef();

    const cropToSquare = (file) =>
        new Promise((resolve) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                const size = Math.min(img.width, img.height);
                const sx   = (img.width  - size) / 2;
                const sy   = (img.height - size) / 2;
                const canvas = document.createElement('canvas');
                canvas.width  = size;
                canvas.height = size;
                canvas.getContext('2d').drawImage(img, sx, sy, size, size, 0, 0, size, size);
                canvas.toBlob(
                    (blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })),
                    'image/jpeg', 0.92
                );
            };
            img.src = url;
        });

    const field = (key) => ({
        value: form[key],
        onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
        className: inputCls,
    });

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const cropped = await cropToSquare(file);
        setPhotoFile(cropped);
        const reader = new FileReader();
        reader.onload = (ev) => setPhotoPreview(ev.target.result);
        reader.readAsDataURL(cropped);
    };

    const cancelPreview = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [pendingVisit, setPendingVisit] = useState(null);
    const ignoreDirtyRef = useRef(false);

    const isDirty =
        form.first_name !== (user.first_name ?? '') ||
        form.last_name !== (user.last_name ?? '') ||
        form.email !== (user.email ?? '') ||
        form.contact !== (user.contact ?? '') ||
        form.position !== (user.position ?? '') ||
        photoFile !== null;

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty && !ignoreDirtyRef.current) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        const removeBeforeListener = router.on('before', (event) => {
            if (isDirty && !ignoreDirtyRef.current && event.detail.visit.method === 'get') {
                event.preventDefault();
                setPendingVisit(event.detail.visit);
                setShowCancelModal(true);
            }
        });

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            removeBeforeListener();
        };
    }, [isDirty]);

    const handleCancelClick = () => {
        if (isDirty) {
            setShowCancelModal(true);
        } else {
            window.history.back();
        }
    };

    const confirmCancel = () => {
        ignoreDirtyRef.current = true;
        setShowCancelModal(false);
        setForm({
            first_name: user.first_name ?? '',
            last_name: user.last_name ?? '',
            email: user.email ?? '',
            contact: user.contact ?? '',
            position: user.position ?? '',
        });
        cancelPreview();

        if (pendingVisit) {
            setTimeout(() => {
                router.visit(pendingVisit.url, pendingVisit);
                ignoreDirtyRef.current = false;
            }, 0);
        } else {
            ignoreDirtyRef.current = false;
        }
    };

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 4000);
    };

    const submit = (e) => {
        e.preventDefault();
        setBusy(true);
        ignoreDirtyRef.current = true;
        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));
        if (photoFile) data.append('photo', photoFile);

        router.post('/profile', data, {
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
            onFinish: () => {
                setBusy(false);
                ignoreDirtyRef.current = false;
            },
        });
    };

    const inputCls = [
        'w-full h-10 border-b-2 border-gray-300 rounded-xl !px-4 text-sm text-ink',
        'bg-fore font-sans outline-none transition-all duration-200',
        'focus:border-pink-dark',
    ].join(' ');

    return (
        <AuthenticatedLayout>
            <Head title="Profile" />
            {toast && <Toast type={toast.type} msg={toast.msg} onClose={() => setToast(null)} />}

            <div className="max-w-6xl">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="bg-surface rounded-2xl !p-4 shadow-[0_2px_20px_rgba(0,0,0,0.08)] overflow-hidden">
                        <div className='flex-1 text-md font-bold !px-6 !mb-4'>Account Information</div>

                        {/* Avatar */}
                        <div className="!px-8 pb-0 flex items-center gap-6">
                            <AvatarUploader
                                previewUrl={photoPreview}
                                currentUrl={user.photo_url}
                                onFileChange={handleFileChange}
                                onCancel={cancelPreview}
                                fileRef={fileRef}
                            />
                            <div className="flex flex-col justify-center">
                                <p className="text-lg font-bold text-ink leading-tight mb-1">
                                    {form.first_name || 'First'} {form.last_name || 'Last'}
                                </p>
                                <p className="text-xs text-muted">
                                    {user.email}
                                </p>
                                {form.position && (
                                    <span
                                        className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-bold text-white w-max bg-pink-dark"
                                    >
                                        {form.position}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="mx-8 border-t border-border" />

                        {/* Fields grid */}
                        <div className="!p-8 w-full">
                            <p className="text-xs font-bold text-muted uppercase tracking-widest !mb-2">
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

                                {/* Username*/}
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
                            <div className="flex items-center justify-end gap-3 !mt-6">
                                <button
                                    type="button"
                                    onClick={handleCancelClick}
                                    disabled={busy}
                                    className="lex items-center gap-2 !px-8 !py-2 rounded-xl text-sm font-bold
                                               border border-gray-200 text-ink bg-fore hover:bg-border transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={busy}
                                    className="flex items-center gap-2 !px-8 !py-2 rounded-xl text-sm font-bold
                                               text-white border-none cursor-pointer transition-all duration-200
                                               hover:bg-pink-dark/80 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
                                               bg-pink-dark"
                                >
                                    {busy ? (
                                        <>
                                            <Loader2 size={14} strokeWidth={3} className="animate-spin" />
                                            Saving…
                                        </>
                                    ) : (
                                        <>
                                            <Save size={14} strokeWidth={2.5} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
                >
                    <div
                        className="bg-surface rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center gap-4 h-54 w-100 overflow-hidden"
                        style={{ animation: 'overlayFadeIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-full flex items-center justify-center">
                            <Trash2 size={28} strokeWidth={2.2} className="text-pink-dark" />
                        </div>

                        {/* Text */}
                        <div className="text-center">
                            <p className="text-md font-bold text-ink mb-1">Discard changes?</p>
                            <p className="text-sm text-muted leading-relaxed">
                                Are you sure you want to discard<br />your unsaved changes?
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center w-60 gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setPendingVisit(null);
                                }}
                                className="flex-1 h-8 rounded-xl text-sm font-semibold
                                           border border-gray-200 text-ink bg-fore
                                           hover:bg-border hover:-translate-y-px transition-all cursor-pointer"
                            >
                                Keep Editing
                            </button>
                            <button
                                type="button"
                                onClick={confirmCancel}
                                className="flex-1 h-8 bg-pink-dark text-white rounded-xl text-sm font-semibold
                                           cursor-pointer transition-all hover:-translate-y-px"
                            >
                                Discard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

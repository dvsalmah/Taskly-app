import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ProfileEdit({ user }) {
    const [form, setForm]       = useState({
        first_name: user.first_name ?? '',
        last_name:  user.last_name  ?? '',
        email:      user.email      ?? '',
        contact:    user.contact    ?? '',
        position:   user.position   ?? '',
    });
    const [photoFile, setPhotoFile]     = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [busy, setBusy]               = useState(false);
    const [flash, setFlash]             = useState(null);
    const fileRef = useRef();

    const handleField = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleFileChange = (e) => {
        const file = e.target.files[0];
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

    const submit = (e) => {
        e.preventDefault();
        setBusy(true);
        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));
        if (photoFile) data.append('photo', photoFile);

        router.post(route('profile.update'), data, {
            forceFormData: true,
            onSuccess: () => {
                setFlash({ type: 'success', msg: 'Profile updated successfully.' });
                setPhotoFile(null);
                setPhotoPreview(null);
                if (fileRef.current) fileRef.current.value = '';
            },
            onError: (errs) => {
                const firstErr = Object.values(errs)[0];
                setFlash({ type: 'error', msg: firstErr });
            },
            onFinish: () => setBusy(false),
        });
    };

    const labelCls = 'block text-[13px] font-semibold text-ink mb-1.5';
    const inputCls = 'w-full border-[1.5px] border-border rounded-lg px-3.5 py-2.5 text-[14px] text-ink bg-surface font-sans outline-none transition-colors focus:border-pink-dark';

    const displayPhoto = photoPreview ?? user.photo_url;

    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="bg-surface rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.07)] p-7 max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[18px] font-bold text-ink">Account Information</h2>
                </div>

                {/* Avatar preview */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border flex-shrink-0 shadow-sm">
                        <img src={displayPhoto} alt="Profile"
                             onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?img=8'; }}
                             className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-[16px] font-semibold text-ink">{form.first_name} {form.last_name}</p>
                        <p className="text-[13px] text-muted">{user.username && `@${user.username}`}</p>
                        <p className="text-[13px] text-muted">{form.email}</p>
                    </div>
                </div>

                {flash && (
                    <div className={`px-4 py-3 rounded-[10px] text-[13px] font-medium mb-5 border
                        ${flash.type === 'success'
                            ? 'bg-ok-bg text-ok-text border-ok-border'
                            : 'bg-error-bg text-error-text border-error-border'}`}>
                        {flash.msg}
                    </div>
                )}

                <form onSubmit={submit} encType="multipart/form-data">
                    {/* Photo upload */}
                    <div className="mb-5">
                        <label className={labelCls}>Profile Photo</label>
                        <div className="flex items-center gap-3 flex-wrap">
                            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold
                                             text-ink border border-border cursor-pointer hover:bg-fore transition-colors">
                                <img src="/assets/camera.svg" alt="" className="w-4 h-4 opacity-70" />
                                Choose File
                                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/jpg"
                                       className="hidden" onChange={handleFileChange} />
                            </label>
                            {photoPreview && (
                                <button type="button" onClick={cancelPreview}
                                        className="text-[12px] text-error-text border-none bg-transparent cursor-pointer underline">
                                    Cancel preview
                                </button>
                            )}
                        </div>
                        {photoFile && (
                            <p className="text-[12px] text-muted mt-1.5">Preview: {photoFile.name} — will be saved on Update</p>
                        )}
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>First Name</label>
                            <input type="text" className={inputCls} value={form.first_name}
                                   onChange={e => handleField('first_name', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Last Name</label>
                            <input type="text" className={inputCls} value={form.last_name}
                                   onChange={e => handleField('last_name', e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>Email Address</label>
                            <input type="email" className={inputCls} value={form.email}
                                   onChange={e => handleField('email', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Contact Number</label>
                            <input type="text" className={inputCls} value={form.contact}
                                   onChange={e => handleField('contact', e.target.value)} placeholder="+62..." />
                        </div>
                        <div>
                            <label className={labelCls}>Position</label>
                            <input type="text" className={inputCls} value={form.position}
                                   onChange={e => handleField('position', e.target.value)} placeholder="e.g. Designer" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border flex-wrap">
                        <button type="submit" disabled={busy}
                                className="px-[18px] py-2.5 rounded-lg text-[13px] font-semibold text-white bg-pink-dark border-none cursor-pointer transition-all hover:bg-pink hover:-translate-y-px disabled:opacity-70">
                            {busy ? 'Saving…' : 'Update Info'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

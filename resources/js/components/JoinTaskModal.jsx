import { useState } from 'react';
import { router } from '@inertiajs/react';
import { UsersRound, X, AlertCircle, Check } from 'lucide-react';

/**
 * Modal for a user to join a collab task using a 6-character referral code.
 */
export default function JoinTaskModal({ onClose }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = code.toLowerCase().trim();
        if (trimmed.length !== 6) {
            setError('Please enter a valid 6-character code.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        router.post('/collab/join', { code: trimmed }, {
            onSuccess: () => {
                setSuccess('Join request sent! Waiting for the task author to accept.');
                setLoading(false);
                setTimeout(onClose, 1800);
            },
            onError: (errors) => {
                setError(errors.code || 'Something went wrong. Please try again.');
                setLoading(false);
            },
        });
    };

    const inputCls = 'w-full border-[1.5px] border-border rounded-lg !px-3 !py-2 text-sm text-ink bg-surface font-sans outline-none transition-colors focus:border-pink-dark tracking-[0.4em] text-center text-xl font-bold';

    return (
        <form onSubmit={handleSubmit} className="flex flex-col !p-6 gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-[18px] font-bold text-ink m-0">Join a Collab Task</h2>
                    <p className="text-[13px] text-muted mt-1 m-0">
                        Enter the 6-character referral code shared by the task author.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink hover:bg-fore leading-none border-none bg-transparent cursor-pointer rounded-lg transition-colors shrink-0"
                ><X size={20} className="opacity-80" /></button>
            </div>

            {/* Icon */}
            <div className="flex justify-center py-2">
                <div className="w-16 h-16 rounded-2xl bg-pink-dark/10 border border-pink-dark/20 flex items-center justify-center shadow-sm">
                    <UsersRound size={32} className="text-pink-dark" />
                </div>
            </div>

            {/* Code input */}
            <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-ink">Referral Code</label>
                <input
                    type="text"
                    className={inputCls}
                    placeholder="a1b2c3"
                    value={code}
                    maxLength={6}
                    onChange={(e) => {
                        setCode(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                        setError('');
                        setSuccess('');
                    }}
                    autoFocus
                    spellCheck={false}
                />
                <p className="text-[11px] text-muted text-center">Lowercase letters and numbers only</p>
            </div>

            {/* Feedback */}
            {error && (
                <div className="flex items-center gap-2 bg-error-bg border border-error-border text-error-text text-[12px] font-medium rounded-lg !px-3 !py-2.5">
                    <AlertCircle size={14} strokeWidth={2.5} className="shrink-0" />
                    {error}
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 bg-ok-bg border border-ok-border text-ok-text text-[12px] font-medium rounded-lg !px-3 !py-2.5">
                    <Check size={14} strokeWidth={2.5} className="shrink-0" />
                    {success}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex flex-row justify-center items-center gap-2 h-9 !px-5 rounded-lg text-sm font-semibold
                               border border-border text-ink bg-fore hover:bg-border transition-all cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="flex flex-row justify-center items-center gap-2 h-9 !px-5 bg-pink-dark text-white rounded-xl text-sm font-semibold
                               cursor-pointer transition-all hover:bg-pink-dark/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Sending…' : 'Join Task'}
                </button>
            </div>
        </form>
    );
}

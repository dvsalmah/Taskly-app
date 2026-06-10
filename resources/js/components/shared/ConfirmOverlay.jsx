import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * ConfirmOverlay
 * @param {React.ElementType} icon       
 * @param {string}  iconColor             
 * @param {string}  title                 
 * @param {React.ReactNode} message       
 * @param {string}  [cancelLabel]        
 * @param {string}  confirmLabel          
 * @param {'danger'|'primary'} [confirmVariant] 
 * @param {function} onCancel
 * @param {function} onConfirm
 */
export default function ConfirmOverlay({
    icon: Icon,
    iconColor = 'text-[#dc2626]',
    title,
    message,
    cancelLabel = 'Cancel',
    confirmLabel,
    confirmVariant = 'danger',
    onCancel,
    onConfirm,
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || typeof document === 'undefined') return null;

    const confirmClass = confirmVariant === 'danger'
        ? 'flex-1 h-8 bg-red-500 text-white rounded-xl text-sm font-semibold cursor-pointer transition-all hover:-translate-y-px'
        : 'flex-1 h-8 bg-pink-dark text-white rounded-xl text-sm font-semibold cursor-pointer transition-all hover:-translate-y-px';

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        >
            <div
                className="bg-surface rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center gap-4 h-54 w-80 md:w-100 overflow-hidden"
                style={{ animation: 'overlayFadeIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
                onClick={(e) => e.stopPropagation()}
            >
                {Icon && (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center">
                        <Icon size={28} className={iconColor} />
                    </div>
                )}

                <div className="text-center">
                    <p className="text-md font-bold text-ink mb-1">{title}</p>
                    <p className="text-sm text-muted leading-relaxed">{message}</p>
                </div>

                <div className="flex items-center w-60 gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-8 rounded-xl text-sm font-semibold border border-gray-200 text-ink bg-fore hover:bg-border hover:-translate-y-px transition-all cursor-pointer"
                    >
                        {cancelLabel}
                    </button>
                    <button onClick={onConfirm} className={confirmClass}>
                        {confirmLabel}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes overlayFadeIn {
                    from { opacity: 0; transform: scale(0.88) translateY(10px); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>,
        document.body
    );
}

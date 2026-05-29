import { useEffect } from 'react';

/**
 * Generic modal overlay.
 * @param {boolean} open      - controls visibility
 * @param {function} onClose  - called when overlay or ✕ is clicked
 * @param {string} maxWidth   - Tailwind max-width class (default "max-w-[520px]")
 */
export default function Modal({ open, onClose, children, maxWidth = 'max-w-[520px]' }) {
    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    // ESC key to close
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape' && open) onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-5 modal-overlay"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className={`bg-surface rounded-2xl p-7 w-full ${maxWidth} shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                            max-h-[90vh] overflow-y-auto modal-body`}
                style={{ animation: 'overlayFadeIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

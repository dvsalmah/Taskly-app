import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function DeleteConfirmOverlay({ onCancel, onConfirm, itemName, isCategory = false }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        >
            <div
                className="bg-surface rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center gap-4 h-54 w-100 overflow-hidden p-6 text-center"
                style={{ animation: 'overlayFadeIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#FFEBEE]">
                    <img src="/assets/trash.svg" alt="delete" className="w-6 h-6" style={{ filter: 'invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)' }} />
                </div>

                {/* Text */}
                <div className="text-center">
                    <p className="text-md font-bold text-ink mb-1">Delete {isCategory ? 'Category' : 'Task'}?</p>
                    <p className="text-sm text-muted leading-relaxed">
                        Are you sure you want to delete <br />
                        <span className="font-semibold text-ink">"{itemName}"</span>?
                        {isCategory && <><br /><span className="text-[12px]">Tasks will keep their data.</span></>}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center w-60 gap-4 mt-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-8 rounded-xl text-sm font-semibold
                                           border border-gray-200 text-ink bg-fore
                                           hover:bg-border hover:-translate-y-px transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 h-8 bg-pink-dark text-white rounded-xl text-sm font-semibold cursor-pointer transition-all hover:-translate-y-px"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

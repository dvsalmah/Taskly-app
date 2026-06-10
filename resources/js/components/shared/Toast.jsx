/**
 * Toast    
 * @param {'success'|'error'} type
 * @param {string} msg
 * @param {function} onClose
 */
export default function Toast({ type, msg, onClose }) {
    const isSuccess = type === 'success';

    return (
        <div
            className="fixed top-6 right-6 z-[9000] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] cursor-pointer"
            style={{
                background: isSuccess ? '#f0fdf4' : '#fef2f2',
                border: `1.5px solid ${isSuccess ? '#bbf7d0' : '#fecaca'}`,
                color: isSuccess ? '#15803d' : '#dc2626',
                animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
                minWidth: '260px',
            }}
            onClick={onClose}
        >
            <div className="flex-1 text-sm !p-2 font-semibold leading-snug">{msg}</div>

            <style>{`
                @keyframes toastIn {
                    from { opacity: 0; transform: translateX(40px) scale(0.95); }
                    to   { opacity: 1; transform: translateX(0) scale(1); }
                }
            `}</style>
        </div>
    );
}

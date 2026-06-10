
/**
 * EmptyState
 * @param {React.ElementType} icon
 * @param {string} title
 * @param {string} [message]
 * @param {string} [wrapperClass]
 */
export default function EmptyState({ icon: Icon, title, message, wrapperClass = '' }) {
    return (
        <div className={`flex flex-col items-center justify-center text-center py-16 gap-3 text-muted ${wrapperClass}`}>
            {Icon && <Icon size={32} className="mb-1 opacity-40" />}
            <h3 className="text-[16px] font-semibold text-ink mb-0 m-0">{title}</h3>
            {message && <p className="text-[13px] m-0">{message}</p>}
        </div>
    );
}

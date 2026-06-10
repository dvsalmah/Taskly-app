/**
 * SecondaryButton
  * @param {string}   [type]   
 * @param {string}   [className] 
 * @param {boolean}  [disabled]
 * @param {React.ReactNode} children
 */
export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            type={type}
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-ink bg-fore hover:bg-border transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
        >
            {children}
        </button>
    );
}

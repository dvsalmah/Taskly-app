/**
 * FilterBar 
 *
 * @param {{ value: string, label: string }[]} filters 
 * @param {string} active 
 * @param {function} onChange 
 * @param {string} [className] 
 */
export default function FilterBar({ filters, active, onChange, className = '' }) {
    const chipBase = [
        '!px-4 !py-1.5 rounded-full text-xs font-semibold cursor-pointer',
        'border-[1.5px] border-border bg-white text-muted',
        'transition-all duration-200 select-none',
        'hover:border-pink-dark hover:bg-pink-dark hover:text-white',
    ].join(' ');

    const chipActive = '!border-pink-dark !bg-pink-dark !text-white';

    return (
        <div className={`flex gap-3 !py-4 flex-wrap items-center ${className}`}>
            <span className="text-sm font-semibold text-muted mr-1">Filter:</span>
            {filters.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => onChange(value)}
                    className={`${chipBase} ${active === value ? chipActive : ''}`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

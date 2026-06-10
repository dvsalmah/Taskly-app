import { STATUS_OPTIONS } from '@/constants/taskOptions';

/**
 * StatusSelect
 *
 * @param {string}   value 
 * @param {function} onChange  
 * @param {string}   [className] 
 */
export default function StatusSelect({ value, onChange, className = '' }) {
    return (
        <select
            defaultValue={value}
            onChange={onChange}
            className={`border-[1.5px] border-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold bg-white text-ink cursor-pointer outline-none focus:border-pink-dark focus:ring-1 focus:ring-pink-dark transition-all h-8 ${className}`}
        >
            {STATUS_OPTIONS.map(({ value: val, label }) => (
                <option key={val} value={val}>{label}</option>
            ))}
        </select>
    );
}

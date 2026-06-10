import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthInput({
    type = 'text',
    icon: Icon,
    className = '',
    ...props
}) {
    const [showPw, setShowPw] = useState(false);
    const isPassword = type === 'password';
    const currentType = isPassword && showPw ? 'text' : type;

    return (
        <div className="relative flex items-center">
            {Icon && (
                <div className="absolute left-4 pointer-events-none text-gray-400">
                    <Icon className="w-5 h-5 opacity-80" />
                </div>
            )}
            
            <input
                type={currentType}
                className={`w-full h-11 border-0 border-b-2 border-gray-300 rounded-xl text-sm text-ink bg-fore font-sans outline-none transition-all duration-200 focus:border-pink-dark focus:ring-0 placeholder-gray-400 ${Icon ? '!pl-12' : '!pl-4'} ${isPassword ? 'pr-[46px]' : 'pr-4'} ${className}`}
                {...props}
            />
            
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            )}
        </div>
    );
}

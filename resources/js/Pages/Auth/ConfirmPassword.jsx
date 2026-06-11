import { useEffect, useState } from 'react';

export default function ConfirmPassword({ password }) {
    const [strength, setStrength] = useState(0);

    const calculateStrength = (pwd) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^a-zA-Z0-9]/.test(pwd)) score++;
        return score;
    };

    useEffect(() => {
        setStrength(calculateStrength(password || ''));
    }, [password]);

    if (!password) return null;

    return (
        <div className="mt-1 ml-1 text-[13px] font-medium text-gray-500 leading-tight">
            Password strength: {' '}
            <span className={strength < 3 ? 'text-[#C62828]' : strength < 5 ? 'text-yellow-600' : 'text-green-600'}>
                {strength < 3 ? 'Weak' : strength < 5 ? 'Medium' : 'Strong'}
            </span>

        </div>
    );
}

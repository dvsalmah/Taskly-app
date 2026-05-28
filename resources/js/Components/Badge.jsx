const VARIANTS = {
    // Status
    completed:   'bg-completed-bg text-completed-text',
    in_progress: 'bg-progress-bg text-progress-text',
    not_started: 'bg-notstart-bg text-notstart-text',
    // Priority
    high:        'bg-high-bg text-high-text',
    medium:      'bg-medium-bg text-medium-text',
    low:         'bg-low-bg text-low-text',
    // Vital
    vital:       'bg-vital-bg text-vital-text',
};

const STATUS_LABELS = {
    completed:   'Completed',
    in_progress: 'In Progress',
    not_started: 'Not Started',
};
const PRIORITY_LABELS = {
    high:   'High',
    medium: 'Medium',
    low:    'Low',
};

export default function Badge({ variant, label, className = '', children }) {
    const classes = VARIANTS[variant] || 'bg-notstart-bg text-notstart-text';
    const text = label
        || STATUS_LABELS[variant]
        || PRIORITY_LABELS[variant]
        || (variant === 'vital' ? 'Vital' : variant);

    return (
        <span className={`inline-flex items-center gap-1 px-2! py-0! rounded-full
                          text-[10px] font-semibold whitespace-nowrap ${classes} ${className}`}>
            {children || text}
        </span>
    );
}

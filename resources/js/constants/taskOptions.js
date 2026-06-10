//task status options
export const STATUS_OPTIONS = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed',   label: 'Completed' },
];

//task priority
export const PRIORITY_OPTIONS = [
    { value: 'low',    label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high',   label: 'High' },
];

//status border
export const STATUS_BORDER_CLASSES = {
    completed:   '!border-b-[#2ecc71]',
    vital:       '!border-b-[#ef4444]',
    in_progress: '!border-b-[#3b82f6]',
    not_started: '!border-b-[#8c8b8b]',
};
export const STATUS_BORDER_LEFT_CLASSES = {
    completed: 'border-l-[#2ecc71]',
    vital:     'border-l-[#FF6F00]',
    default:   'border-l-[#f48b95]',
};

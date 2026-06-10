import { useState, useEffect } from 'react';
import { Flame, Calendar, UsersRound } from 'lucide-react';
import Badge from '@/components/Badge';
import CategoryLabel from '@/components/shared/CategoryLabel';
import { deadlineLabel, timeAgoJS } from '@/lib/dateUtils';
import { STATUS_BORDER_CLASSES } from '@/constants/taskOptions';

/**
 * TaskCard 
 * @param {{ task: object, onClick: function }} props
 */
export default function TaskCard({ task, onClick }) {
    const [dlLabel, setDlLabel] = useState(() => deadlineLabel(task.deadline));

    useEffect(() => {
        if (!task.deadline) return;
        const id = setInterval(() => setDlLabel(deadlineLabel(task.deadline)), 60000);
        return () => clearInterval(id);
    }, [task.deadline]);

    let colorKey = 'not_started';
    if (task.status?.toLowerCase() === 'completed') {
        colorKey = 'completed';
    } else if (task.is_vital) {
        colorKey = 'vital';
    } else if (task.status?.toLowerCase() === 'in_progress') {
        colorKey = 'in_progress';
    }
    const borderClass = STATUS_BORDER_CLASSES[colorKey] ?? STATUS_BORDER_CLASSES.not_started;

    return (
        <div
            onClick={onClick}
            className={`relative !bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] !p-5 flex flex-col gap-2.5 cursor-pointer transition-all duration-200 border-b-4 hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 w-full ${borderClass}`}
        >
            {/* Badges — top right */}
            <div className="absolute top-4 right-4 flex gap-1 flex-wrap justify-end items-center max-w-[55%]">
                {task.is_vital && <Badge variant="vital"><Flame size={12} /> Vital</Badge>}
                <Badge variant={task.priority} />
            </div>

            {/* Title + collab icon */}
            <div className="flex flex-col gap-1 pr-[60%] sm:pr-[50%]">
                <div className="flex items-center gap-1.5">
                    <h4 className={`text-[15px] font-bold text-ink leading-snug line-clamp-2 m-0 ${task.status?.toLowerCase() === 'completed' ? 'line-through opacity-50' : ''}`}>
                        {task.title}
                    </h4>
                    {task.is_collab && (
                        <UsersRound size={16} className="shrink-0 opacity-50" title="Collab task" />
                    )}
                </div>
                {task.description && (
                    <p className="text-[13px] text-muted line-clamp-1 leading-relaxed">{task.description}</p>
                )}
            </div>

            {/* Status + category */}
            <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={task.status} />
                <CategoryLabel category={task.category} />
            </div>

            {/* Deadline + timestamp */}
            <div className="flex items-center justify-between mt-auto pt-1">
                {task.deadline ? (
                    <span className={`text-[10px] font-bold px-1.5! py-0.5! rounded-md flex items-center gap-1.5 ${dlLabel.includes('Overdue') ? 'bg-[#FFEBEE] text-[#C62828]' : 'bg-[#fff0e6] text-[#FF6F00]'}`}>
                        <Calendar size={12} strokeWidth={2} className="shrink-0" />
                        {dlLabel}
                    </span>
                ) : <span />}
                <span className="text-[11px] text-muted font-medium ml-auto">
                    {task.updated_at ? `edited ${timeAgoJS(task.updated_at)}` : timeAgoJS(task.created_at)}
                </span>
            </div>
        </div>
    );
}

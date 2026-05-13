import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge from '@/Components/Badge';

function deadlineLabel(dl) {
    if (!dl) return '';
    const diff = new Date(dl.replace(' ', 'T')) - Date.now();
    if (diff < -86400000) return 'Overdue';
    if (diff < 0)         return 'Due today (overdue)';
    if (diff < 3600000)   return `Due in ${Math.ceil(diff / 60000)} min`;
    if (diff < 86400000)  return `Due in ${Math.ceil(diff / 3600000)} hr`;
    if (diff < 172800000) return 'Due tomorrow';
    const d = new Date(dl.replace(' ', 'T'));
    return `Due ${d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})} ${d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}`;
}

function timeAgoJS(s) {
    if (!s) return '';
    const diff = Math.floor((Date.now() - new Date(s.replace(' ','T'))) / 1000);
    if (diff < 60)     return 'just now';
    if (diff < 3600)   return `${Math.floor(diff/60)} min ago`;
    if (diff < 86400)  return `${Math.floor(diff/3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff/86400)} days ago`;
    return new Date(s.replace(' ','T')).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
}

function VitalCard({ task }) {
    const [dlLabel, setDlLabel] = useState(() => deadlineLabel(task.deadline));
    useEffect(() => {
        if (!task.deadline) return;
        const id = setInterval(() => setDlLabel(deadlineLabel(task.deadline)), 60000);
        return () => clearInterval(id);
    }, [task.deadline]);

    const handleStatus = (e) => {
        router.patch(route('task.status', task.id), { status: e.target.value }, { preserveScroll: true });
    };

    return (
        <div className="bg-surface rounded-[10px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.07)]
                        flex items-start gap-4 border-l-4 border-l-vital-text">
            <div className="flex-1 flex flex-col gap-1.5">
                <div className="text-[15px] font-semibold text-ink">{task.title}</div>
                {task.description && (
                    <div className="text-[12px] text-muted line-clamp-2">{task.description}</div>
                )}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant={task.status} />
                    <Badge variant={task.priority} />
                    {task.category && (
                        <span className="text-[11px] font-medium" style={{ color: task.category.color }}>
                            ● {task.category.name}
                        </span>
                    )}
                </div>
                {task.deadline && (
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] font-semibold bg-vital-bg text-vital-text px-2 py-0.5 rounded-xl">
                            🗓 {dlLabel}
                        </span>
                        <span className="text-[11px] text-muted">
                            {task.updated_at ? `edited ${timeAgoJS(task.updated_at)}` : timeAgoJS(task.created_at)}
                        </span>
                    </div>
                )}
            </div>

            {/* Status select + Edit link */}
            <div className="flex flex-col gap-2 flex-shrink-0">
                <select defaultValue={task.status} onChange={handleStatus}
                        className="border-[1.5px] border-border rounded-lg px-2 py-1.5 text-[12px] font-sans bg-surface text-ink cursor-pointer outline-none focus:border-pink-dark h-8">
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <Link href={route('my-task')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold
                                 text-muted border border-border no-underline hover:bg-fore hover:text-ink transition-colors">
                    <img src="/assets/edit.svg" alt="" className="w-4 h-4" /> Edit
                </Link>
            </div>
        </div>
    );
}

export default function VitalTask({ vitalTasks }) {
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered = vitalTasks.filter(t =>
        activeFilter === 'all' || t.status === activeFilter
    );

    const chipBase   = 'px-3.5 py-1.5 rounded-[20px] text-[12px] font-semibold cursor-pointer border-[1.5px] border-border bg-surface text-muted transition-all duration-200 select-none hover:border-pink-dark hover:bg-pink-dark hover:text-white';
    const chipActive = 'border-pink-dark bg-pink-dark text-white';

    return (
        <AuthenticatedLayout>
            <Head title="Vital Task" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-[22px] font-bold text-ink">Vital Task</h1>
                    <p className="text-[13px] text-muted mt-0.5">
                        {vitalTasks.length} vital task{vitalTasks.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link href={route('my-task')}
                      className="inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-lg text-[13px] font-semibold
                                 text-muted border border-border no-underline hover:bg-fore hover:text-ink transition-colors">
                    <img src="/assets/left.svg" alt="" className="w-4 h-4" /> Back to My Task
                </Link>
            </div>

            {/* Info banner */}
            <div className="rounded-[10px] p-4 mb-5 flex items-center gap-3 text-white text-[16px]"
                 style={{ background: 'linear-gradient(135deg,#FF6F00,#FF8F00)' }}>
                <div>
                    <strong>High-priority tasks with upcoming deadlines.</strong><br />
                    <span className="text-[13px] opacity-90">
                        Tasks are automatically shown here when they have <strong>High</strong> priority and a deadline within the next 48 hours.
                    </span>
                </div>
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 mb-6 flex-wrap items-center">
                <span className="text-[13px] text-muted font-medium mr-1">Filter:</span>
                {[['all','All'],['not_started','Not Started'],['in_progress','In Progress'],['completed','Completed']].map(([val, lbl]) => (
                    <button key={val} onClick={() => setActiveFilter(val)}
                            className={`${chipBase} ${activeFilter === val ? chipActive : ''}`}>{lbl}</button>
                ))}
            </div>

            {/* Task list */}
            <div className="flex flex-col gap-3">
                {vitalTasks.length === 0 && (
                    <div className="text-center py-16 text-muted">
                        <h3 className="text-[16px] font-semibold text-ink mb-1.5">No vital tasks right now</h3>
                        <p className="text-[13px]">Tasks with <strong>High</strong> priority and a deadline within 48 hours will appear here automatically.</p>
                    </div>
                )}
                {vitalTasks.length > 0 && filtered.length === 0 && (
                    <div className="text-center py-16 text-muted">
                        <img src="/assets/search.svg" alt="" className="w-16 h-16 mx-auto mb-4 opacity-40" />
                        <h3 className="text-[16px] font-semibold text-ink mb-1.5">No tasks match this filter</h3>
                    </div>
                )}
                {filtered.map(task => <VitalCard key={task.id} task={task} />)}
            </div>
        </AuthenticatedLayout>
    );
}

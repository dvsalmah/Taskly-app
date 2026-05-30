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
        router.patch(`/my-task/${task.id}/status`, { status: e.target.value }, { preserveScroll: true });
    };

    return (
        <div className="!bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] !p-4 lg:!p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-[#FF6F00] w-full">
            
            {/* Bagian Kiri: Teks & Barisan Badge */}
            <div className="flex-1 flex flex-col gap-1 min-w-0 w-full">
                
                <div className="flex items-center gap-1.5">
                    <h4 className="text-[15px] font-bold text-ink truncate m-0">{task.title}</h4>
                    {task.is_collab && (
                        <img
                            src="/assets/group.svg"
                            alt="collab"
                            title="Collab task"
                            className="w-4 h-4 shrink-0 opacity-50"
                        />
                    )}
                </div>
                
                {task.description && (
                    <p className="text-[13px] text-muted line-clamp-1 m-0 mb-0.5">{task.description}</p>
                )}
                
                {/* Baris 1: Badge Status & Priority */}
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <Badge variant={task.status} />
                    <Badge variant={task.priority} />
                    {task.category && (
                        <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: task.category.color }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.category.color }}></span>
                            {task.category.name}
                        </span>
                    )}
                </div>
                
                {/* Baris 2: Deadline (Tanpa Garis Pemisah & Makin Rapat) */}
                {task.deadline && (
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] font-bold bg-[#fff0e6] text-[#FF6F00] px-2 py-0.5 rounded flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            {dlLabel}
                        </span>
                        <span className="text-[11px] text-muted font-medium">
                            {task.updated_at ? `edited ${timeAgoJS(task.updated_at)}` : timeAgoJS(task.created_at)}
                        </span>
                    </div>
                )}
            </div>

            {/* Bagian Kanan: Tombol Sejajar Horizontal (Side-by-side) */}
            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50">
                <select defaultValue={task.status} onChange={handleStatus}
                        className="w-full sm:w-[130px] border-[1.5px] border-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold bg-white text-ink cursor-pointer outline-none focus:border-pink-dark focus:ring-1 focus:ring-pink-dark transition-all h-8">
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
        </div>
    );
}

export default function VitalTask({ vitalTasks }) {
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered = vitalTasks.filter(t =>
        activeFilter === 'all' || t.status === activeFilter
    );

    const chipBase   = '!px-4 !py-1.5 rounded-full text-xs font-semibold cursor-pointer border-[1.5px] border-border bg-white text-muted transition-all duration-200 select-none hover:border-pink-dark hover:bg-pink-dark hover:text-white';
    const chipActive = '!border-pink-dark !bg-pink-dark !text-white';

    return (
        <AuthenticatedLayout>
            <Head title="Vital Task" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-ink">Vital Task</h1>
                    <p className="text-[13px] text-muted mt-1 m-0">
                        {vitalTasks.length} vital task{vitalTasks.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link href="/my-task"
                      className="inline-flex items-center gap-1.5 !px-4.5 !py-1.5 rounded-lg text-sm font-semibold
                                 text-muted hover:text-ink w-max group">
                    <img src="/assets/left.svg" alt="" className="w-4 h-4 opacity-50 group-hover:opacity-100" /> Back to My Task
                </Link>
            </div>

            {/* Info banner */}
            <div className="rounded-lg !p-2 flex items-center gap-3 text-white text-[16px] bg-gradient-to-br from-[#FF6F00] to-[#FF8F00] shadow-sm">
                <div>
                    <strong className="block text-[15px] mb-0.5">High-priority tasks with upcoming deadlines.</strong>
                    <span className="text-[13px] opacity-90 block">
                        Tasks are automatically shown here when they have <strong className="font-bold">High</strong> priority and a deadline within the next 48 hours.
                    </span>
                </div>
            </div>

            {/* Filter chips */}
            <div className="flex gap-3 !py-4 flex-wrap items-center">
                <span className="text-sm font-semibold text-muted mr-1">Filter:</span>
                {[['all','All'],['not_started','Not Started'],['in_progress','In Progress'],['completed','Completed']].map(([val, lbl]) => (
                    <button key={val} onClick={() => setActiveFilter(val)}
                            className={`${chipBase} ${activeFilter === val ? chipActive : ''}`}>{lbl}</button>
                ))}
            </div>

            {/* Task list */}
            <div className="flex flex-col gap-4 w-full">
                {vitalTasks.length === 0 && (
                    <div className="text-center py-16 text-muted">
                        <h3 className="text-[16px] font-semibold text-ink mb-1.5 m-0">No vital tasks right now</h3>
                        <p className="text-[13px] m-0">Tasks with <strong>High</strong> priority and a deadline within 48 hours will appear here automatically.</p>
                    </div>
                )}
                {vitalTasks.length > 0 && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center !py-16 gap-3 text-muted">
                        <img src="/assets/seacrh.svg" alt="" className="w-8 h-8  mb-4 opacity-40" />
                        <span className="text-md font-semibold text-ink mb-1.5 m-0">No tasks match this filter</span>
                    </div>
                )}
                
                <div className="flex flex-col gap-4 w-full">
                    {filtered.map(task => <VitalCard key={task.id} task={task} />)}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
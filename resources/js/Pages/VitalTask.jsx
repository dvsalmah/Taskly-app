import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge from '@/components/Badge';
import FilterBar from '@/components/shared/FilterBar';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import CategoryLabel from '@/components/shared/CategoryLabel';
import StatusSelect from '@/components/shared/StatusSelect';
import { UsersRound, MoveLeft, Search, Calendar } from 'lucide-react';
import { deadlineLabel, timeAgoJS } from '@/lib/dateUtils';

const STATUS_FILTERS = [
    { value: 'all',         label: 'All' },
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed',   label: 'Completed' },
];

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
            {/* Left: text & badges */}
            <div className="flex-1 flex flex-col gap-1 min-w-0 w-full">
                <div className="flex items-center gap-1.5">
                    <h4 className="text-[15px] font-bold text-ink truncate m-0">{task.title}</h4>
                    {task.is_collab && (
                        <UsersRound size={16} className="shrink-0 opacity-50" title="Collab task" />
                    )}
                </div>

                {task.description && (
                    <p className="text-[13px] text-muted line-clamp-1 m-0 mb-0.5">{task.description}</p>
                )}

                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <Badge variant={task.status} />
                    <Badge variant={task.priority} />
                    <CategoryLabel category={task.category} />
                </div>

                {task.deadline && (
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] font-bold bg-[#fff0e6] text-[#FF6F00] px-2 py-0.5 rounded flex items-center gap-1.5">
                            <Calendar size={12} strokeWidth={2} className="shrink-0" />
                            {dlLabel}
                        </span>
                        <span className="text-[11px] text-muted font-medium">
                            {task.updated_at ? `edited ${timeAgoJS(task.updated_at)}` : timeAgoJS(task.created_at)}
                        </span>
                    </div>
                )}
            </div>

            {/* Right: status select */}
            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50">
                <StatusSelect value={task.status} onChange={handleStatus} className="w-full sm:w-[130px]" />
            </div>
        </div>
    );
}

export default function VitalTask({ vitalTasks }) {
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered = vitalTasks.filter(t =>
        activeFilter === 'all' || t.status === activeFilter
    );

    return (
        <AuthenticatedLayout>
            <Head title="Vital Task" />

            <PageHeader
                title="Vital Task"
                subtitle={`${vitalTasks.length} vital task${vitalTasks.length !== 1 ? 's' : ''}`}
                actions={
                    <Link
                        href="/my-task"
                        className="inline-flex items-center gap-1.5 !px-4.5 !py-1.5 rounded-lg text-sm font-semibold text-muted hover:text-ink w-max group"
                    >
                        <MoveLeft size={16} className="opacity-50 group-hover:opacity-100" /> Back to My Task
                    </Link>
                }
            />

            {/* Info banner */}
            <div className="rounded-lg !p-2 flex items-center gap-3 text-white text-[16px] bg-gradient-to-br from-[#FF6F00] to-[#FF8F00] shadow-sm">
                <div>
                    <strong className="block text-[15px] mb-0.5">High-priority tasks with upcoming deadlines.</strong>
                    <span className="text-[13px] opacity-90 block">
                        Tasks are automatically shown here when they have <strong className="font-bold">High</strong> priority and a deadline within the next 48 hours.
                    </span>
                </div>
            </div>

            <FilterBar
                filters={STATUS_FILTERS}
                active={activeFilter}
                onChange={setActiveFilter}
            />

            {/* Task list */}
            <div className="flex flex-col gap-4 w-full">
                {vitalTasks.length === 0 && (
                    <EmptyState
                        title="No vital tasks right now"
                        message="Tasks with High priority and a deadline within 48 hours will appear here automatically."
                    />
                )}
                {vitalTasks.length > 0 && filtered.length === 0 && (
                    <EmptyState icon={Search} title="No tasks match this filter" />
                )}
                <div className="flex flex-col gap-4 w-full">
                    {filtered.map(task => <VitalCard key={task.id} task={task} />)}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge from '@/Components/Badge';
import { usePage } from '@inertiajs/react';

/* ── Helpers ─────────────────────────────────────────────── */
function timeAgoJS(datetimeStr) {
    if (!datetimeStr) return '';
    const then = new Date(datetimeStr.replace(' ', 'T'));
    const diff = Math.floor((Date.now() - then.getTime()) / 1000);
    if (diff < 60)     return 'just now';
    if (diff < 3600)   return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400)  return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return then.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

/* ── Stat Circle ─────────────────────────────────────────── */
function StatCircle({ pct, count, label, color }) {
    const bg = { green: 'bg-[#2ecc71]', blue: 'bg-[#3498db]', gray: 'bg-[#95a5a6]' }[color];
    return (
        <div className="text-center">
            <div className={`w-20 h-20 rounded-full ${bg} flex flex-col items-center justify-center
                            text-white font-bold text-[16px] mx-auto mb-1.5 leading-tight`}>
                {pct}%
                <small className="text-[10px] font-medium block">{count} tasks</small>
            </div>
            <div className="text-[11px] text-muted font-medium">{label}</div>
        </div>
    );
}

/* ── Task Row (todo / done cards) ────────────────────────── */
function TaskRow({ task }) {
    const borderColor = task.is_vital ? '#FF6F00'
        : task.category?.color ?? '#f48b95';
    return (
        <div className="p-3 rounded-lg border-l-4 bg-fore/60 mb-2 last:mb-0"
             style={{ borderLeftColor: borderColor }}>
            <h4 className="text-[14px] font-semibold text-ink flex items-center gap-1.5 mb-0.5">
                {task.is_vital && <img src="/assets/fire.svg" alt="vital" className="w-4 h-4" />}
                {task.title}
            </h4>
            {task.description && (
                <p className="text-[12px] text-muted line-clamp-2 mb-1">{task.description}</p>
            )}
            <small className="text-[11px] text-muted">
                <Badge variant={task.status} className="mr-1" />
                {task.category && ` · ${task.category.name}`}
                {' · '}{timeAgoJS(task.created_at)}
            </small>
        </div>
    );
}

/* ── Dashboard Page ──────────────────────────────────────── */
export default function Dashboard({ stats, todoTasks, totalTodo, doneTasks }) {
    const { auth } = usePage().props;
    const firstName = auth?.user?.first_name ?? 'User';

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <h1 className="text-[22px] font-bold text-ink mb-6">
                Welcome back, {firstName}!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* ── To-Do Card ─────────────────────────────── */}
                <div className="bg-surface rounded-[10px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
                    <h3 className="text-[15px] font-bold text-ink mb-4">
                        To-Do
                        <span className="text-[12px] font-normal text-muted ml-2">{totalTodo} pending</span>
                    </h3>
                    {todoTasks.length === 0 ? (
                        <div className="text-center py-7 text-muted text-[13px]">
                            Congratulations! All tasks done!{' '}
                            <Link href={route('my-task')} className="text-pink-dark font-semibold no-underline hover:underline">
                                Add more
                            </Link>
                        </div>
                    ) : (
                        <>
                            {todoTasks.map(t => <TaskRow key={t.id} task={t} />)}
                            {totalTodo > 5 && (
                                <p className="text-center mt-3 text-[12px] text-muted">
                                    <Link href={route('my-task')} className="text-pink-dark no-underline hover:underline">
                                        View all tasks →
                                    </Link>
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* ── Task Status Card ───────────────────────── */}
                <div className="bg-surface rounded-[10px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
                    <h3 className="text-[15px] font-bold text-ink mb-4">Task Status</h3>
                    {stats.total === 0 ? (
                        <div className="text-center py-7 text-muted text-[13px]">
                            No tasks yet.{' '}
                            <Link href={route('my-task')} className="text-pink-dark font-semibold no-underline hover:underline">
                                Add one!
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-around flex-wrap gap-3 mt-4">
                                <StatCircle pct={stats.pctCompleted} count={stats.completed} label="Completed" color="green" />
                                <StatCircle pct={stats.pctProgress}  count={stats.inProgress} label="In Progress" color="blue" />
                                <StatCircle pct={stats.pctNotStart}  count={stats.notStarted} label="Not Started" color="gray" />
                            </div>
                            <p className="text-center text-[12px] text-muted mt-3">
                                {stats.total} total task{stats.total !== 1 ? 's' : ''}
                            </p>
                        </>
                    )}
                </div>

                {/* ── Recently Completed (full width) ────────── */}
                <div className="md:col-span-2 bg-surface rounded-[10px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
                    <h3 className="text-[15px] font-bold text-ink mb-4">Recently Completed</h3>
                    {doneTasks.length === 0 ? (
                        <div className="text-center py-7 text-muted text-[13px]">No completed tasks yet. Keep going!</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {doneTasks.map(t => (
                                <div key={t.id} className="bg-fore/60 rounded-lg p-3">
                                    <h4 className="text-[13px] font-semibold text-ink mb-0.5 line-clamp-1">{t.title}</h4>
                                    {t.description && <p className="text-[12px] text-muted line-clamp-2 mb-1">{t.description}</p>}
                                    <small className="text-[11px] text-muted">
                                        Status: Completed
                                        {t.category && ` · ${t.category.name}`}
                                        {' · '}{timeAgoJS(t.created_at)}
                                    </small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

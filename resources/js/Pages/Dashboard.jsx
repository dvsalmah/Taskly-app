import { Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge from '@/Components/Badge';

function timeAgoJS(datetimeStr) {
    if (!datetimeStr) return '';
    const then = new Date(datetimeStr.replace(' ', 'T'));
    const diff = Math.floor((Date.now() - then.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return then.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function StatCircle({ pct, count, label, color }) {
    const bgMap = { green: 'bg-[#2ecc71]', blue: 'bg-[#3498db]', gray: 'bg-[#95a5a6]' };
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`w-[72px] h-[72px] rounded-full ${bgMap[color]} flex flex-col items-center
                            justify-center text-white font-bold text-[15px] leading-tight`}>
                {pct}%
                <small className="text-[10px] font-medium">{count} tasks</small>
            </div>
            <span className="text-[11px] text-muted font-medium">{label}</span>
        </div>
    );
}

function TaskRow({ task }) {
    const borderColor = task.is_vital ? '#FF6F00' : (task.category?.color ?? '#f48b95');
    return (
        <div className="rounded-lg border-l-4 bg-fore/70 mb-2 mr-4 pl-4 pt-1 "
            style={{ borderLeftColor: borderColor }}>
            <h4 className="text-[13px] font-semibold text-ink flex items-center gap-1.5 mb-0.5">
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

function Card({ className = '', children }) {
    return (
        <div className={`bg-white rounded-2xl pl-6 mr-4 mt-4 gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] ${className}`}>
            {children}
        </div>
    );
}

export default function Dashboard({ stats, todoTasks, totalTodo, doneTasks }) {
    const { auth } = usePage().props;
    const firstName = auth?.user?.first_name ?? 'User';

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <h1 className="text-[22px] font-bold text-ink mb-6 mt-2">
                Welcome back, {firstName}!
            </h1>

            <div className="flex gap-6 items-start w-full pr-6">
                <div className="w-[63%] flex flex-col gap-6">
                    
                    {/* [1] To-Do Card */}
                    <Card>
                        <h3 className="text-[14px] font-bold text-ink mt-4 mb-4 flex items-center gap-2">
                            To-Do
                            <span className="text-[12px] font-normal text-muted ">{totalTodo} pending</span>
                        </h3>
                        {todoTasks.length === 0 ? (
                            <div className="text-center py-8 text-muted text-[13px]">
                                Congratulations! You have completed all your tasks!{' '}
                                <Link href="/my-task"
                                    className="text-pink-dark font-semibold no-underline hover:underline">
                                    Add more
                                </Link>
                            </div>
                        ) : (
                            <>
                                {todoTasks.map(t => <TaskRow key={t.id} task={t} />)}
                                {totalTodo > 5 && (
                                    <p className="text-center pl-4 mt-3 text-[12px]">
                                        <Link href="/my-task"
                                            className="text-pink-dark no-underline hover:underline">
                                            View all tasks
                                        </Link>
                                    </p>
                                )}
                            </>
                        )}
                    </Card>

                    {/* [2] Recently Completed Card */}
                    <Card>
                        <h3 className="text-[14px] font-bold text-ink mt-4 mb-4">Recently Completed</h3>
                        {doneTasks.length === 0 ? (
                            <div className="text-center py-8 text-muted text-[13px]">
                                No completed tasks yet. Keep going!
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {doneTasks.map(t => (
                                    <div key={t.id} className="rounded-lg border-l-4 bg-fore/70 mb-2 mr-4 pl-4 pt-2 ">
                                        <h4 className="text-[13px] font-semibold text-ink mb-0.5 line-clamp-1">
                                            {t.title}
                                        </h4>
                                        {t.description && (
                                            <p className="text-[12px] text-muted line-clamp-2 mb-1">
                                                {t.description}
                                            </p>
                                        )}
                                        <small className="text-[11px] text-muted">
                                            Completed
                                            {t.category && ` · ${t.category.name}`}
                                            {' · '}{timeAgoJS(t.created_at)}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                </div>

                {/* ================= KOLOM KANAN (~37%) ================= */}
                <div className="w-[37%]">
                    
                    {/* [3] Task Status Card */}
                    <Card>
                        <h3 className="text-[14px] font-bold text-ink pt-2">Task Status</h3>
                        {stats.total === 0 ? (
                            <div className="text-center py-8 text-muted text-[13px]">
                                No tasks yet.{' '}
                                <Link href="/my-task"
                                    className="text-pink-dark font-semibold no-underline hover:underline">
                                    Add one!
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-around flex-wrap gap-3 mt-3">
                                    <StatCircle pct={stats.pctCompleted} count={stats.completed} label="Completed" color="green" />
                                    <StatCircle pct={stats.pctProgress} count={stats.inProgress} label="In Progress" color="blue" />
                                    <StatCircle pct={stats.pctNotStart} count={stats.notStarted} label="Not Started" color="gray" />
                                </div>
                                <p className="text-center text-[12px] text-muted mt-2">
                                    {stats.total} total task{stats.total !== 1 ? 's' : ''}
                                </p>
                            </>
                        )}
                    </Card>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
import { Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge from '@/components/Badge';
import { Flame, UsersRound } from 'lucide-react';
import { timeAgoJS } from '@/lib/dateUtils';
import { STATUS_BORDER_LEFT_CLASSES } from '@/constants/taskOptions';

function StatCircle({ pct, count, label, color }) {
    const bgMap = { green: 'bg-[#2ecc71]', blue: 'bg-[#3498db]', gray: 'bg-[#95a5a6]' };
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`w-[72px] h-[72px] rounded-full ${bgMap[color]} flex flex-col items-center justify-center text-white font-bold text-[15px] leading-tight`}>
                {pct}%
                <small className="text-[10px] font-medium">{count} tasks</small>
            </div>
            <span className="text-[11px] text-muted font-medium">{label}</span>
        </div>
    );
}

function Card({ className = '', children }) {
    return (
        <div className={`bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] !p-6 flex flex-col gap-1 ${className}`}>
            {children}
        </div>
    );
}

function TaskItem({ task }) {
    let colorKey = 'default';
    if (task.status === 'completed') {
        colorKey = 'completed';
    } else if (task.is_vital) {
        colorKey = 'vital';
    }
    const borderClass = STATUS_BORDER_LEFT_CLASSES[colorKey] ?? STATUS_BORDER_LEFT_CLASSES.default;

    return (
        <div className={`rounded-2xl border-l-4 bg-fore/70 !px-4 !py-3 !mb-3 ${borderClass}`}>
            <h4 className="text-[13px] font-semibold text-ink flex items-center gap-1.5 mb-1 line-clamp-1">
                {task.is_vital && <Flame size={16} className="text-[#FF6F00]" />}
                {task.title}
                {task.is_collab && (
                    <UsersRound size={14} className="shrink-0 opacity-50 ml-0.5" title="Collab task" />
                )}
            </h4>
            {task.description && (
                <p className="text-[12px] text-muted line-clamp-2 mb-1.5">{task.description}</p>
            )}
            <small className="text-[11px] text-muted flex items-center gap-1">
                <Badge variant={task.status} />
                {task.category && ` · ${task.category.name}`}
                {' · '}{timeAgoJS(task.created_at)}
            </small>
        </div>
    );
}

export default function Dashboard({ stats, todoTasks, totalTodo, doneTasks }) {
    const { auth } = usePage().props;
    const firstName = auth?.user?.first_name ?? 'User';

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <h1 className="text-3xl font-bold text-ink !mb-4">
                Welcome back, {firstName}!
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 w-full">

                {/* Left Column */}
                <div className="flex flex-col gap-8">
                    {/* To-Do */}
                    <Card>
                        <h3 className="text-xl font-bold text-ink flex items-center gap-2 m-0">
                            To-Do
                            <span className="text-[12px] font-normal text-muted">{totalTodo} pending</span>
                        </h3>
                        {todoTasks.length === 0 ? (
                            <div className="text-center py-8 text-muted text-[13px]">
                                Congratulations! You have completed all your tasks!{' '}
                                <Link href="/my-task" className="text-pink-dark font-semibold no-underline hover:underline">Add more</Link>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {todoTasks.map(t => <TaskItem key={t.id} task={t} />)}
                                {totalTodo > 5 && (
                                    <p className="text-center mt-2 m-0 text-sm font-semibold">
                                        <Link href="/my-task" className="text-pink-dark no-underline hover:underline">View all tasks</Link>
                                    </p>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Recently Completed */}
                    <Card>
                        <h3 className="text-xl font-bold text-ink flex items-center m-0">Recently Completed</h3>
                        {doneTasks.length === 0 ? (
                            <div className="text-center py-8 text-muted text-[13px]">No completed tasks yet. Keep going!</div>
                        ) : (
                            <div className="flex flex-col">
                                {doneTasks.map(t => <TaskItem key={t.id} task={t} />)}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-8">
                    <Card>
                        <h3 className="text-xl font-bold text-ink flex items-center !mb-3">Task Status</h3>
                        {stats.total === 0 ? (
                            <div className="text-center py-8 text-muted text-[13px]">
                                No tasks yet.{' '}
                                <Link href="/my-task" className="text-pink-dark font-semibold no-underline hover:underline">Add one!</Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-around flex-wrap gap-4 mt-2">
                                    <StatCircle pct={stats.pctCompleted} count={stats.completed} label="Completed" color="green" />
                                    <StatCircle pct={stats.pctProgress}  count={stats.inProgress} label="In Progress" color="blue" />
                                    <StatCircle pct={stats.pctNotStart}  count={stats.notStarted} label="Not Started" color="gray" />
                                </div>
                                <p className="text-center text-[12px] text-pink-dark font-semibold m-0">
                                    {stats.total} total task{stats.total !== 1 ? 's' : ''}
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
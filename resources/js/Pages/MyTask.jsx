import { useState, useEffect, useCallback } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge from '@/Components/Badge';
import Modal from '@/Components/Modal';

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

/* ── Task Card ───────────────────────────────────────────── */
function TaskCard({ task, onClick }) {
    const [dlLabel, setDlLabel] = useState(() => deadlineLabel(task.deadline));

    useEffect(() => {
        if (!task.deadline) return;
        const id = setInterval(() => setDlLabel(deadlineLabel(task.deadline)), 60000);
        return () => clearInterval(id);
    }, [task.deadline]);

    const borderColors = {
        completed:   '#2E7D32',
        in_progress: '#1565C0',
        not_started: '#E0E0E0',
    };
    const topColor = task.is_vital ? '#FF0000' : (borderColors[task.status] ?? '#E0E0E0');

    return (
        <div onClick={onClick}
             className="bg-surface rounded-[10px] p-[18px] shadow-[0_2px_12px_rgba(0,0,0,0.07)]
                        flex flex-col gap-2.5 pl-6 cursor-pointer transition-all duration-200
                        border-t-4 hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5
                        relative overflow-hidden"
             style={{ borderTopColor: topColor }}>

            {/* Badges row */}
            <div className="flex gap-1.5 flex-wrap items-center">
                {task.is_vital && <Badge variant="vital"><img src="/assets/fire.svg" alt="" className="w-3 h-3" /> Vital</Badge>}
                <Badge variant={task.priority} />
            </div>

            {/* Body */}
            <div className="flex flex-col gap-1.5">
                <div className={`text-[15px] font-semibold text-ink leading-snug line-clamp-2
                    ${task.status === 'completed' ? 'line-through text-muted' : ''}`}>
                    {task.title}
                </div>
                {task.description && (
                    <div className="text-[12px] text-muted line-clamp-2 leading-relaxed">{task.description}</div>
                )}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant={task.status} />
                    {task.category && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted"
                              style={{ color: task.category.color }}>
                            <span className="w-2 h-2 rounded-full inline-block bg-current" />
                            {task.category.name}
                        </span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-1.5 mt-0.5">
                {dlLabel && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-xl flex items-center gap-1.5
                        ${task.is_vital ? 'bg-vital-bg text-vital-text' : 'bg-notstart-bg text-muted'}`}>
                        <img src="/assets/clock.svg" alt="" className="w-3 h-3 opacity-70" />
                        {dlLabel}
                    </span>
                )}
                <span className="text-[11px] text-muted ml-auto">
                    {task.updated_at ? `edited ${timeAgoJS(task.updated_at)}` : timeAgoJS(task.created_at)}
                </span>
            </div>
        </div>
    );
}

/* ── Add/Edit Form ────────────────────────────────────────── */
function TaskForm({ task, categories, onClose, mode = 'add' }) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        title:       task?.title       ?? '',
        description: task?.description ?? '',
        category_id: task?.category_id ?? '',
        priority:    task?.priority    ?? 'medium',
        status:      task?.status      ?? 'not_started',
        deadline:    task?.deadline    ? task.deadline.replace(' ', 'T').slice(0, 16) : '',
    });

    const submit = (e) => {
        e.preventDefault();
        const payload = { ...data, deadline: data.deadline || null, category_id: data.category_id || null };
        if (mode === 'add') {
            router.post('/my-task', payload, { onSuccess: onClose });
        } else {
            router.patch(`/my-task/${task.id}`, payload, { onSuccess: onClose });
        }
    };

    const labelCls = 'block text-[13px] font-semibold text-ink mb-1.5';
    const inputCls = 'w-full border-[1.5px] border-border rounded-lg px-3.5 py-2.5 text-[14px] text-ink bg-surface font-sans outline-none transition-colors focus:border-pink-dark';

    return (
        <form onSubmit={submit}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-bold">{mode === 'add' ? 'Add New Task' : 'Edit Task'}</h2>
                <button type="button" onClick={onClose}
                        className="text-muted hover:text-ink text-[22px] leading-none border-none bg-transparent cursor-pointer px-1.5 rounded transition-colors">✕</button>
            </div>

            <div className="mb-4">
                <label className={labelCls}>Task Title *</label>
                <input type="text" className={inputCls} placeholder="Enter task title…"
                       value={data.title} onChange={e => setData('title', e.target.value)} required />
                {errors.title && <p className="text-[12px] text-error-text mt-1">{errors.title}</p>}
            </div>

            <div className="mb-4">
                <label className={labelCls}>Description</label>
                <textarea className={`${inputCls} resize-y min-h-[80px]`} placeholder="Optional description…"
                          value={data.description} onChange={e => setData('description', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3.5 mb-4">
                <div>
                    <label className={labelCls}>Priority</label>
                    <select className={inputCls} value={data.priority} onChange={e => setData('priority', e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div>
                    <label className={labelCls}>Status</label>
                    <select className={inputCls} value={data.status} onChange={e => setData('status', e.target.value)}>
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={data.category_id ?? ''} onChange={e => setData('category_id', e.target.value)}>
                    <option value="">— No category —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div className="mb-4">
                <label className={labelCls}>Deadline (optional)</label>
                <input type="datetime-local" className={inputCls}
                       value={data.deadline} onChange={e => setData('deadline', e.target.value)}
                       min={new Date().toISOString().slice(0, 16)} />
            </div>

            <div className="flex justify-end gap-2.5 mt-5 pt-4 border-t border-border">
                <button type="button" onClick={onClose}
                        className="px-[18px] py-2 rounded-lg text-[13px] font-semibold text-muted border border-border bg-transparent cursor-pointer hover:bg-fore hover:text-ink transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={processing}
                        className="px-[18px] py-2 rounded-lg text-[13px] font-semibold text-white bg-pink-dark border-none cursor-pointer transition-all hover:bg-pink hover:-translate-y-px disabled:opacity-70">
                    {processing ? 'Saving…' : (mode === 'add' ? 'Add Task' : 'Save Changes')}
                </button>
            </div>
        </form>
    );
}

/* ── Preview Modal ────────────────────────────────────────── */
function PreviewModal({ task, categories, onClose, onEdit }) {
    const [dlLabel, setDlLabel] = useState(() => deadlineLabel(task?.deadline));
    useEffect(() => {
        if (!task?.deadline) return;
        const id = setInterval(() => setDlLabel(deadlineLabel(task.deadline)), 60000);
        return () => clearInterval(id);
    }, [task?.deadline]);

    const labelCls = 'text-[11px] font-semibold uppercase text-muted tracking-wide';

    const handleStatusChange = (e) => {
        router.patch(`/my-task/${task.id}/status`, { status: e.target.value }, { preserveScroll: true });
    };

    const handleDelete = () => {
        if (confirm('Delete this task?')) {
            router.delete(`/my-task/${task.id}`, { onSuccess: onClose });
        }
    };

    if (!task) return null;

    return (
        <>
            <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                    {task.is_vital && <Badge variant="vital"><img src="/assets/fire.svg" alt="" className="w-3 h-3" /> Vital</Badge>}
                    <Badge variant={task.priority} />
                    <h2 className="text-[17px] font-bold text-ink">{task.title}</h2>
                </div>
                <button onClick={onClose} className="text-muted hover:text-ink text-[22px] leading-none border-none bg-transparent cursor-pointer px-1.5 rounded transition-colors">✕</button>
            </div>

            {task.description && (
                <div className="text-[14px] text-muted leading-relaxed bg-fore rounded-lg px-3.5 py-3 mb-4">{task.description}</div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-1">
                <div className="flex flex-col gap-1"><span className={labelCls}>Status</span><Badge variant={task.status} /></div>
                <div className="flex flex-col gap-1"><span className={labelCls}>Priority</span><Badge variant={task.priority} /></div>
                {task.category && (
                    <div className="flex flex-col gap-1">
                        <span className={labelCls}>Category</span>
                        <span className="text-[12px] font-medium" style={{ color: task.category.color }}>
                            ● {task.category.name}
                        </span>
                    </div>
                )}
                {task.deadline && (
                    <div className="flex flex-col gap-1"><span className={labelCls}>Deadline</span><span className="text-[13px]">{dlLabel}</span></div>
                )}
                <div className="flex flex-col gap-1"><span className={labelCls}>Created</span><span className="text-[13px] text-muted">{timeAgoJS(task.created_at)}</span></div>
                {task.updated_at && (
                    <div className="flex flex-col gap-1"><span className={labelCls}>Last edited</span><span className="text-[13px] text-muted">edited {timeAgoJS(task.updated_at)}</span></div>
                )}
            </div>

            {/* Status updater */}
            <div className="mt-4 flex items-center gap-2.5 flex-wrap">
                <label className="text-[13px] font-semibold text-muted">Update Status:</label>
                <select defaultValue={task.status} onChange={handleStatusChange}
                        className="border-[1.5px] border-border rounded-lg px-2 py-1.5 text-[12px] font-sans bg-surface text-ink cursor-pointer outline-none focus:border-pink-dark h-8">
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-border">
                <button onClick={handleDelete}
                        className="inline-flex items-center gap-1.5 px-[18px] py-2 rounded-lg text-[13px] font-semibold
                                   bg-[#FFEBEE] text-[#C62828] border border-[#EF9A9A] cursor-pointer
                                   hover:bg-[#C62828] hover:text-white transition-colors">
                    <img src="/assets/trash.svg" alt="" className="w-4 h-4" /> Delete
                </button>
                <button onClick={onEdit}
                        className="inline-flex items-center gap-1.5 px-[18px] py-2 rounded-lg text-[13px] font-semibold
                                   bg-transparent text-muted border border-border cursor-pointer hover:bg-fore hover:text-ink transition-colors">
                    <img src="/assets/edit.svg" alt="" className="w-4 h-4" /> Edit
                </button>
            </div>
        </>
    );
}

/* ── My Task Page ────────────────────────────────────────── */
export default function MyTask({ tasks, categories }) {
    const [activeStatus,   setActiveStatus]   = useState('all');
    const [activePriority, setActivePriority] = useState('all');
    const [searchQuery,    setSearchQuery]     = useState('');
    const [addOpen,        setAddOpen]         = useState(false);
    const [previewTask,    setPreviewTask]     = useState(null);
    const [editTask,       setEditTask]        = useState(null);

    // Listen to global search from Navbar
    useEffect(() => {
        const handler = (e) => setSearchQuery(e.detail || '');
        window.addEventListener('taskly:search', handler);
        return () => window.removeEventListener('taskly:search', handler);
    }, []);

    const filteredTasks = tasks.filter(t => {
        const statusOk   = activeStatus   === 'all' || t.status   === activeStatus;
        const priorityOk = activePriority === 'all' || t.priority === activePriority;
        const q = searchQuery.toLowerCase();
        const searchOk   = !q || t.title.toLowerCase().includes(q)
            || (t.description ?? '').toLowerCase().includes(q)
            || (t.category?.name ?? '').toLowerCase().includes(q);
        return statusOk && priorityOk && searchOk;
    });

    const chipBase  = 'px-3.5 py-1.5 rounded-[20px] text-[12px] font-semibold cursor-pointer border-[1.5px] border-border bg-surface text-muted transition-all duration-200 select-none hover:border-pink-dark hover:bg-pink-dark hover:text-white';
    const chipActive = 'border-pink-dark bg-pink-dark text-white';

    return (
        <AuthenticatedLayout>
            <Head title="My Task" />

            {/* Page header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-[22px] font-bold text-ink">My Task</h1>
                    <p className="text-[13px] text-muted mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
                </div>
                <button onClick={() => setAddOpen(true)}
                        className="inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-lg text-[13px] font-semibold
                                   bg-pink-dark text-white border-none cursor-pointer transition-all
                                   hover:bg-pink hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(134,16,67,0.3)]">
                    <img src="/assets/add.svg" alt="" className="w-4 h-4 brightness-0 invert" /> Add Task
                </button>
            </div>

            {/* Filter bar */}
            <div className="flex gap-2 mb-6 flex-wrap items-center">
                <span className="text-[13px] text-muted font-medium mr-1">Filter:</span>
                {[['all','All'],['not_started','Not Started'],['in_progress','In Progress'],['completed','Completed']].map(([val, lbl]) => (
                    <button key={val} onClick={() => setActiveStatus(val)}
                            className={`${chipBase} ${activeStatus === val ? chipActive : ''}`}>{lbl}</button>
                ))}
                <select value={activePriority} onChange={e => setActivePriority(e.target.value)}
                        className="border-[1.5px] border-border rounded-[20px] px-3.5 py-1.5 text-[12px] font-semibold font-sans bg-surface text-muted cursor-pointer outline-none transition-colors hover:border-pink-dark h-[34px]">
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

            {/* Task grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {filteredTasks.length === 0 && tasks.length === 0 && (
                    <div className="col-span-full text-center py-16 text-muted">
                        <img src="/assets/clipboard.svg" alt="" className="w-16 h-16 mx-auto mb-4 opacity-40" />
                        <h3 className="text-[16px] font-semibold text-ink mb-1.5">No tasks yet</h3>
                        <p className="text-[13px]">Click "Add Task" to create your first task.</p>
                    </div>
                )}
                {filteredTasks.length === 0 && tasks.length > 0 && (
                    <div className="col-span-full text-center py-16 text-muted">
                        <img src="/assets/search.svg" alt="" className="w-16 h-16 mx-auto mb-4 opacity-40" />
                        <h3 className="text-[16px] font-semibold text-ink mb-1.5">No tasks match this filter</h3>
                    </div>
                )}
                {filteredTasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => setPreviewTask(task)} />
                ))}
            </div>

            {/* Add Modal */}
            <Modal open={addOpen} onClose={() => setAddOpen(false)}>
                <TaskForm mode="add" categories={categories} onClose={() => setAddOpen(false)} />
            </Modal>

            {/* Edit Modal */}
            <Modal open={!!editTask} onClose={() => setEditTask(null)}>
                {editTask && (
                    <TaskForm mode="edit" task={editTask} categories={categories} onClose={() => setEditTask(null)} />
                )}
            </Modal>

            {/* Preview Modal */}
            <Modal open={!!previewTask} onClose={() => setPreviewTask(null)} maxWidth="max-w-[560px]">
                {previewTask && (
                    <PreviewModal
                        task={previewTask}
                        categories={categories}
                        onClose={() => setPreviewTask(null)}
                        onEdit={() => { setEditTask(previewTask); setPreviewTask(null); }}
                    />
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}

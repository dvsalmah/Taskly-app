import { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge from '@/Components/Badge';
import Modal from '@/Components/Modal';
import DeleteConfirmOverlay from '@/Components/DeleteConfirmOverlay';

function deadlineLabel(dl) {
    if (!dl) return '';
    const diff = new Date(dl.replace(' ', 'T')) - Date.now();
    if (diff < -86400000) return 'Overdue';
    if (diff < 0) return 'Due today (overdue)';
    if (diff < 3600000) return `Due in ${Math.ceil(diff / 60000)} min`;
    if (diff < 86400000) return `Due in ${Math.ceil(diff / 3600000)} hr`;
    if (diff < 172800000) return 'Due tomorrow';
    const d = new Date(dl.replace(' ', 'T'));
    return `Due ${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

function timeAgoJS(s) {
    if (!s) return '';
    const diff = Math.floor((Date.now() - new Date(s.replace(' ', 'T'))) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return new Date(s.replace(' ', 'T')).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function TaskCard({ task, onClick }) {
    const [dlLabel, setDlLabel] = useState(() => deadlineLabel(task.deadline));

    useEffect(() => {
        if (!task.deadline) return;
        const id = setInterval(() => setDlLabel(deadlineLabel(task.deadline)), 60000);
        return () => clearInterval(id);
    }, [task.deadline]);

    const borderClasses = {
        'completed': '!border-b-[#2ecc71]',
        'vital': '!border-b-[#ef4444]',
        'in_progress': '!border-b-[#3b82f6]',
        'not_started': '!border-b-[#8c8b8b]',
    };

    let colorKey = 'not_started';
    if (task.status?.toLowerCase() === 'completed') {
        colorKey = 'completed';
    } else if (task.is_vital) {
        colorKey = 'vital';
    } else if (task.status?.toLowerCase() === 'in_progress') {
        colorKey = 'in_progress';
    }
    const finalBorderClass = borderClasses[colorKey] || borderClasses['not_started'];

    return (
        <div onClick={onClick}
            className={`!bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] !p-5 flex flex-col gap-2.5 cursor-pointer transition-all duration-200 border-b-4 hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 w-full ${finalBorderClass}`}>

            <div className="flex gap-1.5 flex-wrap items-center">
                {task.is_vital && <Badge variant="vital"><img src="/assets/fire.svg" alt="vital" className="w-3 h-3" /> Vital</Badge>}
                <Badge variant={task.priority} />
            </div>

            <div className="flex flex-col gap-1">
                <h4 className={`text-[15px] font-bold text-ink leading-snug line-clamp-2 m-0 
                    ${task.status?.toLowerCase() === 'completed' ? 'line-through opacity-50' : ''}`}>
                    {task.title}
                </h4>
                {task.description && (
                    <p className="text-[13px] text-muted line-clamp-2 leading-relaxed m-0">{task.description}</p>
                )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={task.status} />
                {task.category && (
                    <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: task.category.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.category.color }}></span>
                        {task.category.name}
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-1">
                {task.deadline ? (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1.5 
                        ${dlLabel.includes('Overdue') ? 'bg-[#FFEBEE] text-[#C62828]' : 'bg-[#fff0e6] text-[#FF6F00]'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        {dlLabel}
                    </span>
                ) : <span></span>}
                <span className="text-[11px] text-muted font-medium ml-auto">
                    {task.updated_at ? `edited ${timeAgoJS(task.updated_at)}` : timeAgoJS(task.created_at)}
                </span>
            </div>
        </div>
    );
}

/* Add/Edit Form */
function TaskForm({ task, categories, onClose, mode = 'add' }) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        title: task?.title ?? '',
        description: task?.description ?? '',
        category_id: task?.category_id ?? '',
        priority: task?.priority ?? 'medium',
        status: task?.status ?? 'not_started',
        deadline: task?.deadline ? task.deadline.replace(' ', 'T').slice(0, 16) : '',
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

    const labelCls = 'block text-sm font-semibold text-ink';
    const inputCls = 'w-full border-[1.5px] border-border rounded-lg !px-2 !py-1.5 text-sm text-ink bg-surface font-sans outline-none transition-colors focus:border-pink-dark';

    return (
        <form onSubmit={submit} className="flex flex-col !p-6 gap-3">
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-[18px] font-bold">{mode === 'add' ? 'Add New Task' : 'Edit Task'}</h2>
                <button type="button" onClick={onClose}
                    className="text-muted hover:text-ink text-[22px] leading-none border-none bg-transparent cursor-pointer px-1.5 rounded transition-colors">✕</button>
            </div>

            <div className="flex flex-col gap-1">
                <label className={labelCls}>Task Title *</label>
                <input type="text" className={inputCls} placeholder="Enter task title…"
                    value={data.title} onChange={e => setData('title', e.target.value)} required />
                {errors.title && <p className="text-[12px] text-error-text mt-1">{errors.title}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className={labelCls}>Description</label>
                <textarea className={`${inputCls} resize-y min-h-[80px]`} placeholder="Optional description…"
                    value={data.description} onChange={e => setData('description', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
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

            <div className="flex flex-col gap-1">
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={data.category_id ?? ''} onChange={e => setData('category_id', e.target.value)}>
                    <option value="">— No category —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className={labelCls}>Deadline (optional)</label>
                <input type="datetime-local" className={inputCls}
                    value={data.deadline} onChange={e => setData('deadline', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)} />
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-5 pt-4">
                <button type="button" onClick={onClose}
                    className="flex flex-row justify-center items-center gap-2 h-8 w-30 rounded-lg text-sm font-semibold
                               border border-gray-200 text-ink bg-fore
                               hover:bg-border transition-all cursor-pointer">
                    Cancel
                </button>
                <button type="submit" disabled={processing}
                    className="flex flex-row justify-center items-center gap-2 h-8 w-30 bg-pink-dark text-white rounded-xl text-sm font-semibold cursor-pointer transition-all hover:bg-pink-dark/80 disabled:opacity-70">
                    {processing ? 'Saving…' : (mode === 'add' ? 'Add Task' : 'Save Changes')}
                </button>
            </div>
        </form>
    );
}

/* Preview Modal */
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

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = () => {
        router.delete(`/my-task/${task.id}`, { onSuccess: onClose });
    };

    if (!task) return null;

    return (
        <div className='flex flex-col !p-6 gap-3'>
            <div className="flex items-start justify-between gap-3 ">
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

            <div className="mt-4 flex items-center gap-2.5 flex-wrap">
                <label className="text-[13px] font-semibold text-muted">Update Status:</label>
                <select defaultValue={task.status} onChange={handleStatusChange}
                    className="border-[1.5px] border-border rounded-lg px-2 py-1.5 text-[12px] font-sans bg-surface text-ink cursor-pointer outline-none focus:border-pink-dark h-8">
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-5 pt-4">
                <button onClick={onEdit}
                    className="flex flex-row justify-center items-center gap-2 h-8 w-30 rounded-lg text-sm font-semibold
                                           border border-gray-200 text-ink bg-fore
                                           hover:bg-border  transition-all cursor-pointer">
                    <img src="/assets/edit.svg" alt="" className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => setShowDeleteConfirm(true)}
                    className="flex flex-row justify-center items-center gap-2 h-8 w-30 bg-pink-dark text-white rounded-xl text-sm font-semibold cursor-pointer transition-all hover:bg-pink-dark/80">
                    <img src="/assets/trash.svg" alt="" className="w-4 h-4" /> Delete
                </button>
            </div>

            {showDeleteConfirm && (
                <DeleteConfirmOverlay
                    itemName={task.title}
                    onCancel={() => setShowDeleteConfirm(false)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}

/* My Task Page  */
export default function MyTask({ tasks, categories }) {
    const [activeStatus, setActiveStatus] = useState('all');
    const [activePriority, setActivePriority] = useState('all');
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1]);
    const [searchQuery, setSearchQuery] = useState(params.get('search') || '');
    const [addOpen, setAddOpen] = useState(false);
    const [previewTask, setPreviewTask] = useState(null);
    const [editTask, setEditTask] = useState(null);

    useEffect(() => {
        const handler = (e) => setSearchQuery(e.detail || '');
        window.addEventListener('taskly:search', handler);
        return () => window.removeEventListener('taskly:search', handler);
    }, []);

    const filteredTasks = tasks.filter(t => {
        const statusOk = activeStatus === 'all' || t.status === activeStatus;
        const priorityOk = activePriority === 'all' || t.priority === activePriority;
        const q = searchQuery.toLowerCase();
        const searchOk = !q || t.title.toLowerCase().includes(q)
            || (t.description ?? '').toLowerCase().includes(q)
            || (t.category?.name ?? '').toLowerCase().includes(q);
        return statusOk && priorityOk && searchOk;
    });

    const chipBase = '!px-4 !py-1.5 rounded-full text-xs font-semibold cursor-pointer border-[1.5px] border-border bg-white text-muted transition-all duration-200 select-none hover:border-pink-dark hover:bg-pink-dark hover:text-white';
    const chipActive = '!border-pink-dark !bg-pink-dark !text-white';

    return (
        <AuthenticatedLayout>
            <Head title="My Task" />

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-[22px] font-bold text-ink m-0">My Task</h1>
                    <p className="text-[13px] text-muted mt-1 m-0">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
                </div>
                <button onClick={() => setAddOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 !px-3 !py-2.5 rounded-lg text-sm font-semibold
                                   bg-pink-dark text-white transition-all
                                   hover:bg-pink-dark/80  w-full sm:w-auto cursor-pointer border-none">
                    <img src="/assets/add.svg" alt="" className="w-4 h-4 invert" /> Add Task
                </button>
            </div>

            {/* Filter bar */}
            <div className="flex gap-3 !py-4 flex-wrap items-center">
                <span className="text-sm font-semibold text-muted mr-1">Filter:</span>
                {[['all', 'All'], ['not_started', 'Not Started'], ['in_progress', 'In Progress'], ['completed', 'Completed']].map(([val, lbl]) => (
                    <button key={val} onClick={() => setActiveStatus(val)}
                        className={`${chipBase} ${activeStatus === val ? chipActive : ''}`}>{lbl}</button>
                ))}
            </div>

            {/* Task grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTasks.length === 0 && tasks.length === 0 && (
                    <div className="col-span-full flex flex-col items-center py-16 text-muted">
                        <img src="/assets/clipboard.svg" alt="" className="w-8 h-8 mx-auto mb-4 opacity-40" />
                        <h3 className="text-[16px] font-semibold text-ink mb-1.5 m-0">No tasks yet</h3>
                        <p className="text-[13px] m-0">Click "Add Task" to create your first task.</p>
                    </div>
                )}
                {filteredTasks.length === 0 && tasks.length > 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center text-center !py-16 gap-3 text-muted">
                        <img src="/assets/seacrh.svg" alt="" className="w-8 h-8  mb-4 opacity-40" />
                        <span className="text-md font-semibold text-ink mb-1.5 m-0">No tasks match this filter</span>
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
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/constants/taskOptions';

const labelCls = 'block text-sm font-semibold text-ink';
const inputCls = 'w-full border-[1.5px] border-border rounded-lg !px-2 !py-1.5 text-sm text-ink bg-surface font-sans outline-none transition-colors focus:border-pink-dark';

// TaskForm
/**
 * @param {object}   [task]      
 * @param {object[]} categories  
 * @param {function} onClose
 * @param {'add'|'edit'} mode
 */
export default function TaskForm({ task, categories, onClose, mode = 'add' }) {
    const [formData, setFormData] = useState({
        title:       task?.title       ?? '',
        description: task?.description ?? '',
        category_id: task?.category_id ?? '',
        priority:    task?.priority    ?? 'medium',
        status:      task?.status      ?? 'not_started',
        deadline:    task?.deadline    ? task.deadline.replace(' ', 'T').slice(0, 16) : '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors]         = useState({});

    const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

    const submit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            deadline:    formData.deadline    || null,
            category_id: formData.category_id || null,
        };
        setProcessing(true);
        const opts = {
            onSuccess: onClose,
            onError:   (errs) => { setErrors(errs); setProcessing(false); },
        };
        if (mode === 'add') {
            router.post('/my-task', payload, opts);
        } else {
            router.patch(`/my-task/${task.id}`, payload, opts);
        }
    };

    return (
        <form onSubmit={submit} className="flex flex-col !p-6 gap-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-[18px] font-bold">
                    {mode === 'add' ? 'Add New Task' : 'Edit Task'}
                </h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink hover:bg-fore leading-none border-none bg-transparent cursor-pointer rounded-lg transition-colors"
                >
                    <X size={20} className="opacity-80" />
                </button>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1">
                <label className={labelCls}>Task Title</label>
                <input
                    type="text"
                    className={inputCls}
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={e => set('title', e.target.value)}
                    required
                />
                {errors.title && <p className="text-[12px] text-error-text mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
                <label className={labelCls}>Description</label>
                <textarea
                    className={`${inputCls} resize-y min-h-[80px]`}
                    placeholder="Task description"
                    value={formData.description}
                    onChange={e => set('description', e.target.value)}
                />
            </div>

            {/* Priority + Status */}
            <div className="grid grid-cols-2 gap-3.5">
                <div>
                    <label className={labelCls}>Priority</label>
                    <select className={inputCls} value={formData.priority} onChange={e => set('priority', e.target.value)}>
                        {PRIORITY_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={labelCls}>Status</label>
                    <select className={inputCls} value={formData.status} onChange={e => set('status', e.target.value)}>
                        {STATUS_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={formData.category_id ?? ''} onChange={e => set('category_id', e.target.value)}>
                    <option value="">— No category —</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Deadline */}
            <div className="flex flex-col gap-1">
                <label className={labelCls}>Deadline (optional)</label>
                <input
                    type="datetime-local"
                    className={inputCls}
                    value={formData.deadline}
                    onChange={e => set('deadline', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 mt-5 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex flex-row justify-center items-center gap-2 h-8 w-30 rounded-lg text-sm font-semibold border border-gray-200 text-ink bg-fore hover:bg-border transition-all cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="flex flex-row justify-center items-center gap-2 h-8 w-30 bg-pink-dark text-white rounded-xl text-sm font-semibold cursor-pointer transition-all hover:bg-pink-dark/80 disabled:opacity-70"
                >
                    {processing ? 'Saving…' : (mode === 'add' ? 'Add Task' : 'Save Changes')}
                </button>
            </div>
        </form>
    );
}

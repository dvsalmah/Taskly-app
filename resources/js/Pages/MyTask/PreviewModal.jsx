import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { X, Flame, UsersRound, Edit2, Trash2, Check, Copy, Calendar } from 'lucide-react';
import Badge from '@/components/Badge';
import StatusSelect from '@/components/shared/StatusSelect';
import DeleteConfirmOverlay from '@/components/DeleteConfirmOverlay';
import { deadlineLabel, timeAgoJS } from '@/lib/dateUtils';

const labelCls = 'text-[11px] font-semibold uppercase text-muted tracking-wide';

/**
 * PreviewModal
 * @param {object}   task
 * @param {object[]} categories
 * @param {function} onClose
 * @param {function} onEdit
 */
export default function PreviewModal({ task, categories, onClose, onEdit }) {
    const [dlLabel, setDlLabel]           = useState(() => deadlineLabel(task?.deadline));
    const [copied, setCopied]             = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!task?.deadline) return;
        const id = setInterval(() => setDlLabel(deadlineLabel(task.deadline)), 60000);
        return () => clearInterval(id);
    }, [task?.deadline]);

    if (!task) return null;

    const handleStatusChange = (e) => {
        router.patch(`/my-task/${task.id}/status`, { status: e.target.value }, { preserveScroll: true });
    };

    const handleCopyCode = () => {
        if (!task.referral_code) return;
        navigator.clipboard.writeText(task.referral_code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleDelete = () => {
        router.delete(`/my-task/${task.id}`, { onSuccess: onClose });
    };

    return (
        <div className="flex flex-col !p-6 gap-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[17px] font-bold text-ink">{task.title}</h2>
                    {task.is_vital && <Badge variant="vital"><Flame size={12} /> Vital</Badge>}
                    <Badge variant={task.priority} />
                    {task.is_collab && (
                        <span className="inline-flex items-center gap-1 !px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-dark/10 text-pink-dark border border-pink-dark/20">
                            <UsersRound size={12} />
                            {task.is_author ? 'Collab' : 'Shared with me'}
                        </span>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink hover:bg-fore leading-none border-none bg-transparent cursor-pointer rounded-lg transition-colors"
                >
                    <X size={20} className="opacity-80" />
                </button>
            </div>

            {/* Description */}
            {task.description && (
                <div className="text-[14px] text-muted leading-relaxed bg-fore rounded-lg !p-3">
                    {task.description}
                </div>
            )}

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3 mb-1">
                <div className="flex flex-col gap-1"><span className={labelCls}>Status</span><Badge variant={task.status} /></div>
                <div className="flex flex-col gap-1"><span className={labelCls}>Priority</span><Badge variant={task.priority} /></div>
                {task.category && (
                    <div className="flex flex-col gap-1">
                        <span className={labelCls}>Category</span>
                        <span className="text-sm font-medium" style={{ color: task.category.color }}>
                            {task.category.name}
                        </span>
                    </div>
                )}
                {task.deadline && (
                    <div className="flex flex-col gap-1">
                        <span className={labelCls}>Deadline</span>
                        <span className="text-[13px] flex items-center gap-1">
                            <Calendar size={12} strokeWidth={2} className="shrink-0 text-muted" />
                            {dlLabel}
                        </span>
                    </div>
                )}
                <div className="flex flex-col gap-1"><span className={labelCls}>Created</span><span className="text-[13px] text-muted">{timeAgoJS(task.created_at)}</span></div>
                {task.updated_at && (
                    <div className="flex flex-col gap-1"><span className={labelCls}>Last edited</span><span className="text-[13px] text-muted">edited {timeAgoJS(task.updated_at)}</span></div>
                )}
            </div>

            {/* Invite code (collab author) */}
            {task.is_author && task.referral_code && (
                <div className="bg-fore rounded-lg !p-2 flex items-center justify-between gap-3 border border-border">
                    <div className="flex flex-col gap-0.5">
                        <span className={labelCls}>Invite Code</span>
                        <span className="text-[18px] font-bold tracking-[0.3em] text-pink-dark">{task.referral_code}</span>
                    </div>
                    <button
                        onClick={handleCopyCode}
                        title="Copy code"
                        className={`flex items-center gap-1.5 !p-2 rounded-lg text-[12px] font-semibold border transition-all cursor-pointer ${copied ? 'bg-ok-bg border-ok-border text-ok-text' : 'bg-surface border-border text-ink hover:border-pink-dark hover:text-pink-dark'}`}
                    >
                        {copied ? <><Check size={12} strokeWidth={2.5} className="shrink-0" /> Copied!</> : <><Copy size={12} strokeWidth={2} className="shrink-0" /> Copy</>}
                    </button>
                </div>
            )}

            {/* Status update */}
            <div className="mt-4 flex items-center gap-2.5 flex-wrap">
                <label className="text-[13px] font-semibold text-muted">Update Status:</label>
                <StatusSelect value={task.status} onChange={handleStatusChange} />
            </div>

            {/* Action buttons (author only) */}
            {task.is_author && (
                <div className="flex items-center justify-end gap-2.5 mt-5 pt-4">
                    <button
                        onClick={onEdit}
                        className="flex flex-row justify-center items-center gap-2 h-8 w-30 rounded-lg text-sm font-semibold border border-gray-200 text-ink bg-fore hover:bg-border transition-all cursor-pointer"
                    >
                        <Edit2 size={16} /> Edit
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex flex-row justify-center items-center gap-2 h-8 w-30 bg-pink-dark text-white rounded-xl text-sm font-semibold cursor-pointer transition-all hover:bg-pink-dark/80"
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            )}

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

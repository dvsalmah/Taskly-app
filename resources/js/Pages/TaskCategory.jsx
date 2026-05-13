import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

const PRESETS = ['#EC003F','#FF6F00','#F9A825','#2E7D32','#1565C0','#6A1B9A','#00838F','#4E342E','#546E7A'];

function CategoryCard({ cat, onDelete }) {
    return (
        <div className="bg-surface rounded-[10px] p-[18px] shadow-[0_2px_12px_rgba(0,0,0,0.07)]
                        flex items-center gap-3 border-t-4 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)]"
             style={{ borderTopColor: cat.color }}>
            <div className="w-9 h-9 rounded-full flex-shrink-0" style={{ background: cat.color }} />
            <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-ink">{cat.name}</div>
                <div className="text-[12px] text-muted">{cat.tasks_count} task{cat.tasks_count !== 1 ? 's' : ''}</div>
            </div>
            <button onClick={() => onDelete(cat)}
                    className="text-[20px] leading-none border-none bg-transparent cursor-pointer text-muted
                               hover:text-[#C62828] transition-colors p-1" title="Delete category">
                🗑
            </button>
        </div>
    );
}

function AddCategoryForm({ onClose }) {
    const [name, setName]   = useState('');
    const [color, setColor] = useState('#EC003F');
    const [busy, setBusy]   = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setBusy(true);
        router.post(route('category.store'), { name, color }, {
            onSuccess: onClose,
            onFinish: () => setBusy(false),
        });
    };

    return (
        <form onSubmit={submit}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-bold text-ink">New Category</h2>
                <button type="button" onClick={onClose}
                        className="text-muted hover:text-ink text-[22px] leading-none border-none bg-transparent cursor-pointer px-1.5 rounded transition-colors">✕</button>
            </div>

            <div className="mb-4">
                <label className="block text-[13px] font-semibold text-ink mb-1.5">Category Name *</label>
                <input type="text" placeholder="e.g. Work, Personal, Study…" required
                       value={name} onChange={e => setName(e.target.value)}
                       className="w-full border-[1.5px] border-border rounded-lg px-3.5 py-2.5 text-[14px] text-ink bg-surface font-sans outline-none focus:border-pink-dark" />
            </div>

            <div className="mb-4">
                <label className="block text-[13px] font-semibold text-ink mb-2">Pick a Color</label>
                <div className="flex gap-2 flex-wrap">
                    {PRESETS.map(hex => (
                        <button key={hex} type="button"
                                onClick={() => setColor(hex)}
                                className={`w-7 h-7 rounded-full cursor-pointer transition-all duration-150
                                    ${color === hex ? 'scale-110 ring-2 ring-offset-1 ring-ink' : 'hover:scale-110'}`}
                                style={{ background: hex }} title={hex} />
                    ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-[12px] text-muted font-mono">{color}</span>
                </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-5 pt-4 border-t border-border">
                <button type="button" onClick={onClose}
                        className="px-[18px] py-2 rounded-lg text-[13px] font-semibold text-muted border border-border bg-transparent cursor-pointer hover:bg-fore hover:text-ink transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={busy}
                        className="px-[18px] py-2 rounded-lg text-[13px] font-semibold text-white bg-pink-dark border-none cursor-pointer transition-all hover:bg-pink hover:-translate-y-px disabled:opacity-70">
                    {busy ? 'Creating…' : 'Create'}
                </button>
            </div>
        </form>
    );
}

export default function TaskCategory({ categories }) {
    const [modalOpen, setModalOpen] = useState(false);

    const handleDelete = (cat) => {
        if (confirm(`Delete category "${cat.name}"? Tasks will keep their data.`)) {
            router.delete(route('category.destroy', cat.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Task Categories" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-[22px] font-bold text-ink">Task Categories</h1>
                    <p className="text-[13px] text-muted mt-0.5">
                        {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
                    </p>
                </div>
                <button onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-lg text-[13px] font-semibold
                                   bg-pink-dark text-white border-none cursor-pointer transition-all
                                   hover:bg-pink hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(134,16,67,0.3)]">
                    <img src="/assets/add.svg" alt="" className="w-4 h-4 brightness-0 invert" /> Add Category
                </button>
            </div>

            {/* Category grid */}
            {categories.length === 0 ? (
                <div className="text-center py-16 text-muted">
                    <h3 className="text-[16px] font-semibold text-ink mb-1.5">No categories yet</h3>
                    <p className="text-[13px]">Create categories to organise your tasks by topic, project, or priority.</p>
                </div>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
                    {categories.map(cat => (
                        <CategoryCard key={cat.id} cat={cat} onDelete={handleDelete} />
                    ))}
                </div>
            )}

            {/* Add Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="max-w-[400px]">
                <AddCategoryForm onClose={() => setModalOpen(false)} />
            </Modal>
        </AuthenticatedLayout>
    );
}

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/components/Modal';
import DeleteConfirmOverlay from '@/components/DeleteConfirmOverlay';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { Trash2, X, Plus, FolderOpen } from 'lucide-react';
import { COLOR_PRESETS } from '@/constants/categoryColors';

function CategoryCard({ cat, onDelete }) {
    return (
        <div
            className="!bg-surface rounded-2xl !p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-center gap-4 border-b-4 transition-all duration-200 hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
            style={{ borderBottomColor: cat.color }}
        >
            <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background: cat.color }} />
            <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold text-ink">{cat.name}</div>
                <div className="text-[13px] text-muted font-medium">{cat.tasks_count} task{cat.tasks_count !== 1 ? 's' : ''}</div>
            </div>
            <button
                onClick={() => onDelete(cat)}
                className="flex flex-col items-center justify-center bg-red-500 h-8 w-8 rounded-lg cursor-pointer text-white hover:bg-red-600 transition-colors p-1"
                title="Delete category"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}

function AddCategoryForm({ onClose }) {
    const [name,  setName]  = useState('');
    const [color, setColor] = useState('#EC003F');
    const [busy,  setBusy]  = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setBusy(true);
        router.post('/task-category', { name, color }, {
            onSuccess: onClose,
            onFinish:  () => setBusy(false),
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col !p-6 gap-3">
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-[18px] font-bold text-ink">New Category</h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink hover:bg-fore leading-none border-none bg-transparent cursor-pointer rounded-lg transition-colors"
                >
                    <X size={20} className="opacity-80" />
                </button>
            </div>

            <div className="flex flex-col gap-1">
                <label className="block text-sm font-semibold text-ink">Category Name *</label>
                <input
                    type="text"
                    placeholder="e.g. Work, Personal, Study"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border-[1.5px] border-border rounded-lg !px-2 !py-1.5 text-sm text-ink bg-surface font-sans outline-none focus:border-pink-dark transition-colors"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="block text-sm font-semibold text-ink">Pick a Color</label>
                <div className="flex gap-2 flex-wrap !pb-2">
                    {COLOR_PRESETS.map(hex => (
                        <button
                            key={hex}
                            type="button"
                            onClick={() => setColor(hex)}
                            className={`w-7 h-7 rounded-full cursor-pointer transition-all duration-150 ${color === hex ? 'scale-110 ring-2 ring-offset-1 ring-ink' : 'hover:scale-110'}`}
                            style={{ background: hex }}
                            title={hex}
                        />
                    ))}
                </div>
            </div>

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
                    disabled={busy}
                    className="flex flex-row justify-center items-center gap-2 h-8 w-30 bg-pink-dark text-white rounded-xl text-sm font-semibold cursor-pointer transition-all hover:bg-pink-dark/80 disabled:opacity-70"
                >
                    {busy ? 'Creating…' : 'Create'}
                </button>
            </div>
        </form>
    );
}

export default function TaskCategory({ categories }) {
    const [modalOpen,  setModalOpen]  = useState(false);
    const [deleteCat,  setDeleteCat]  = useState(null);

    const confirmDelete = () => {
        if (deleteCat) {
            router.delete(`/task-category/${deleteCat.id}`, {
                onSuccess: () => setDeleteCat(null),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Task Categories" />

            <PageHeader
                title="Task Categories"
                subtitle={`${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'}`}
                actions={
                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center justify-center gap-1.5 !px-3 !py-2.5 rounded-lg text-sm font-semibold bg-pink-dark text-white hover:bg-pink-dark/80 w-full sm:w-auto cursor-pointer border-none transition-all"
                    >
                        <Plus size={16} /> Add Category
                    </button>
                }
            />

            {categories.length === 0 ? (
                <EmptyState
                    icon={FolderOpen}
                    title="No categories yet"
                    message="Create categories to organise your tasks by topic, project, or priority."
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map(cat => (
                        <CategoryCard key={cat.id} cat={cat} onDelete={setDeleteCat} />
                    ))}
                </div>
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="max-w-[400px]">
                <AddCategoryForm onClose={() => setModalOpen(false)} />
            </Modal>

            {deleteCat && (
                <DeleteConfirmOverlay
                    itemName={deleteCat.name}
                    isCategory={true}
                    onCancel={() => setDeleteCat(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </AuthenticatedLayout>
    );
}

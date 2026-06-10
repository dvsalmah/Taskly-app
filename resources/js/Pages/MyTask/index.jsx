import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/components/Modal';
import JoinTaskModal from '@/components/JoinTaskModal';
import FilterBar from '@/components/shared/FilterBar';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import PreviewModal from './PreviewModal';
import { Plus, UsersRound, ClipboardCheck, Search } from 'lucide-react';

const STATUS_FILTERS = [
    { value: 'all',          label: 'All' },
    { value: 'not_started',  label: 'Not Started' },
    { value: 'in_progress',  label: 'In Progress' },
    { value: 'completed',    label: 'Completed' },
];

// MyTask page 
export default function MyTask({ tasks, categories }) {
    const [activeStatus,   setActiveStatus]   = useState('all');
    const [activePriority, setActivePriority] = useState('all');
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1]);
    const [searchQuery, setSearchQuery] = useState(params.get('search') || '');
    const [addOpen,      setAddOpen]      = useState(false);
    const [joinOpen,     setJoinOpen]     = useState(false);
    const [previewTask,  setPreviewTask]  = useState(null);
    const [editTask,     setEditTask]     = useState(null);

    // Sync search query from Navbar search bar via custom event
    useEffect(() => {
        const handler = (e) => setSearchQuery(e.detail || '');
        window.addEventListener('taskly:search', handler);
        return () => window.removeEventListener('taskly:search', handler);
    }, []);

    const filteredTasks = tasks.filter(t => {
        const statusOk   = activeStatus === 'all'   || t.status   === activeStatus;
        const priorityOk = activePriority === 'all' || t.priority === activePriority;
        const q          = searchQuery.toLowerCase();
        const searchOk   = !q
            || t.title.toLowerCase().includes(q)
            || (t.description ?? '').toLowerCase().includes(q)
            || (t.category?.name ?? '').toLowerCase().includes(q);
        return statusOk && priorityOk && searchOk;
    });

    const headerActions = (
        <>
            <button
                onClick={() => setJoinOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 !px-3 !py-2.5 rounded-lg text-sm font-semibold bg-fore border border-pink-dark text-pink-dark hover:bg-pink-dark/10 transition-all flex-1 sm:flex-none cursor-pointer"
            >
                <UsersRound size={16} /> Join Task
            </button>
            <button
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 !px-3 !py-2.5 rounded-lg text-sm font-semibold bg-pink-dark text-white hover:bg-pink-dark/80 transition-all flex-1 sm:flex-none cursor-pointer border-none"
            >
                <Plus size={16} /> Add Task
            </button>
        </>
    );

    return (
        <AuthenticatedLayout>
            <Head title="My Task" />

            <PageHeader
                title="My Task"
                subtitle={`${tasks.length} task${tasks.length !== 1 ? 's' : ''} total`}
                actions={headerActions}
            />

            <FilterBar
                filters={STATUS_FILTERS}
                active={activeStatus}
                onChange={setActiveStatus}
            />

            {/* Task grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTasks.length === 0 && tasks.length === 0 && (
                    <EmptyState
                        icon={ClipboardCheck}
                        title="No tasks yet"
                        message='Click "Add Task" to create your first task.'
                        wrapperClass="col-span-full"
                    />
                )}
                {filteredTasks.length === 0 && tasks.length > 0 && (
                    <EmptyState
                        icon={Search}
                        title="No tasks match this filter"
                        wrapperClass="col-span-full"
                    />
                )}
                {filteredTasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => setPreviewTask(task)} />
                ))}
            </div>

            {/* Modals */}
            <Modal open={addOpen} onClose={() => setAddOpen(false)}>
                <TaskForm mode="add" categories={categories} onClose={() => setAddOpen(false)} />
            </Modal>

            <Modal open={joinOpen} onClose={() => setJoinOpen(false)} maxWidth="max-w-[420px]">
                <JoinTaskModal onClose={() => setJoinOpen(false)} />
            </Modal>

            <Modal open={!!editTask} onClose={() => setEditTask(null)}>
                {editTask && (
                    <TaskForm mode="edit" task={editTask} categories={categories} onClose={() => setEditTask(null)} />
                )}
            </Modal>

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

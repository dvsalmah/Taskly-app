import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const HELP_CARDS = [
    { icon: '/assets/my-task.svg',      title: 'My Task',            desc: 'Add, edit, and manage all your tasks in one place. Set a title, description, category, and status. Use the status dropdown on each card to quickly update progress.' },
    { icon: '/assets/vital-task.svg',   title: 'Vital Task',         desc: 'Tasks with High priority and a deadline within 48 hours are automatically shown here. Keep an eye on them so nothing important slips through.' },
    { icon: '/assets/category.svg',     title: 'Task Categories',    desc: 'Create custom categories (e.g. Work, Personal, Study) with your own colour. When adding a task, pick a category to keep things organised and visually distinct.' },
    { icon: '/assets/homepage.svg',     title: 'Dashboard',          desc: 'The homepage shows your upcoming to-dos, real-time task status percentages, and recently completed tasks — all pulled live from your task data.' },
    { icon: '/assets/profile.svg',      title: 'Profile & Settings', desc: 'Update your name, email, contact, and position anytime. You can also upload a profile photo (JPG/PNG, max 2 MB) which will show in the navbar.' },
    { icon: '/assets/password.svg',     title: 'Security',           desc: 'Change your password from the Profile page. Your session is protected — you\'ll be redirected to login if not authenticated. Logout from the sidebar at any time.' },
];

const FAQS = [
    {
        q: 'How do I add a new task?',
        a: 'Go to My Task from the sidebar and click + Add Task. Fill in the title (required), description, category, priority level, status, and optionally a deadline date & time. Click Add Task — the card will appear in the grid immediately.',
    },
    {
        q: 'How do I view, edit, or delete a task?',
        a: 'Click any task card to open a Preview panel showing full details. Inside the preview you can: change the status via the dropdown, click Edit to modify the task, or click Delete to remove it permanently. Close the preview with the ✕ button or by clicking outside the panel.',
    },
    {
        q: 'What is a Vital Task and how does it work?',
        a: 'A task is automatically flagged as Vital when it meets both conditions: Priority is set to High, AND Deadline is within the next 48 hours. You don\'t need to do anything manually — vital tasks appear on the Vital Task page automatically and are marked with a 🔥 badge.',
    },
    {
        q: 'How do I set a deadline for a task?',
        a: 'When adding or editing a task, use the Deadline date & time picker at the bottom of the form. Once set, the card will show a countdown such as "Due in 3 hr", "Due tomorrow", or "Overdue". The countdown updates automatically in real-time — no page refresh needed.',
    },
    {
        q: 'How do I filter or search my tasks?',
        a: 'Use the filter bar on the My Task page to narrow tasks by status (All / Not Started / In Progress / Completed) and by priority via the dropdown. You can also type in the search bar at the top of the page — it filters cards live by title, description, or category name. All filters work together simultaneously.',
    },
    {
        q: 'Can I delete a category that has tasks?',
        a: 'Yes. Deleting a category only removes the label — your tasks are not deleted. Tasks that belonged to the deleted category will simply show no category until you assign a new one via the Edit modal.',
    },
    {
        q: 'Is my data saved between sessions?',
        a: 'Yes. Tasks, categories, and profile information are stored in the database and persist between logins. If you enable Remember Me on the login page, you will be logged in automatically on your next visit.',
    },
];

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border border-border rounded-[10px] overflow-hidden bg-surface transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
            <button
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between px-5 py-4 text-left text-[14px] font-semibold
                            text-ink gap-3 border-none cursor-pointer transition-colors font-sans
                            ${open ? 'bg-fore text-pink-dark' : 'bg-transparent hover:bg-fore'}`}
            >
                {q}
                <span className={`text-[16px] flex-shrink-0 transition-transform duration-250 text-muted
                                  ${open ? 'rotate-180 text-pink-dark' : ''}`}>▾</span>
            </button>

            <div className={`faq-answer ${open ? 'open' : ''}`}>
                <div className="faq-answer-inner border-t border-border px-5 py-4 text-[13px] text-muted leading-relaxed">
                    {a}
                </div>
            </div>
        </div>
    );
}

export default function Help() {
    return (
        <AuthenticatedLayout>
            <Head title="Help Center" />

            <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-[22px] font-bold text-ink">Help Center</h1>
                    <p className="text-[13px] text-muted mt-0.5">Learn how to use Taskly and get answers to common questions.</p>
                </div>
            </div>

            {/* Help cards grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
                {HELP_CARDS.map(card => (
                    <div key={card.title} className="bg-surface rounded-[10px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
                        <img src={card.icon} alt="" className="w-8 h-8 mb-3.5 block opacity-80" style={{ filter: 'brightness(0)' }} />
                        <h3 className="text-[15px] font-bold mb-2">{card.title}</h3>
                        <p className="text-[13px] text-muted leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </div>

            {/* FAQ */}
            <h2 className="text-[18px] font-bold mt-9 mb-1">Frequently Asked Questions</h2>
            <p className="text-[13px] text-muted mb-4">Click a question to expand the answer.</p>

            <div className="flex flex-col gap-3">
                {FAQS.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
            </div>
        </AuthenticatedLayout>
    );
}

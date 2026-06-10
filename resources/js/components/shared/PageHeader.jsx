/**
 * PageHeader
 * @param {string} title
 * @param {string} [subtitle]
 * @param {React.ReactNode} [actions]
 */
export default function PageHeader({ title, subtitle, actions }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
                <h1 className="text-[22px] font-bold text-ink m-0">{title}</h1>
                {subtitle && (
                    <p className="text-[13px] text-muted mt-1 m-0">{subtitle}</p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {actions}
                </div>
            )}
        </div>
    );
}

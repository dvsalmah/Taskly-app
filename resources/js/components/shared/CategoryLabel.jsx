/**
 * CategoryLabel — colored dot + category name.
 * Renders nothing if category is null/undefined.
 *
 * @param {{ name: string, color: string }|null} category
 */
export default function CategoryLabel({ category }) {
    if (!category) return null;
    return (
        <span
            className="text-[11px] font-semibold flex items-center gap-1"
            style={{ color: category.color }}
        >
            <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: category.color }}
            />
            {category.name}
        </span>
    );
}

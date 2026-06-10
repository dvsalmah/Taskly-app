/**
 * @param {string} s
 * @returns {string}
 */
export function timeAgoJS(s) {
    if (!s) return '';
    const diff = Math.floor((Date.now() - new Date(s.replace(' ', 'T'))) / 1000);
    if (diff < 60)     return 'just now';
    if (diff < 3600)   return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400)  return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return new Date(s.replace(' ', 'T')).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

/**
 * @param {string|null} dl
 * @returns {string}
 */
export function deadlineLabel(dl) {
    if (!dl) return '';
    const diff = new Date(dl.replace(' ', 'T')) - Date.now();
    if (diff < -86400000) return 'Overdue';
    if (diff < 0)         return 'Due today (overdue)';
    if (diff < 3600000)   return `Due in ${Math.ceil(diff / 60000)} min`;
    if (diff < 86400000)  return `Due in ${Math.ceil(diff / 3600000)} hr`;
    if (diff < 172800000) return 'Due tomorrow';
    const d = new Date(dl.replace(' ', 'T'));
    return `Due ${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

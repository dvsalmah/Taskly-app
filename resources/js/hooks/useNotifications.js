import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

/**
 * useNotifications     
 * @returns {{
 *   invitations: object[],
 *   unreadCount: number,
 *   fetchInvitations: function,
 *   handleRespond: function,
 *   clearUnread: function,
 * }}
 */
export default function useNotifications() {
    const [invitations, setInvitations] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Poll unread count every 15 seconds
    useEffect(() => {
        const fetchUnread = () => {
            fetch('/collab/unread', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then(r => r.ok ? r.json() : null)
                .then(data => { if (data) setUnreadCount(data.unread); })
                .catch(() => {});
        };
        fetchUnread();
        const id = setInterval(fetchUnread, 15000);
        return () => clearInterval(id);
    }, []);

    const fetchInvitations = () => {
        fetch('/collab/notifications', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data) {
                    setInvitations(data.invitations);
                    setUnreadCount(0);
                }
            })
            .catch(() => {});
    };

    const handleRespond = (invitationId, action) => {
        router.post(`/collab/respond/${invitationId}`, { action }, {
            onSuccess: () => {
                setInvitations(prev => prev.filter(i => i.id !== invitationId));
            },
        });
    };

    return { invitations, unreadCount, fetchInvitations, handleRespond };
}

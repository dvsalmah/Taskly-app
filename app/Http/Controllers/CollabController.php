<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskInvitation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CollabController extends Controller
{
    public function joinByCode(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $code = strtolower(trim($request->code));
        $user = $request->user();

        $task = Task::where('referral_code', $code)->first();

        if (!$task) {
            return back()->withErrors(['code' => 'Invalid referral code. Please check and try again.']);
        }

        if ($task->user_id === $user->id) {
            return back()->withErrors(['code' => 'You cannot join your own task.']);
        }

        if ($task->collaborators()->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['code' => 'You are already a collaborator on this task.']);
        }

        if ($task->invitations()->where('requester_id', $user->id)->where('status', 'pending')->exists()) {
            return back()->withErrors(['code' => 'You already have a pending join request for this task.']);
        }

        TaskInvitation::create([
            'task_id'      => $task->id,
            'requester_id' => $user->id,
            'status'       => 'pending',
            'read'         => false,
        ]);

        return back()->with('success', 'Join request sent! Waiting for the task author to accept.');
    }

    public function respond(Request $request, TaskInvitation $invitation): RedirectResponse
    {
        $user = $request->user();

        abort_unless($invitation->task->user_id === $user->id, 403);

        $request->validate([
            'action' => 'required|in:accept,decline',
        ]);

        if ($request->action === 'accept') {
            $invitation->update(['status' => 'accepted', 'read' => true]);
            $invitation->task->collaborators()->syncWithoutDetaching([$invitation->requester_id]);
        } else {
            $invitation->update(['status' => 'declined', 'read' => true]);
        }

        return back();
    }

    public function notifications(Request $request): JsonResponse
    {
        $user = $request->user();

        $invitations = TaskInvitation::with(['task', 'requester'])
            ->whereHas('task', fn($q) => $q->where('user_id', $user->id))
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($inv) => [
                'id'            => $inv->id,
                'read'          => $inv->read,
                'task_title'    => $inv->task->title,
                'requester_name' => $inv->requester->full_name ?: $inv->requester->username,
                'requester_photo' => $inv->requester->photo_url,
                'created_at'    => $inv->created_at?->toIso8601String(),
            ]);

        $unreadCount = $invitations->where('read', false)->count();

        TaskInvitation::whereIn('id', $invitations->pluck('id'))
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json([
            'invitations' => $invitations,
            'unread'      => $unreadCount,
        ]);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();

        $count = TaskInvitation::whereHas('task', fn($q) => $q->where('user_id', $user->id))
            ->where('status', 'pending')
            ->where('read', false)
            ->count();

        return response()->json(['unread' => $count]);
    }
}

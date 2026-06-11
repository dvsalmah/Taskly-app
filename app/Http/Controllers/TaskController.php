<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $ownTasks = $user->tasks()->with('category', 'collaborators')->orderBy('created_at', 'desc')->get();
        $collabTasks = $user->collaboratingTasks()->with('category', 'collaborators', 'user')->orderBy('created_at', 'desc')->get();
        $categories = $user->categories()->orderBy('name')->get();
        $formatted = collect()
            ->merge($ownTasks->map(fn($t) => $this->formatTask($t, $user->id, true)))
            ->merge($collabTasks->map(fn($t) => $this->formatTask($t, $user->id, false)))
            ->sortByDesc('created_at')
            ->values();

        return Inertia::render('MyTask/index', [
            'tasks'      => $formatted,
            'categories' => $categories->map(fn($c) => [
                'id'    => $c->id,
                'name'  => $c->name,
                'color' => $c->color,
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|integer|exists:categories,id',
            'priority'    => 'required|in:low,medium,high',
            'status'      => 'required|in:not_started,in_progress,completed',
            'deadline'    => 'nullable|date',
        ]);

        $data['referral_code'] = Task::generateReferralCode();

        $request->user()->tasks()->create($data);

        return back()->with('success', 'Task added successfully!');
    }

    public function update(Request $request, Task $task): RedirectResponse
    {
        $this->authorizeOwner($task, $request->user());

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|integer|exists:categories,id',
            'priority'    => 'required|in:low,medium,high',
            'status'      => 'required|in:not_started,in_progress,completed',
            'deadline'    => 'nullable|date',
        ]);

        $task->update($data);

        return back()->with('success', 'Task updated.');
    }

    public function updateStatus(Request $request, Task $task): RedirectResponse
    {
        // Both owner and collaborators can update status
        $this->authorizeOwnerOrCollaborator($task, $request->user());

        $request->validate([
            'status' => 'required|in:not_started,in_progress,completed',
        ]);

        $task->update(['status' => $request->status]);

        return back();
    }

    public function destroy(Request $request, Task $task): RedirectResponse
    {
        $this->authorizeOwner($task, $request->user());
        $task->delete();

        return back()->with('success', 'Task deleted.');
    }

    /** Only the task author can modify/delete */
    private function authorizeOwner(Task $task, $user): void
    {
        abort_unless($task->user_id === $user->id, 403);
    }

    /** Author or collaborator can update status */
    private function authorizeOwnerOrCollaborator(Task $task, $user): void
    {
        $isOwner        = $task->user_id === $user->id;
        $isCollaborator = $task->collaborators()->where('user_id', $user->id)->exists();
        abort_unless($isOwner || $isCollaborator, 403);
    }

    private function formatTask(Task $task, int $currentUserId, bool $isOwn): array
    {
        $isCollab = $task->collaborators()->exists() || !$isOwn;

        return [
            'id'                  => $task->id,
            'title'               => $task->title,
            'description'         => $task->description,
            'status'              => $task->status,
            'priority'            => $task->priority,
            'deadline'            => $task->deadline?->format('Y-m-d H:i:s'),
            'is_vital'            => $task->is_vital,
            'is_collab'           => $isCollab,
            'is_author'           => $isOwn,
            'referral_code'       => $isOwn ? $task->referral_code : null,
            'collaborators_count' => $task->collaborators->count(),
            'created_at'          => $task->created_at?->toIso8601String(),
            'updated_at'          => $task->updated_at?->toIso8601String(),
            'category_id'         => $task->category_id,
            'category'            => $task->category ? [
                'id'    => $task->category->id,
                'name'  => $task->category->name,
                'color' => $task->category->color,
            ] : null,
        ];
    }
}

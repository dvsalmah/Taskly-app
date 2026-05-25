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
        $user       = $request->user();
        $tasks      = $user->tasks()->with('category')->orderBy('created_at', 'desc')->get();
        $categories = $user->categories()->orderBy('name')->get();

        return Inertia::render('MyTask', [
            'tasks'      => $tasks->map(fn($t) => $this->formatTask($t)),
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

        $request->user()->tasks()->create($data);

        return back()->with('success', 'Task added successfully!');
    }

    public function update(Request $request, Task $task): RedirectResponse
    {
        $this->authorizeTask($task, $request->user());

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
        $this->authorizeTask($task, $request->user());

        $request->validate([
            'status' => 'required|in:not_started,in_progress,completed',
        ]);

        $task->update(['status' => $request->status]);

        return back();
    }

    public function destroy(Request $request, Task $task): RedirectResponse
    {
        $this->authorizeTask($task, $request->user());
        $task->delete();

        return back()->with('success', 'Task deleted.');
    }

    private function authorizeTask(Task $task, $user): void
    {
        abort_unless($task->username === $user->username, 403);
    }

    private function formatTask($task): array
    {
        return [
            'id'          => $task->id,
            'title'       => $task->title,
            'description' => $task->description,
            'status'      => $task->status,
            'priority'    => $task->priority,
            'deadline'    => $task->deadline?->format('Y-m-d H:i:s'),
            'is_vital'    => $task->is_vital,
            'created_at'  => $task->created_at?->toIso8601String(),
            'updated_at'  => $task->updated_at?->toIso8601String(),
            'category_id' => $task->category_id,
            'category'    => $task->category ? [
                'id'    => $task->category->id,
                'name'  => $task->category->name,
                'color' => $task->category->color,
            ] : null,
        ];
    }
}

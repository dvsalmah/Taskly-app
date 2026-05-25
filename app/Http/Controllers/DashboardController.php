<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user  = $request->user();
        $tasks = $user->tasks()->with('category')->get();
        $total     = $tasks->count();
        $completed = $tasks->where('status', 'completed')->count();
        $inProg    = $tasks->where('status', 'in_progress')->count();
        $notStart  = $tasks->where('status', 'not_started')->count();

        $pctCompleted = $total > 0 ? round($completed / $total * 100) : 0;
        $pctProgress  = $total > 0 ? round($inProg    / $total * 100) : 0;
        $pctNotStart  = $total > 0 ? round($notStart  / $total * 100) : 0;

        $todoTasks = $tasks->where('status', '!=', 'completed')
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->map(fn($t) => $this->formatTask($t));

        $totalTodo = $tasks->where('status', '!=', 'completed')->count();

        $doneTasks = $tasks->where('status', 'completed')
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->map(fn($t) => $this->formatTask($t));

        return Inertia::render('Dashboard', [
            'stats' => [
                'total'        => $total,
                'completed'    => $completed,
                'inProgress'   => $inProg,
                'notStarted'   => $notStart,
                'pctCompleted' => $pctCompleted,
                'pctProgress'  => $pctProgress,
                'pctNotStart'  => $pctNotStart,
            ],
            'todoTasks'  => $todoTasks,
            'totalTodo'  => $totalTodo,
            'doneTasks'  => $doneTasks,
        ]);
    }

    private function formatTask($task): array
    {
        return [
            'id'           => $task->id,
            'title'        => $task->title,
            'description'  => $task->description,
            'status'       => $task->status,
            'priority'     => $task->priority,
            'deadline'     => $task->deadline?->format('Y-m-d H:i:s'),
            'is_vital'     => $task->is_vital,
            'created_at'   => $task->created_at?->toIso8601String(),
            'updated_at'   => $task->updated_at?->toIso8601String(),
            'category'     => $task->category ? [
                'id'    => $task->category->id,
                'name'  => $task->category->name,
                'color' => $task->category->color,
            ] : null,
        ];
    }
}

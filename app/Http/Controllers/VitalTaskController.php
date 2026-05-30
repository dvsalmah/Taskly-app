<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VitalTaskController extends Controller
{
    public function index(Request $request): Response
    {
        $user       = $request->user();
        $categories = $user->categories()->orderBy('name')->get();

        $ownTasks = $user->tasks()->with('category', 'collaborators')
            ->where('status', '!=', 'completed')
            ->get()
            ->filter(fn($t) => $t->is_vital)
            ->map(fn($t) => $this->formatTask($t, true));

        $collabTasks = $user->collaboratingTasks()->with('category', 'collaborators')
            ->where('status', '!=', 'completed')
            ->get()
            ->filter(fn($t) => $t->is_vital)
            ->map(fn($t) => $this->formatTask($t, false));

        $vitalTasks = collect()->merge($ownTasks)->merge($collabTasks)
            ->sortBy('deadline')
            ->values();

        return Inertia::render('VitalTask', [
            'vitalTasks' => $vitalTasks,
            'categories' => $categories->map(fn($c) => [
                'id'    => $c->id,
                'name'  => $c->name,
                'color' => $c->color,
            ]),
        ]);
    }

    private function formatTask($t, bool $isOwn): array
    {
        $isCollab = $t->collaborators()->exists() || !$isOwn;
        return [
            'id'          => $t->id,
            'title'       => $t->title,
            'description' => $t->description,
            'status'      => $t->status,
            'priority'    => $t->priority,
            'deadline'    => $t->deadline?->toIso8601String(),
            'is_vital'    => true,
            'is_collab'   => $isCollab,
            'is_author'   => $isOwn,
            'created_at'  => $t->created_at?->toIso8601String(),
            'updated_at'  => $t->updated_at?->toIso8601String(),
            'category_id' => $t->category_id,
            'category'    => $t->category ? [
                'id'    => $t->category->id,
                'name'  => $t->category->name,
                'color' => $t->category->color,
            ] : null,
        ];
    }
}

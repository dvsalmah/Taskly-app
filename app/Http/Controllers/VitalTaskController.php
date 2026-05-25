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

        $vitalTasks = $user->tasks()
            ->with('category')
            ->where('status', '!=', 'completed')
            ->orderBy('deadline')
            ->get()
            ->filter(fn($t) => $t->is_vital)
            ->values()
            ->map(fn($t) => [
                'id'          => $t->id,
                'title'       => $t->title,
                'description' => $t->description,
                'status'      => $t->status,
                'priority'    => $t->priority,
                'deadline'    => $t->deadline?->toIso8601String(),
                'is_vital'    => true,
                'created_at'  => $t->created_at?->toIso8601String(),
                'updated_at'  => $t->updated_at?->toIso8601String(),
                'category_id' => $t->category_id,
                'category'    => $t->category ? [
                    'id'    => $t->category->id,
                    'name'  => $t->category->name,
                    'color' => $t->category->color,
                ] : null,
            ]);

        return Inertia::render('VitalTask', [
            'vitalTasks' => $vitalTasks,
            'categories' => $categories->map(fn($c) => [
                'id'    => $c->id,
                'name'  => $c->name,
                'color' => $c->color,
            ]),
        ]);
    }
}

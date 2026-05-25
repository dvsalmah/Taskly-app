<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $user       = $request->user();
        $categories = $user->categories()->withCount('tasks')->orderBy('name')->get();

        return Inertia::render('TaskCategory', [
            'categories' => $categories->map(fn($c) => [
                'id'          => $c->id,
                'name'        => $c->name,
                'color'       => $c->color,
                'tasks_count' => $c->tasks_count,
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'  => 'required|string|max:100',
            'color' => 'required|string|max:20',
        ]);

        $request->user()->categories()->create($data);

        return back()->with('success', 'Category added!');
    }

    public function destroy(Request $request, Category $category): RedirectResponse
    {
        abort_unless($category->username === $request->user()->username, 403);

        // Null out category_id on related tasks (mirrors original PHP behaviour)
        $category->tasks()->update(['category_id' => null]);
        $category->delete();

        return back()->with('success', 'Category deleted.');
    }
}

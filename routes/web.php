<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HelpController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\VitalTaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', fn() => redirect()->route('login'));

Route::middleware('auth')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // My Task
    Route::get('/my-task',                   [TaskController::class, 'index'])->name('my-task');
    Route::post('/my-task',                  [TaskController::class, 'store'])->name('task.store');
    Route::patch('/my-task/{task}',          [TaskController::class, 'update'])->name('task.update');
    Route::delete('/my-task/{task}',         [TaskController::class, 'destroy'])->name('task.destroy');
    Route::patch('/my-task/{task}/status',   [TaskController::class, 'updateStatus'])->name('task.status');

    // Vital Task
    Route::get('/vital-task', [VitalTaskController::class, 'index'])->name('vital-task');

    // Task Categories
    Route::get('/task-category',              [CategoryController::class, 'index'])->name('task-category');
    Route::post('/task-category',             [CategoryController::class, 'store'])->name('category.store');
    Route::delete('/task-category/{category}',[CategoryController::class, 'destroy'])->name('category.destroy');

    // Help
    Route::get('/help', [HelpController::class, 'index'])->name('help');

    // Profile
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile',   [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

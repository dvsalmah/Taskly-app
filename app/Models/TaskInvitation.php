<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaskInvitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'requester_id',
        'status',
        'read',
    ];

    protected $casts = [
        'read' => 'boolean',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function requester()
    {
        return $this->belongsTo(User::class, 'requester_id');
    }
}

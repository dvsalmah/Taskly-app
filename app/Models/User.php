<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory, Notifiable;
    public $timestamps = false;
    protected $fillable = [
        'username',
        'first_name',
        'last_name',
        'email',
        'password',
        'contact',
        'position',
        'photo',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'full_name',
        'photo_url',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class, 'username', 'username');
    }

    public function collaboratingTasks()
    {
        return $this->belongsToMany(Task::class, 'task_collaborators')->withTimestamps();
    }

    /**
     * Computed full name attribute.
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Resolved photo URL (storage or default avatar).
     */
    public function getPhotoUrlAttribute(): string
    {
        if (empty($this->photo)) {
            return 'https://i.pravatar.cc/150?img=8';
        }
        if (str_starts_with($this->photo, 'http')) {
            return $this->photo;
        }
        return asset('storage/' . $this->photo);
    }
}

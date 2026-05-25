<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'priority',
        'status',
        'deadline',
    ];

    protected $casts = [
        'deadline' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getIsVitalAttribute(): bool
    {
        if ($this->status === 'completed') {
            return false;
        }

        if ($this->priority === 'high') {
            return true;
        }

        if (!is_null($this->deadline)) {
            if ($this->deadline->isBetween(now()->subHours(24), now()->addHours(48))) {
                return true;
            }
        }

        return false;
    }

    public function getDeadlineLabelAttribute(): string
    {
        if (is_null($this->deadline)) {
            return '';
        }
        $diff = now()->diffInSeconds($this->deadline, false); // negative = past
        if ($diff < -86400)  return 'Overdue';
        if ($diff < 0)       return 'Due today (overdue)';
        if ($diff < 3600)    return 'Due in ' . ceil($diff / 60) . ' min';
        if ($diff < 86400)   return 'Due in ' . ceil($diff / 3600) . ' hr';
        if ($diff < 172800)  return 'Due tomorrow';
        return 'Due ' . $this->deadline->format('d M Y, H:i');
    }

    public static function timeAgo(?string $datetime): string
    {
        if (!$datetime) return '';
        return Carbon::parse($datetime)->diffForHumans();
    }
}

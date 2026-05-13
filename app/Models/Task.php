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

    /**
     * A task is "vital" when:
     *  - priority is high, AND
     *  - not completed, AND
     *  - (has no deadline OR deadline is within 48 hours or overdue by <24 h)
     */
    public function getIsVitalAttribute(): bool
    {
        if ($this->status === 'completed') {
            return false;
        }
        if ($this->priority !== 'high') {
            return false;
        }
        if (is_null($this->deadline)) {
            return true; // high priority, no deadline → vital
        }
        $diff = $this->deadline->diffInSeconds(now(), false); // positive = past
        // within next 48 h or overdue by < 24 h
        return $this->deadline->diffInHours(now()) <= 48 || ($diff > 0 && $diff < 86400);
    }

    /**
     * Human-readable deadline countdown (mirrors PHP deadlineLabel()).
     */
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

    /**
     * Human-readable "time ago" for created_at/updated_at.
     */
    public static function timeAgo(?string $datetime): string
    {
        if (!$datetime) return '';
        return Carbon::parse($datetime)->diffForHumans();
    }
}

<?php

namespace Tests\Unit;

use App\Models\Task;
use Carbon\Carbon;
use Tests\TestCase;

class TaskUnitTest extends TestCase
{
    public function test_task_is_vital_if_priority_is_high()
    {
        $task = new Task([
            'status' => 'not_started',
            'priority' => 'high',
            'deadline' => null,
        ]);

        $this->assertTrue($task->is_vital);
    }

   public function test_task_is_not_vital_if_completed_even_if_priority_is_high()
    {
        $task = new Task([
            'status' => 'completed',
            'priority' => 'high',
            'deadline' => null,
        ]);

        $this->assertFalse($task->is_vital);
    }
public function test_task_is_vital_if_deadline_is_near()
    {
        $task = new Task([
            'status' => 'not_started',
            'priority' => 'low',
            'deadline' => Carbon::now()->addHours(24),
        ]);

        $this->assertTrue($task->is_vital);
    }
}
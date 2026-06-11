<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollabFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_join_task_with_invalid_code()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->from('/my-task')
            ->post('/collab/join', [
                'code' => 'XYZ999',
            ]);

        $response->assertSessionHasErrors('code');
    }

    public function test_user_cannot_join_their_own_task()
    {
        $user = User::factory()->create();
        Task::create([
            'user_id'       => $user->id,
            'title'         => 'Tugas Mandiri',
            'priority'      => 'medium',
            'status'        => 'not_started',
            'referral_code' => 'own123',
        ]);

        $response = $this->actingAs($user)
            ->from('/my-task')
            ->post('/collab/join', [
                'code' => 'own123',
            ]);

        $response->assertSessionHasErrors('code');
        $this->assertEquals(
            'You cannot join your own task.',
            session('errors')->first('code')
        );
    }
}
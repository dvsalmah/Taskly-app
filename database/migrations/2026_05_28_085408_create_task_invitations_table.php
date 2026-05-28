<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_invitations', function (Blueprint $table) {
            $table->id();
            $table->integer('task_id');
            $table->integer('requester_id');
            $table->enum('status', ['pending', 'accepted', 'declined'])->default('pending');
            $table->boolean('read')->default(false);
            $table->timestamps();

            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->foreign('requester_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_invitations');
    }
};

<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'user' => [
                'id'         => $request->user()->id,
                'username'   => $request->user()->username,
                'first_name' => $request->user()->first_name,
                'last_name'  => $request->user()->last_name,
                'email'      => $request->user()->email,
                'contact'    => $request->user()->contact,
                'position'   => $request->user()->position,
                'photo_url'  => $request->user()->photo_url,
            ],
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo from storage (if local)
            if ($user->photo && !str_starts_with($user->photo, 'http')) {
                Storage::disk('public')->delete($user->photo);
            }
            $path = $request->file('photo')->store('uploads', 'public');
            $user->photo = $path;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('success', 'Profile updated successfully.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}

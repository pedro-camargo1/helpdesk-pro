<?php

namespace App\Http\Controllers;

// ─────────────────────────────────────────────
// HelpDesk Pro — User Controller
// List, show, update users; avatar upload
// ─────────────────────────────────────────────

use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * List all users with optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        if ($role = $request->get('role')) {
            $query->where('role', $role);
        }

        $users = $query->orderBy('name')->paginate(20);

        return response()->json([
            'data' => UserResource::collection($users),
            'meta' => [
                'total'        => $users->total(),
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
            ],
        ]);
    }

    /**
     * Get a single user.
     */
    public function show(User $user): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($user),
        ]);
    }

    /**
     * Update user profile (own profile or admin updating anyone).
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $authUser = $request->user();

        // Only admin can update other users
        if ($authUser->id !== $user->id && ! $authUser->isAdmin()) {
            return response()->json(['message' => 'Sem permissão.'], 403);
        }

        $rules = [
            'name'       => ['sometimes', 'string', 'min:2', 'max:100'],
            'email'      => ['sometimes', 'email', "unique:users,email,{$user->id}"],
            'department' => ['sometimes', 'nullable', 'string', 'max:100'],
            'phone'      => ['sometimes', 'nullable', 'string', 'max:20'],
            'bio'        => ['sometimes', 'nullable', 'string', 'max:500'],
        ];

        // Only admin can change roles
        if ($authUser->isAdmin()) {
            $rules['role'] = ['sometimes', 'in:admin,agent,user'];
        }

        $request->validate($rules);

        $user->update($request->only(['name', 'email', 'department', 'phone', 'bio', 'role']));

        // Handle password change
        if ($request->filled('password')) {
            $request->validate([
                'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            ]);
            $user->update(['password' => Hash::make($request->password)]);
        }

        return response()->json([
            'data'    => new UserResource($user->fresh()),
            'message' => 'Usuário atualizado com sucesso!',
        ]);
    }

    /**
     * Upload and store user avatar.
     */
    public function updateAvatar(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp'],
        ]);

        // Delete old avatar
        if ($user->avatar_url) {
            $oldPath = str_replace('/storage/', '', $user->avatar_url);
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('avatar')->store("avatars/{$user->id}", 'public');
        $url  = Storage::url($path);

        $user->update(['avatar_url' => $url]);

        return response()->json([
            'data'    => new UserResource($user->fresh()),
            'message' => 'Avatar atualizado!',
        ]);
    }

    /**
     * Create a new user (admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'       => ['required', 'string', 'min:2', 'max:100'],
            'email'      => ['required', 'email', 'unique:users,email'],
            'password'   => ['required', Password::min(8)->letters()->numbers()],
            'role'       => ['required', 'in:admin,agent,user'],
            'department' => ['nullable', 'string', 'max:100'],
        ]);

        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => $request->role,
            'department' => $request->department,
        ]);

        return response()->json([
            'data'    => new UserResource($user),
            'message' => 'Usuário criado com sucesso!',
        ], 201);
    }

    /**
     * Soft-delete a user (admin only).
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Você não pode excluir sua própria conta.'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'Usuário removido.']);
    }
}

<?php

namespace App\Http\Controllers;

// ─────────────────────────────────────────────
// HelpDesk Pro — Comment Controller
// Manages comments on tickets
// ─────────────────────────────────────────────

use App\Models\Comment;
use App\Models\Ticket;
use App\Http\Resources\CommentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * List all comments for a ticket.
     * Internal comments are hidden from non-agents.
     */
    public function index(Request $request, Ticket $ticket): JsonResponse
    {
        $user = $request->user();

        $comments = $ticket->comments()
            ->with('user')
            ->when(! $user->isAgent(), fn ($q) => $q->where('is_internal', false))
            ->get();

        return response()->json([
            'data' => CommentResource::collection($comments),
        ]);
    }

    /**
     * Add a new comment to a ticket.
     */
    public function store(Request $request, Ticket $ticket): JsonResponse
    {
        $request->validate([
            'body'        => ['required', 'string', 'min:1', 'max:5000'],
            'is_internal' => ['boolean'],
        ]);

        // Only agents/admins can post internal notes
        $isInternal = $request->boolean('is_internal') && $request->user()->isAgent();

        $comment = $ticket->comments()->create([
            'user_id'     => $request->user()->id,
            'body'        => $request->body,
            'is_internal' => $isInternal,
        ]);

        return response()->json([
            'data'    => new CommentResource($comment->load('user')),
            'message' => 'Comentário adicionado!',
        ], 201);
    }

    /**
     * Update a comment (author or admin only).
     */
    public function update(Request $request, Ticket $ticket, Comment $comment): JsonResponse
    {
        $user = $request->user();

        if ($comment->user_id !== $user->id && ! $user->isAdmin()) {
            return response()->json(['message' => 'Sem permissão.'], 403);
        }

        $request->validate([
            'body' => ['required', 'string', 'min:1', 'max:5000'],
        ]);

        $comment->update(['body' => $request->body]);

        return response()->json([
            'data'    => new CommentResource($comment->fresh('user')),
            'message' => 'Comentário atualizado!',
        ]);
    }

    /**
     * Delete a comment (author or admin only).
     */
    public function destroy(Request $request, Ticket $ticket, Comment $comment): JsonResponse
    {
        $user = $request->user();

        if ($comment->user_id !== $user->id && ! $user->isAdmin()) {
            return response()->json(['message' => 'Sem permissão.'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comentário removido.']);
    }
}

<?php

namespace App\Http\Controllers;

// ─────────────────────────────────────────────
// HelpDesk Pro — Ticket Controller
// Full CRUD with filtering, search, pagination
// ─────────────────────────────────────────────

use App\Models\Ticket;
use App\Models\TicketHistory;
use App\Http\Requests\CreateTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Http\Resources\TicketResource;
use App\Http\Resources\TicketDetailResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    /**
     * List tickets with filters, search and pagination.
     *
     * Query params:
     *   search      - full-text search on title/description
     *   status      - open | in_progress | resolved | closed
     *   priority    - low | medium | high | critical
     *   category_id - integer
     *   assignee_id - uuid
     *   sort_by     - created_at | updated_at | priority (default: created_at)
     *   sort_order  - asc | desc (default: desc)
     *   page        - integer (default: 1)
     *   per_page    - integer 1-100 (default: 15)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Ticket::with(['category', 'assignee', 'reporter'])
            ->withCount('comments');

        // ── Full-text search ──
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%")
                  ->orWhere('id', 'ilike', "%{$search}%");
            });
        }

        // ── Status filter ──
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        // ── Priority filter ──
        if ($priority = $request->get('priority')) {
            $query->where('priority', $priority);
        }

        // ── Category filter ──
        if ($categoryId = $request->get('category_id')) {
            $query->where('category_id', $categoryId);
        }

        // ── Assignee filter ──
        if ($assigneeId = $request->get('assignee_id')) {
            if ($assigneeId === 'me') {
                $query->where('assignee_id', $request->user()->id);
            } else {
                $query->where('assignee_id', $assigneeId);
            }
        }

        // ── Sorting ──
        $sortBy    = in_array($request->get('sort_by'), ['created_at', 'updated_at', 'priority'])
            ? $request->get('sort_by')
            : 'created_at';

        $sortOrder = $request->get('sort_order', 'desc') === 'asc' ? 'asc' : 'desc';

        // Priority needs custom ordering (critical > high > medium > low)
        if ($sortBy === 'priority') {
            $query->orderByRaw("
                CASE priority
                    WHEN 'critical' THEN 4
                    WHEN 'high'     THEN 3
                    WHEN 'medium'   THEN 2
                    WHEN 'low'      THEN 1
                END {$sortOrder}
            ");
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $perPage = min((int) $request->get('per_page', 15), 100);

        $tickets = $query->paginate($perPage);

        return response()->json([
            'data' => TicketResource::collection($tickets),
            'meta' => [
                'current_page' => $tickets->currentPage(),
                'from'         => $tickets->firstItem(),
                'last_page'    => $tickets->lastPage(),
                'per_page'     => $tickets->perPage(),
                'to'           => $tickets->lastItem(),
                'total'        => $tickets->total(),
            ],
            'links' => [
                'first' => $tickets->url(1),
                'last'  => $tickets->url($tickets->lastPage()),
                'prev'  => $tickets->previousPageUrl(),
                'next'  => $tickets->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Create a new ticket.
     */
    public function store(CreateTicketRequest $request): JsonResponse
    {
        $ticket = DB::transaction(function () use ($request) {
            $ticket = Ticket::create([
                'title'       => $request->title,
                'description' => $request->description,
                'priority'    => $request->priority,
                'status'      => 'open',
                'category_id' => $request->category_id,
                'assignee_id' => $request->assignee_id,
                'reporter_id' => $request->user()->id,
            ]);

            // Log creation in history
            TicketHistory::create([
                'ticket_id' => $ticket->id,
                'user_id'   => $request->user()->id,
                'action'    => 'created',
            ]);

            return $ticket;
        });

        return response()->json([
            'data'    => new TicketDetailResource($ticket->load(['category', 'assignee', 'reporter'])),
            'message' => 'Chamado criado com sucesso!',
        ], 201);
    }

    /**
     * Get a single ticket with full details.
     */
    public function show(Ticket $ticket): JsonResponse
    {
        $ticket->load(['category', 'assignee', 'reporter', 'comments.user', 'history.user']);

        return response()->json([
            'data' => new TicketDetailResource($ticket),
        ]);
    }

    /**
     * Update an existing ticket.
     */
    public function update(UpdateTicketRequest $request, Ticket $ticket): JsonResponse
    {
        $oldValues = $ticket->only(['status', 'priority', 'assignee_id']);

        DB::transaction(function () use ($request, $ticket, $oldValues) {
            $ticket->update($request->validated());

            // Track what changed in history
            foreach (['status', 'priority', 'assignee_id'] as $field) {
                if (isset($request->$field) && $oldValues[$field] !== $request->$field) {
                    TicketHistory::create([
                        'ticket_id'  => $ticket->id,
                        'user_id'    => $request->user()->id,
                        'action'     => "changed_{$field}",
                        'from_value' => $oldValues[$field],
                        'to_value'   => $request->$field,
                    ]);
                }
            }
        });

        return response()->json([
            'data'    => new TicketDetailResource($ticket->fresh(['category', 'assignee', 'reporter'])),
            'message' => 'Chamado atualizado com sucesso!',
        ]);
    }

    /**
     * Delete a ticket (admin or reporter only).
     */
    public function destroy(Request $request, Ticket $ticket): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'admin' && $ticket->reporter_id !== $user->id) {
            return response()->json([
                'message' => 'Sem permissão para excluir este chamado.',
            ], 403);
        }

        $ticket->delete();

        return response()->json([
            'message' => 'Chamado excluído com sucesso.',
        ]);
    }
}

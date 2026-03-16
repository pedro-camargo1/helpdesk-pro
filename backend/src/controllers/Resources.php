<?php

namespace App\Http\Resources;

// ─────────────────────────────────────────────
// HelpDesk Pro — API Resources
// Transform Eloquent models into JSON responses
// ─────────────────────────────────────────────

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// ── UserResource ──────────────────────────────

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'avatar_url' => $this->avatar_url,
            'role'       => $this->role,
            'department' => $this->department,
            'phone'      => $this->phone,
            'bio'        => $this->bio,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

// ── CategoryResource ──────────────────────────

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'    => $this->id,
            'name'  => $this->name,
            'color' => $this->color,
            'icon'  => $this->icon,
        ];
    }
}

// ── TicketResource (list view — lighter) ─────

class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'description'    => $this->description,
            'status'         => $this->status,
            'priority'       => $this->priority,
            'category'       => new CategoryResource($this->whenLoaded('category')),
            'reporter'       => new UserResource($this->whenLoaded('reporter')),
            'assignee'       => new UserResource($this->whenLoaded('assignee')),
            'comments_count' => $this->comments_count ?? 0,
            'created_at'     => $this->created_at?->toISOString(),
            'updated_at'     => $this->updated_at?->toISOString(),
        ];
    }
}

// ── TicketDetailResource (detail view) ───────

class TicketDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'description'    => $this->description,
            'status'         => $this->status,
            'priority'       => $this->priority,
            'category'       => new CategoryResource($this->whenLoaded('category')),
            'reporter'       => new UserResource($this->whenLoaded('reporter')),
            'assignee'       => new UserResource($this->whenLoaded('assignee')),
            'comments'       => CommentResource::collection($this->whenLoaded('comments')),
            'history'        => TicketHistoryResource::collection($this->whenLoaded('history')),
            'comments_count' => $this->comments_count ?? $this->comments->count(),
            'created_at'     => $this->created_at?->toISOString(),
            'updated_at'     => $this->updated_at?->toISOString(),
        ];
    }
}

// ── CommentResource ───────────────────────────

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'ticket_id'   => $this->ticket_id,
            'user'        => new UserResource($this->whenLoaded('user')),
            'body'        => $this->body,
            'is_internal' => $this->is_internal,
            'created_at'  => $this->created_at?->toISOString(),
            'updated_at'  => $this->updated_at?->toISOString(),
        ];
    }
}

// ── TicketHistoryResource ─────────────────────

class TicketHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'ticket_id'   => $this->ticket_id,
            'user'        => new UserResource($this->whenLoaded('user')),
            'action'      => $this->action,
            'description' => $this->description, // computed attribute
            'from_value'  => $this->from_value,
            'to_value'    => $this->to_value,
            'created_at'  => $this->created_at?->toISOString(),
        ];
    }
}

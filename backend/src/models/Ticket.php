<?php

namespace App\Models;

// ─────────────────────────────────────────────
// Ticket Model
// ─────────────────────────────────────────────

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'status',       // open | in_progress | resolved | closed
        'priority',     // low | medium | high | critical
        'category_id',
        'assignee_id',
        'reporter_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ── Relationships ──

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->orderBy('created_at');
    }

    public function history(): HasMany
    {
        return $this->hasMany(TicketHistory::class)->orderBy('created_at', 'desc');
    }

    // ── Auto-generate readable ID prefix ──

    protected static function booted(): void
    {
        static::creating(function (Ticket $ticket) {
            // Generates TK-XXXX style readable IDs stored separately
            // The UUID is the primary key; display_id is for human reference
        });
    }
}

// ─────────────────────────────────────────────
// Category Model
// ─────────────────────────────────────────────

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'color',  // hex color for UI badges
        'icon',   // icon name string (e.g., "server", "lock")
    ];

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }
}

// ─────────────────────────────────────────────
// Comment Model
// ─────────────────────────────────────────────

class Comment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'body',
        'is_internal', // true = only agents see this comment
    ];

    protected $casts = [
        'is_internal' => 'boolean',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }
}

// ─────────────────────────────────────────────
// TicketHistory Model
// Audit log of all changes to a ticket
// ─────────────────────────────────────────────

class TicketHistory extends Model
{
    use HasFactory;

    public const UPDATED_AT = null; // no updated_at needed

    protected $fillable = [
        'ticket_id',
        'user_id',
        'action',      // created | changed_status | changed_priority | changed_assignee
        'from_value',
        'to_value',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    // Human-readable description of the action
    public function getDescriptionAttribute(): string
    {
        return match ($this->action) {
            'created'           => 'abriu este chamado',
            'changed_status'    => "alterou o status de \"{$this->from_value}\" para \"{$this->to_value}\"",
            'changed_priority'  => "alterou a prioridade de \"{$this->from_value}\" para \"{$this->to_value}\"",
            'changed_assignee'  => 'reatribuiu o chamado',
            default             => $this->action,
        };
    }
}

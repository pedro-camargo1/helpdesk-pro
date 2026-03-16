<?php

namespace App\Http\Controllers;

// ─────────────────────────────────────────────
// HelpDesk Pro — Dashboard Controller
// Aggregated stats and chart data
// ─────────────────────────────────────────────

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get summary KPI statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        $now       = Carbon::now();
        $weekStart = $now->copy()->startOfWeek();
        $prevWeek  = $weekStart->copy()->subWeek();

        // Current week tickets
        $thisWeek = Ticket::where('created_at', '>=', $weekStart)->count();
        $lastWeek = Ticket::whereBetween('created_at', [$prevWeek, $weekStart])->count();

        // Change percentage
        $changePercent = $lastWeek > 0
            ? round((($thisWeek - $lastWeek) / $lastWeek) * 100, 1)
            : 100.0;

        // Average resolution time in hours (only resolved/closed)
        $avgResolution = Ticket::whereIn('status', ['resolved', 'closed'])
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600) as avg_hours')
            ->value('avg_hours');

        return response()->json([
            'data' => [
                'total_tickets'          => Ticket::count(),
                'open_tickets'           => Ticket::where('status', 'open')->count(),
                'in_progress_tickets'    => Ticket::where('status', 'in_progress')->count(),
                'resolved_tickets'       => Ticket::where('status', 'resolved')->count(),
                'closed_tickets'         => Ticket::where('status', 'closed')->count(),
                'avg_resolution_hours'   => round($avgResolution ?? 0, 1),
                'tickets_this_week'      => $thisWeek,
                'tickets_change_percent' => $changePercent,
            ],
        ]);
    }

    /**
     * Get chart datasets.
     */
    public function charts(Request $request): JsonResponse
    {
        // ── Weekly trend (last 7 days) ──
        $weeklyTrend = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);

            return [
                'date'     => $date->format('D'),
                'opened'   => Ticket::whereDate('created_at', $date)->count(),
                'resolved' => Ticket::whereDate('updated_at', $date)
                    ->where('status', 'resolved')->count(),
                'closed'   => Ticket::whereDate('updated_at', $date)
                    ->where('status', 'closed')->count(),
            ];
        });

        // ── Priority breakdown ──
        $total = Ticket::count() ?: 1;
        $priorityBreakdown = Ticket::selectRaw('priority, COUNT(*) as count')
            ->groupBy('priority')
            ->get()
            ->map(fn ($row) => [
                'priority'   => $row->priority,
                'count'      => $row->count,
                'percentage' => round(($row->count / $total) * 100, 1),
            ]);

        // ── Category breakdown ──
        $categoryBreakdown = Ticket::join('categories', 'tickets.category_id', '=', 'categories.id')
            ->selectRaw('categories.name, categories.color, COUNT(*) as count')
            ->groupBy('categories.name', 'categories.color')
            ->get()
            ->map(fn ($row) => [
                'category' => $row->name,
                'count'    => $row->count,
                'color'    => $row->color,
            ]);

        // ── Agent performance ──
        $agentPerformance = User::where('role', 'agent')
            ->withCount(['assignedTickets as resolved' => function ($q) {
                $q->where('status', 'resolved');
            }])
            ->with('assignedTickets')
            ->get()
            ->map(fn ($agent) => [
                'user'         => [
                    'id'         => $agent->id,
                    'name'       => $agent->name,
                    'avatar_url' => $agent->avatar_url,
                ],
                'resolved'     => $agent->resolved,
                'avg_hours'    => 8.4, // placeholder
                'satisfaction' => 4.2, // placeholder
            ])
            ->sortByDesc('resolved')
            ->values();

        return response()->json([
            'data' => [
                'weekly_trend'       => $weeklyTrend,
                'priority_breakdown' => $priorityBreakdown,
                'category_breakdown' => $categoryBreakdown,
                'agent_performance'  => $agentPerformance,
            ],
        ]);
    }
}

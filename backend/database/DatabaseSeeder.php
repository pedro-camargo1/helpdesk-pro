<?php

namespace Database\Seeders;

// ─────────────────────────────────────────────
// HelpDesk Pro — Database Seeder
// Populates demo data for development/portfolio
// Run: php artisan db:seed
// ─────────────────────────────────────────────

use App\Models\Category;
use App\Models\Comment;
use App\Models\Ticket;
use App\Models\TicketHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🌱 Seeding HelpDesk Pro database...');

        // ── Categories ────────────────────────
        $this->command->info('  → Categories...');
        $categories = [
            ['name' => 'Infraestrutura', 'color' => '#6366f1', 'icon' => 'server'],
            ['name' => 'Autenticação',   'color' => '#f59e0b', 'icon' => 'lock'],
            ['name' => 'Relatórios',     'color' => '#22c55e', 'icon' => 'file-chart'],
            ['name' => 'Acessos',        'color' => '#14b8a6', 'icon' => 'key'],
            ['name' => 'Performance',    'color' => '#8b5cf6', 'icon' => 'zap'],
            ['name' => 'Banco de Dados', 'color' => '#ef4444', 'icon' => 'database'],
            ['name' => 'Interface',      'color' => '#ec4899', 'icon' => 'monitor'],
            ['name' => 'Outros',         'color' => '#64748b', 'icon' => 'tag'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['name' => $cat['name']], $cat);
        }

        $catIds = Category::pluck('id', 'name');

        // ── Users ─────────────────────────────
        $this->command->info('  → Users...');
        $password = Hash::make('password');

        $admin = User::firstOrCreate(['email' => 'admin@helpdesk.pro'], [
            'name' => 'Admin HelpDesk', 'password' => $password,
            'role' => 'admin', 'department' => 'TI',
        ]);

        $agent1 = User::firstOrCreate(['email' => 'agent@helpdesk.pro'], [
            'name' => 'Ana Oliveira', 'password' => $password,
            'role' => 'agent', 'department' => 'Suporte',
        ]);

        $agent2 = User::firstOrCreate(['email' => 'rafael@helpdesk.pro'], [
            'name' => 'Rafael Costa', 'password' => $password,
            'role' => 'agent', 'department' => 'Suporte',
        ]);

        $user1 = User::firstOrCreate(['email' => 'user@helpdesk.pro'], [
            'name' => 'Carlos Silva', 'password' => $password,
            'role' => 'user', 'department' => 'Financeiro',
        ]);

        $user2 = User::firstOrCreate(['email' => 'lucia@helpdesk.pro'], [
            'name' => 'Lucia Mendes', 'password' => $password,
            'role' => 'user', 'department' => 'RH',
        ]);

        $user3 = User::firstOrCreate(['email' => 'pedro@helpdesk.pro'], [
            'name' => 'Pedro Alves', 'password' => $password,
            'role' => 'user', 'department' => 'Comercial',
        ]);

        // ── Tickets ───────────────────────────
        $this->command->info('  → Tickets...');

        $ticketsData = [
            [
                'title'       => 'Servidor de produção fora do ar após deploy',
                'description' => "O servidor principal está retornando 503 para todos os usuários.\n\nÚltimo deploy: build #847 às 13h45.\nLogs: upstream connect() failed (111: Connection refused)",
                'status'      => 'in_progress',
                'priority'    => 'critical',
                'category_id' => $catIds['Infraestrutura'],
                'reporter_id' => $user1->id,
                'assignee_id' => $agent1->id,
                'created_at'  => Carbon::now()->subHours(2),
            ],
            [
                'title'       => 'Usuário não consegue fazer login após atualização',
                'description' => "Desde a atualização de ontem às 22h, recebo erro 401 ao tentar logar.\nJá limpei cache e cookies, o problema persiste.",
                'status'      => 'open',
                'priority'    => 'high',
                'category_id' => $catIds['Autenticação'],
                'reporter_id' => $user2->id,
                'assignee_id' => null,
                'created_at'  => Carbon::now()->subHours(5),
            ],
            [
                'title'       => 'Exportação de PDF no módulo financeiro não funciona',
                'description' => "Ao clicar em 'Exportar PDF' na tela de relatórios, nada acontece.\nTestado nos navegadores Chrome, Firefox e Edge.",
                'status'      => 'open',
                'priority'    => 'medium',
                'category_id' => $catIds['Relatórios'],
                'reporter_id' => $user1->id,
                'assignee_id' => $agent2->id,
                'created_at'  => Carbon::now()->subHours(8),
            ],
            [
                'title'       => 'Liberar acesso ao módulo de RH para novo colaborador',
                'description' => "Precisamos liberar acesso ao sistema de RH para João Paulo Souza.\nMatrícula: JP-2024-0189.\nDepartamento: Engenharia.",
                'status'      => 'resolved',
                'priority'    => 'low',
                'category_id' => $catIds['Acessos'],
                'reporter_id' => $user2->id,
                'assignee_id' => $agent1->id,
                'created_at'  => Carbon::now()->subDays(1),
                'updated_at'  => Carbon::now()->subHours(4),
            ],
            [
                'title'       => 'Consultas no módulo de estoque levando mais de 30 segundos',
                'description' => "Qualquer pesquisa no módulo de estoque está extremamente lenta.\nAntes da atualização levava menos de 2 segundos.",
                'status'      => 'in_progress',
                'priority'    => 'medium',
                'category_id' => $catIds['Performance'],
                'reporter_id' => $user3->id,
                'assignee_id' => $agent2->id,
                'created_at'  => Carbon::now()->subDays(2),
            ],
            [
                'title'       => 'Integração com API do Correios retornando timeout',
                'description' => "O cálculo de frete no checkout está falhando.\nErro: Error: connect ETIMEDOUT 200.160.7.129:443",
                'status'      => 'closed',
                'priority'    => 'high',
                'category_id' => $catIds['Infraestrutura'],
                'reporter_id' => $user1->id,
                'assignee_id' => $agent2->id,
                'created_at'  => Carbon::now()->subDays(3),
                'updated_at'  => Carbon::now()->subDays(1),
            ],
        ];

        $tickets = [];
        foreach ($ticketsData as $data) {
            $tickets[] = Ticket::create($data);
        }

        // ── Comments ──────────────────────────
        $this->command->info('  → Comments & history...');

        Comment::create([
            'ticket_id'   => $tickets[0]->id,
            'user_id'     => $agent1->id,
            'body'        => 'Chamado recebido. Estou verificando os logs do servidor agora.',
            'is_internal' => false,
            'created_at'  => Carbon::now()->subHours(1.5),
        ]);

        Comment::create([
            'ticket_id'   => $tickets[0]->id,
            'user_id'     => $agent1->id,
            'body'        => '[INTERNO] Confirmado: o processo Node.js travou. Iniciando rollback para o build #846.',
            'is_internal' => true,
            'created_at'  => Carbon::now()->subHour(),
        ]);

        Comment::create([
            'ticket_id'   => $tickets[0]->id,
            'user_id'     => $user1->id,
            'body'        => 'O sistema está afetando mais de 200 usuários. Tem previsão de resolução?',
            'is_internal' => false,
            'created_at'  => Carbon::now()->subMinutes(30),
        ]);

        Comment::create([
            'ticket_id'   => $tickets[3]->id,
            'user_id'     => $agent1->id,
            'body'        => 'Acesso concedido ao sistema de RH. O colaborador pode logar agora.',
            'is_internal' => false,
            'created_at'  => Carbon::now()->subHours(5),
        ]);

        // ── History ───────────────────────────
        foreach ($tickets as $ticket) {
            TicketHistory::create([
                'ticket_id'  => $ticket->id,
                'user_id'    => $ticket->reporter_id,
                'action'     => 'created',
                'created_at' => $ticket->created_at,
            ]);

            if ($ticket->assignee_id) {
                TicketHistory::create([
                    'ticket_id'  => $ticket->id,
                    'user_id'    => $admin->id,
                    'action'     => 'changed_assignee',
                    'from_value' => null,
                    'to_value'   => $ticket->assignee_id,
                    'created_at' => $ticket->created_at->addMinutes(5),
                ]);
            }

            if (in_array($ticket->status, ['in_progress', 'resolved', 'closed'])) {
                TicketHistory::create([
                    'ticket_id'  => $ticket->id,
                    'user_id'    => $ticket->assignee_id ?? $admin->id,
                    'action'     => 'changed_status',
                    'from_value' => 'open',
                    'to_value'   => $ticket->status,
                    'created_at' => $ticket->created_at->addMinutes(15),
                ]);
            }
        }

        $this->command->info('✅ Seed complete!');
        $this->command->table(
            ['Role', 'Email', 'Senha'],
            [
                ['Admin',  'admin@helpdesk.pro',  'password'],
                ['Agente', 'agent@helpdesk.pro',  'password'],
                ['Agente', 'rafael@helpdesk.pro', 'password'],
                ['Usuário','user@helpdesk.pro',   'password'],
                ['Usuário','lucia@helpdesk.pro',  'password'],
            ]
        );
    }
}

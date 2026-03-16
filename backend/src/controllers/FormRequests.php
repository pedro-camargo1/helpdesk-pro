<?php

namespace App\Http\Requests;

// ─────────────────────────────────────────────
// HelpDesk Pro — Form Request Validators
// Centralized validation with clear messages
// ─────────────────────────────────────────────

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

// ── Login ─────────────────────────────────────

class LoginRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'    => 'O email é obrigatório.',
            'email.email'       => 'Informe um email válido.',
            'password.required' => 'A senha é obrigatória.',
        ];
    }
}

// ── Register ──────────────────────────────────

class RegisterRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'min:2', 'max:100'],
            'email'    => ['required', 'string', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'         => 'O nome é obrigatório.',
            'email.required'        => 'O email é obrigatório.',
            'email.unique'          => 'Este email já está em uso.',
            'password.required'     => 'A senha é obrigatória.',
            'password.confirmed'    => 'As senhas não coincidem.',
            'password.min'          => 'A senha deve ter pelo menos 8 caracteres.',
        ];
    }
}

// ── Update Profile ────────────────────────────

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'name'       => ['sometimes', 'string', 'min:2', 'max:100'],
            'email'      => ['sometimes', 'email', "unique:users,email,{$userId}"],
            'password'   => ['sometimes', 'confirmed', Password::min(8)->letters()->numbers()],
            'department' => ['sometimes', 'nullable', 'string', 'max:100'],
            'phone'      => ['sometimes', 'nullable', 'string', 'max:20'],
            'bio'        => ['sometimes', 'nullable', 'string', 'max:500'],
        ];
    }
}

// ── Create Ticket ─────────────────────────────

class CreateTicketRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'min:5', 'max:255'],
            'description' => ['required', 'string', 'min:10', 'max:5000'],
            'priority'    => ['required', 'in:low,medium,high,critical'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'assignee_id' => ['nullable', 'uuid', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => 'O título do chamado é obrigatório.',
            'title.min'            => 'O título deve ter pelo menos 5 caracteres.',
            'description.required' => 'A descrição é obrigatória.',
            'description.min'      => 'Descreva o problema com mais detalhes (mínimo 10 caracteres).',
            'priority.required'    => 'Selecione uma prioridade.',
            'priority.in'          => 'Prioridade inválida.',
            'category_id.required' => 'Selecione uma categoria.',
            'category_id.exists'   => 'Categoria não encontrada.',
            'assignee_id.exists'   => 'Usuário responsável não encontrado.',
        ];
    }
}

// ── Update Ticket ─────────────────────────────

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'       => ['sometimes', 'string', 'min:5', 'max:255'],
            'description' => ['sometimes', 'string', 'min:10', 'max:5000'],
            'status'      => ['sometimes', 'in:open,in_progress,resolved,closed'],
            'priority'    => ['sometimes', 'in:low,medium,high,critical'],
            'category_id' => ['sometimes', 'integer', 'exists:categories,id'],
            'assignee_id' => ['sometimes', 'nullable', 'uuid', 'exists:users,id'],
        ];
    }
}

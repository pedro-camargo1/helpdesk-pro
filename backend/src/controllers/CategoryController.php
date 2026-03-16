<?php

namespace App\Http\Controllers;

// ─────────────────────────────────────────────
// HelpDesk Pro — Category Controller
// ─────────────────────────────────────────────

use App\Models\Category;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('tickets')->orderBy('name')->get();

        return response()->json([
            'data' => CategoryResource::collection($categories),
        ]);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json([
            'data' => new CategoryResource($category->loadCount('tickets')),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'  => ['required', 'string', 'max:100', 'unique:categories,name'],
            'color' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'icon'  => ['required', 'string', 'max:50'],
        ]);

        $category = Category::create($request->only(['name', 'color', 'icon']));

        return response()->json([
            'data'    => new CategoryResource($category),
            'message' => 'Categoria criada!',
        ], 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $request->validate([
            'name'  => ['sometimes', 'string', 'max:100', "unique:categories,name,{$category->id}"],
            'color' => ['sometimes', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'icon'  => ['sometimes', 'string', 'max:50'],
        ]);

        $category->update($request->only(['name', 'color', 'icon']));

        return response()->json([
            'data'    => new CategoryResource($category->fresh()),
            'message' => 'Categoria atualizada!',
        ]);
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->tickets()->exists()) {
            return response()->json([
                'message' => 'Não é possível excluir uma categoria com chamados vinculados.',
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Categoria removida.']);
    }
}

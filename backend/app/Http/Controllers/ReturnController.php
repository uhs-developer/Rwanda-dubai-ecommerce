<?php

namespace App\Http\Controllers;

use App\Models\ProductReturn;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReturnController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductReturn::with(['user:id,name,email', 'product:id,name']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('return_number', 'ILIKE', "%{$search}%")
                  ->orWhere('description', 'ILIKE', "%{$search}%");
            });
        }

        $returns = $query->orderByDesc('requested_at')->paginate(20);

        return response()->json(['success' => true, 'data' => $returns]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'product_id' => ['required', 'exists:products,id'],
            'order_id' => ['nullable', 'integer'],
            'quantity' => ['required', 'integer', 'min:1'],
            'refund_amount' => ['nullable', 'numeric', 'min:0'],
            'reason' => ['required', Rule::in(['defective', 'wrong_item', 'not_as_described', 'changed_mind', 'damaged_shipping', 'other'])],
            'description' => ['nullable', 'string'],
            'return_method' => ['nullable', Rule::in(['refund', 'exchange', 'store_credit'])],
        ]);

        $ret = ProductReturn::create($validated);
        return response()->json(['success' => true, 'data' => $ret], 201);
    }

    public function update(Request $request, ProductReturn $return)
    {
        $validated = $request->validate([
            'status' => ['sometimes', Rule::in(['pending', 'approved', 'rejected', 'processing', 'completed'])],
            'refund_amount' => ['sometimes', 'numeric', 'min:0'],
            'admin_notes' => ['nullable', 'string'],
            'processed_at' => ['nullable', 'date'],
        ]);

        $return->update($validated);
        return response()->json(['success' => true, 'data' => $return]);
    }

    public function approve(ProductReturn $return)
    {
        $return->update(['status' => 'approved', 'processed_at' => now()]);
        return response()->json(['success' => true, 'data' => $return]);
    }

    public function reject(ProductReturn $return)
    {
        $return->update(['status' => 'rejected', 'processed_at' => now()]);
        return response()->json(['success' => true, 'data' => $return]);
    }

    public function complete(ProductReturn $return)
    {
        $return->update(['status' => 'completed', 'processed_at' => now()]);
        return response()->json(['success' => true, 'data' => $return]);
    }
}




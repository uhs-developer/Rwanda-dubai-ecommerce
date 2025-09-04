<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductBulkController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'product_ids' => ['required', 'array', 'min:1'],
            'product_ids.*' => ['integer', 'exists:products,id'],
            'operation' => ['required', 'string'],
            'value' => ['nullable'],
            'percent' => ['nullable', 'numeric'],
            'category_id' => ['nullable', 'integer'],
            'status' => ['nullable', 'string'],
            'stock_quantity' => ['nullable', 'integer'],
        ]);

        $ids = $validated['product_ids'];
        $operation = $validated['operation'];

        $count = 0;
        $query = Product::whereIn('id', $ids);

        switch ($operation) {
            case 'price_increase_percent':
                $percent = (float)($validated['percent'] ?? 0);
                $count = $query->update([
                    'price' => \DB::raw('ROUND(price * (1 + '.($percent/100).'), 2)')
                ]);
                break;
            case 'price_decrease_percent':
                $percent = (float)($validated['percent'] ?? 0);
                $count = $query->update([
                    'price' => \DB::raw('ROUND(price * (1 - '.($percent/100).'), 2)')
                ]);
                break;
            case 'set_category':
                $count = $query->update(['category_id' => $validated['category_id']]);
                break;
            case 'set_status_active':
                $count = $query->update(['is_active' => true]);
                break;
            case 'set_status_inactive':
                $count = $query->update(['is_active' => false]);
                break;
            case 'set_stock_quantity':
                $count = $query->update(['stock_quantity' => $validated['stock_quantity']]);
                break;
            default:
                return response()->json(['success' => false, 'message' => 'Unsupported operation'], 422);
        }

        return response()->json(['success' => true, 'data' => ['updated' => $count]]);
    }
}




<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $tenant = app('tenant');

        $query = User::where('tenant_id', $tenant->id)
            ->whereHas('roles', function($q) {
                $q->where('name', 'customer');
            })
            ->with('roles');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $customers = $query->latest()->paginate(20);

        return view('admin.customers.index', compact('customers'));
    }

    public function show(User $customer)
    {
        $tenant = app('tenant');

        if ($customer->tenant_id != $tenant->id) {
            abort(404);
        }

        $customer->load(['orders', 'addresses']);

        return view('admin.customers.show', compact('customer'));
    }

    public function edit(User $customer)
    {
        $tenant = app('tenant');

        if ($customer->tenant_id != $tenant->id) {
            abort(404);
        }

        return view('admin.customers.edit', compact('customer'));
    }

    public function update(Request $request, User $customer)
    {
        $tenant = app('tenant');

        if ($customer->tenant_id != $tenant->id) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $customer->id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $customer->update($validated);

        return redirect()->route('admin.customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy(User $customer)
    {
        $tenant = app('tenant');

        if ($customer->tenant_id != $tenant->id) {
            abort(404);
        }

        // Check if customer has orders
        if ($customer->orders()->count() > 0) {
            return back()->with('error', 'Cannot delete customer with orders.');
        }

        $customer->delete();

        return redirect()->route('admin.customers.index')
            ->with('success', 'Customer deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    /**
     * Get customer addresses
     */
    public function getAddresses()
    {
        try {
            $user = Auth::user();
            
            $addresses = Address::where('user_id', $user->id)
                ->orderBy('is_default', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'message' => 'Addresses retrieved successfully',
                'data' => $addresses,
                'meta' => [
                    'total' => $addresses->count(),
                    'per_page' => $addresses->count(),
                    'current_page' => 1,
                    'last_page' => 1
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve addresses: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new address
     */
    public function createAddress(Request $request)
    {
        try {
            $user = Auth::user();
            
            $validator = Validator::make($request->all(), [
                'type' => 'required|in:home,work,other',
                'is_default' => 'sometimes|boolean',
                'name' => 'required|string|max:255',
                'company' => 'nullable|string|max:255',
                'street' => 'required|string|max:500',
                'apartment' => 'nullable|string|max:255',
                'city' => 'required|string|max:100',
                'district' => 'required|string|max:100',
                'country' => 'required|string|max:100',
                'phone' => 'required|string|max:20',
                'postal_code' => 'nullable|string|max:20'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // If this is set as default, unset other defaults
            if ($request->is_default) {
                Address::where('user_id', $user->id)
                    ->update(['is_default' => false]);
            }
            
            $address = Address::create([
                'user_id' => $user->id,
                'type' => $request->type,
                'is_default' => $request->is_default ?? false,
                'name' => $request->name,
                'company' => $request->company,
                'street' => $request->street,
                'apartment' => $request->apartment,
                'city' => $request->city,
                'district' => $request->district,
                'country' => $request->country,
                'phone' => $request->phone,
                'postal_code' => $request->postal_code
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Address created successfully',
                'data' => $address
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create address: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update address
     */
    public function updateAddress(Request $request, $id)
    {
        try {
            $user = Auth::user();
            
            $address = Address::where('user_id', $user->id)
                ->where('id', $id)
                ->first();
            
            if (!$address) {
                return response()->json([
                    'success' => false,
                    'message' => 'Address not found'
                ], 404);
            }
            
            $validator = Validator::make($request->all(), [
                'type' => 'sometimes|in:home,work,other',
                'is_default' => 'sometimes|boolean',
                'name' => 'sometimes|string|max:255',
                'company' => 'nullable|string|max:255',
                'street' => 'sometimes|string|max:500',
                'apartment' => 'nullable|string|max:255',
                'city' => 'sometimes|string|max:100',
                'district' => 'sometimes|string|max:100',
                'country' => 'sometimes|string|max:100',
                'phone' => 'sometimes|string|max:20',
                'postal_code' => 'nullable|string|max:20'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // If this is set as default, unset other defaults
            if ($request->has('is_default') && $request->is_default) {
                Address::where('user_id', $user->id)
                    ->where('id', '!=', $id)
                    ->update(['is_default' => false]);
            }
            
            $address->update($request->only([
                'type', 'is_default', 'name', 'company', 'street', 
                'apartment', 'city', 'district', 'country', 'phone', 'postal_code'
            ]));
            
            return response()->json([
                'success' => true,
                'message' => 'Address updated successfully',
                'data' => $address->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update address: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete address
     */
    public function deleteAddress($id)
    {
        try {
            $user = Auth::user();
            
            $address = Address::where('user_id', $user->id)
                ->where('id', $id)
                ->first();
            
            if (!$address) {
                return response()->json([
                    'success' => false,
                    'message' => 'Address not found'
                ], 404);
            }
            
            $address->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Address deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete address: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Set default address
     */
    public function setDefaultAddress($id)
    {
        try {
            $user = Auth::user();
            
            $address = Address::where('user_id', $user->id)
                ->where('id', $id)
                ->first();
            
            if (!$address) {
                return response()->json([
                    'success' => false,
                    'message' => 'Address not found'
                ], 404);
            }
            
            // Unset all other defaults
            Address::where('user_id', $user->id)
                ->update(['is_default' => false]);
            
            // Set this one as default
            $address->update(['is_default' => true]);
            
            return response()->json([
                'success' => true,
                'message' => 'Default address updated successfully',
                'data' => $address->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to set default address: ' . $e->getMessage()
            ], 500);
        }
    }
}


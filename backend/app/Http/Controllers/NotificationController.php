<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    /**
     * Get customer notifications
     */
    public function getNotifications()
    {
        try {
            $user = Auth::user();
            
            // For now, return mock notifications
            // In a real application, you would have a notifications table
            $notifications = [
                [
                    'id' => 1,
                    'type' => 'order_update',
                    'title' => 'Order Status Update',
                    'message' => 'Your order #ORD-001 has been shipped and is on its way.',
                    'is_read' => false,
                    'created_at' => now()->subHours(2)->toISOString(),
                    'action_url' => '/orders/1'
                ],
                [
                    'id' => 2,
                    'type' => 'promotion',
                    'title' => 'Special Offer',
                    'message' => 'Get 20% off on your next order. Use code SAVE20.',
                    'is_read' => false,
                    'created_at' => now()->subDays(1)->toISOString(),
                    'action_url' => '/products'
                ],
                [
                    'id' => 3,
                    'type' => 'security',
                    'title' => 'Account Security',
                    'message' => 'Your password was changed successfully.',
                    'is_read' => true,
                    'created_at' => now()->subDays(3)->toISOString()
                ],
                [
                    'id' => 4,
                    'type' => 'general',
                    'title' => 'Welcome to Rwanda-Dubai Commerce',
                    'message' => 'Thank you for joining us! Explore our latest products and enjoy fast shipping to Rwanda.',
                    'is_read' => true,
                    'created_at' => now()->subDays(7)->toISOString(),
                    'action_url' => '/products'
                ]
            ];
            
            return response()->json([
                'success' => true,
                'message' => 'Notifications retrieved successfully',
                'data' => $notifications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve notifications: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark notification as read
     */
    public function markAsRead($id)
    {
        try {
            $user = Auth::user();
            
            // For now, just return success since we're using mock data
            // In a real application, you would update the notification in the database
            
            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notification as read: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        try {
            $user = Auth::user();
            
            // For now, just return success since we're using mock data
            // In a real application, you would update all notifications for the user
            
            return response()->json([
                'success' => true,
                'message' => 'All notifications marked as read'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark all notifications as read: ' . $e->getMessage()
            ], 500);
        }
    }
}


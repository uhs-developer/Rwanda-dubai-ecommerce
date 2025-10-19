<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add indexes for commonly queried columns that don't already have indexes
        
        // Users table - add missing indexes
        if (!$this->indexExists('users', 'users_email_index')) {
            Schema::table('users', function (Blueprint $table) {
                $table->index('email');
            });
        }
        
        if (!$this->indexExists('users', 'users_created_at_index')) {
            Schema::table('users', function (Blueprint $table) {
                $table->index('created_at');
            });
        }

        // Products table - add missing indexes
        if (!$this->indexExists('products', 'products_name_index')) {
            Schema::table('products', function (Blueprint $table) {
                $table->index('name');
            });
        }
        
        if (!$this->indexExists('products', 'products_sku_index')) {
            Schema::table('products', function (Blueprint $table) {
                $table->index('sku');
            });
        }
        
        if (!$this->indexExists('products', 'products_created_at_index')) {
            Schema::table('products', function (Blueprint $table) {
                $table->index('created_at');
            });
        }
        
        if (!$this->indexExists('products', 'products_updated_at_index')) {
            Schema::table('products', function (Blueprint $table) {
                $table->index('updated_at');
            });
        }

        // Orders table - add missing indexes
        if (!$this->indexExists('orders', 'orders_user_id_index')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->index('user_id');
            });
        }
        
        if (!$this->indexExists('orders', 'orders_customer_email_index')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->index('customer_email');
            });
        }
        
        if (!$this->indexExists('orders', 'orders_status_index')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->index('status');
            });
        }
        
        if (!$this->indexExists('orders', 'orders_is_paid_index')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->index('is_paid');
            });
        }
        
        if (!$this->indexExists('orders', 'orders_created_at_index')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->index('created_at');
            });
        }
        
        if (!$this->indexExists('orders', 'orders_paid_at_index')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->index('paid_at');
            });
        }

        // Order Items table - add missing indexes
        if (!$this->indexExists('order_items', 'order_items_order_id_index')) {
            Schema::table('order_items', function (Blueprint $table) {
                $table->index('order_id');
            });
        }
        
        if (!$this->indexExists('order_items', 'order_items_product_id_index')) {
            Schema::table('order_items', function (Blueprint $table) {
                $table->index('product_id');
            });
        }
        
        if (!$this->indexExists('order_items', 'order_items_product_name_index')) {
            Schema::table('order_items', function (Blueprint $table) {
                $table->index('product_name');
            });
        }

        // Cart Items table - add missing indexes
        if (!$this->indexExists('cart_items', 'cart_items_session_id_index')) {
            Schema::table('cart_items', function (Blueprint $table) {
                $table->index('session_id');
            });
        }
        
        if (!$this->indexExists('cart_items', 'cart_items_created_at_index')) {
            Schema::table('cart_items', function (Blueprint $table) {
                $table->index('created_at');
            });
        }

        // Wishlist Items table - add missing indexes
        if (!$this->indexExists('wishlist_items', 'wishlist_items_session_id_index')) {
            Schema::table('wishlist_items', function (Blueprint $table) {
                $table->index('session_id');
            });
        }
        
        if (!$this->indexExists('wishlist_items', 'wishlist_items_created_at_index')) {
            Schema::table('wishlist_items', function (Blueprint $table) {
                $table->index('created_at');
            });
        }

        // Categories table - add missing indexes
        if (!$this->indexExists('categories', 'categories_name_index')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->index('name');
            });
        }
        
        if (!$this->indexExists('categories', 'categories_created_at_index')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->index('created_at');
            });
        }

        // Subcategories table - add missing indexes
        if (!$this->indexExists('subcategories', 'subcategories_name_index')) {
            Schema::table('subcategories', function (Blueprint $table) {
                $table->index('name');
            });
        }
        
        if (!$this->indexExists('subcategories', 'subcategories_created_at_index')) {
            Schema::table('subcategories', function (Blueprint $table) {
                $table->index('created_at');
            });
        }

        // Brands table - add missing indexes
        if (!$this->indexExists('brands', 'brands_name_index')) {
            Schema::table('brands', function (Blueprint $table) {
                $table->index('name');
            });
        }
        
        if (!$this->indexExists('brands', 'brands_created_at_index')) {
            Schema::table('brands', function (Blueprint $table) {
                $table->index('created_at');
            });
        }

        // Addresses table - add missing indexes
        if (!$this->indexExists('addresses', 'addresses_type_index')) {
            Schema::table('addresses', function (Blueprint $table) {
                $table->index('type');
            });
        }
        
        if (!$this->indexExists('addresses', 'addresses_city_index')) {
            Schema::table('addresses', function (Blueprint $table) {
                $table->index('city');
            });
        }
        
        if (!$this->indexExists('addresses', 'addresses_district_index')) {
            Schema::table('addresses', function (Blueprint $table) {
                $table->index('district');
            });
        }

        // Promotions table - add missing indexes
        if (!$this->indexExists('promotions', 'promotions_name_index')) {
            Schema::table('promotions', function (Blueprint $table) {
                $table->index('name');
            });
        }
        
        if (!$this->indexExists('promotions', 'promotions_status_index')) {
            Schema::table('promotions', function (Blueprint $table) {
                $table->index('status');
            });
        }
        
        if (!$this->indexExists('promotions', 'promotions_starts_at_index')) {
            Schema::table('promotions', function (Blueprint $table) {
                $table->index('starts_at');
            });
        }
        
        if (!$this->indexExists('promotions', 'promotions_ends_at_index')) {
            Schema::table('promotions', function (Blueprint $table) {
                $table->index('ends_at');
            });
        }

        // Posts table - add missing indexes
        if (!$this->indexExists('posts', 'posts_title_index')) {
            Schema::table('posts', function (Blueprint $table) {
                $table->index('title');
            });
        }
        
        if (!$this->indexExists('posts', 'posts_status_index')) {
            Schema::table('posts', function (Blueprint $table) {
                $table->index('status');
            });
        }
        
        if (!$this->indexExists('posts', 'posts_author_id_index')) {
            Schema::table('posts', function (Blueprint $table) {
                $table->index('author_id');
            });
        }

        // Media Files table - add missing indexes
        if (!$this->indexExists('media_files', 'media_files_resource_type_index')) {
            Schema::table('media_files', function (Blueprint $table) {
                $table->index('resource_type');
            });
        }
        
        if (!$this->indexExists('media_files', 'media_files_format_index')) {
            Schema::table('media_files', function (Blueprint $table) {
                $table->index('format');
            });
        }
        
        if (!$this->indexExists('media_files', 'media_files_created_at_index')) {
            Schema::table('media_files', function (Blueprint $table) {
                $table->index('created_at');
            });
        }

        // Sessions table - add missing indexes
        if (!$this->indexExists('sessions', 'sessions_ip_address_index')) {
            Schema::table('sessions', function (Blueprint $table) {
                $table->index('ip_address');
            });
        }

        // Personal Access Tokens table - add missing indexes
        if (!$this->indexExists('personal_access_tokens', 'personal_access_tokens_created_at_index')) {
            Schema::table('personal_access_tokens', function (Blueprint $table) {
                $table->index('created_at');
            });
        }
        
        if (!$this->indexExists('personal_access_tokens', 'personal_access_tokens_last_used_at_index')) {
            Schema::table('personal_access_tokens', function (Blueprint $table) {
                $table->index('last_used_at');
            });
        }

        // Jobs table - add missing indexes
        if (!$this->indexExists('jobs', 'jobs_queue_index')) {
            Schema::table('jobs', function (Blueprint $table) {
                $table->index('queue');
            });
        }
        
        if (!$this->indexExists('jobs', 'jobs_attempts_index')) {
            Schema::table('jobs', function (Blueprint $table) {
                $table->index('attempts');
            });
        }
        
        if (!$this->indexExists('jobs', 'jobs_available_at_index')) {
            Schema::table('jobs', function (Blueprint $table) {
                $table->index('available_at');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop indexes if they exist
        $this->dropIndexIfExists('users', 'users_email_index');
        $this->dropIndexIfExists('users', 'users_created_at_index');
        
        $this->dropIndexIfExists('products', 'products_name_index');
        $this->dropIndexIfExists('products', 'products_sku_index');
        $this->dropIndexIfExists('products', 'products_created_at_index');
        $this->dropIndexIfExists('products', 'products_updated_at_index');
        
        $this->dropIndexIfExists('orders', 'orders_user_id_index');
        $this->dropIndexIfExists('orders', 'orders_customer_email_index');
        $this->dropIndexIfExists('orders', 'orders_status_index');
        $this->dropIndexIfExists('orders', 'orders_is_paid_index');
        $this->dropIndexIfExists('orders', 'orders_created_at_index');
        $this->dropIndexIfExists('orders', 'orders_paid_at_index');
        
        $this->dropIndexIfExists('order_items', 'order_items_order_id_index');
        $this->dropIndexIfExists('order_items', 'order_items_product_id_index');
        $this->dropIndexIfExists('order_items', 'order_items_product_name_index');
        
        $this->dropIndexIfExists('cart_items', 'cart_items_session_id_index');
        $this->dropIndexIfExists('cart_items', 'cart_items_created_at_index');
        
        $this->dropIndexIfExists('wishlist_items', 'wishlist_items_session_id_index');
        $this->dropIndexIfExists('wishlist_items', 'wishlist_items_created_at_index');
        
        $this->dropIndexIfExists('categories', 'categories_name_index');
        $this->dropIndexIfExists('categories', 'categories_created_at_index');
        
        $this->dropIndexIfExists('subcategories', 'subcategories_name_index');
        $this->dropIndexIfExists('subcategories', 'subcategories_created_at_index');
        
        $this->dropIndexIfExists('brands', 'brands_name_index');
        $this->dropIndexIfExists('brands', 'brands_created_at_index');
        
        $this->dropIndexIfExists('addresses', 'addresses_type_index');
        $this->dropIndexIfExists('addresses', 'addresses_city_index');
        $this->dropIndexIfExists('addresses', 'addresses_district_index');
        
        $this->dropIndexIfExists('promotions', 'promotions_name_index');
        $this->dropIndexIfExists('promotions', 'promotions_status_index');
        $this->dropIndexIfExists('promotions', 'promotions_starts_at_index');
        $this->dropIndexIfExists('promotions', 'promotions_ends_at_index');
        
        $this->dropIndexIfExists('posts', 'posts_title_index');
        $this->dropIndexIfExists('posts', 'posts_status_index');
        $this->dropIndexIfExists('posts', 'posts_author_id_index');
        
        $this->dropIndexIfExists('media_files', 'media_files_resource_type_index');
        $this->dropIndexIfExists('media_files', 'media_files_format_index');
        $this->dropIndexIfExists('media_files', 'media_files_created_at_index');
        
        $this->dropIndexIfExists('sessions', 'sessions_ip_address_index');
        
        $this->dropIndexIfExists('personal_access_tokens', 'personal_access_tokens_created_at_index');
        $this->dropIndexIfExists('personal_access_tokens', 'personal_access_tokens_last_used_at_index');
        
        $this->dropIndexIfExists('jobs', 'jobs_queue_index');
        $this->dropIndexIfExists('jobs', 'jobs_attempts_index');
        $this->dropIndexIfExists('jobs', 'jobs_available_at_index');
    }

    /**
     * Check if an index exists on a table
     */
    private function indexExists(string $table, string $indexName): bool
    {
        try {
            $indexes = DB::select("SHOW INDEX FROM {$table}");
            foreach ($indexes as $index) {
                if ($index->Key_name === $indexName) {
                    return true;
                }
            }
            return false;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Drop an index if it exists
     */
    private function dropIndexIfExists(string $table, string $indexName): void
    {
        if ($this->indexExists($table, $indexName)) {
            try {
                DB::statement("ALTER TABLE {$table} DROP INDEX {$indexName}");
            } catch (\Exception $e) {
                // Index might not exist, ignore error
            }
        }
    }
};
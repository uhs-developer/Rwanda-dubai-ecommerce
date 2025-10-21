<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop existing foreign key to modify column, then recreate it
        DB::statement('ALTER TABLE `wishlist_items` DROP FOREIGN KEY `wishlist_items_user_id_foreign`');
        DB::statement('ALTER TABLE `wishlist_items` MODIFY `user_id` BIGINT UNSIGNED NULL');
        DB::statement('ALTER TABLE `wishlist_items` ADD CONSTRAINT `wishlist_items_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to NOT NULL (will fail if nulls exist; ensure cleanup before down)
        DB::statement('ALTER TABLE `wishlist_items` DROP FOREIGN KEY `wishlist_items_user_id_foreign`');
        DB::statement('UPDATE `wishlist_items` SET `user_id` = 0 WHERE `user_id` IS NULL');
        DB::statement('ALTER TABLE `wishlist_items` MODIFY `user_id` BIGINT UNSIGNED NOT NULL');
        DB::statement('ALTER TABLE `wishlist_items` ADD CONSTRAINT `wishlist_items_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE');
    }
};













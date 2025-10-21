<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE `cart_items` DROP FOREIGN KEY `cart_items_user_id_foreign`');
        DB::statement('ALTER TABLE `cart_items` MODIFY `user_id` BIGINT UNSIGNED NULL');
        DB::statement('ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE `cart_items` DROP FOREIGN KEY `cart_items_user_id_foreign`');
        DB::statement('UPDATE `cart_items` SET `user_id` = 0 WHERE `user_id` IS NULL');
        DB::statement('ALTER TABLE `cart_items` MODIFY `user_id` BIGINT UNSIGNED NOT NULL');
        DB::statement('ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE');
    }
};













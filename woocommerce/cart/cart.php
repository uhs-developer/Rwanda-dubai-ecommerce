<?php
/**
 * Cart Page
 *
 * @package DubaiDirect_Rwanda
 * @version 1.0.0
 */

defined('ABSPATH') || exit;

do_action('woocommerce_before_cart'); ?>

<form class="woocommerce-cart-form" action="<?php echo esc_url(wc_get_cart_url()); ?>" method="post">
    <?php do_action('woocommerce_before_cart_table'); ?>

    <div class="cart-container">
        <div class="cart-content">
            
            <!-- Cart Items -->
            <div class="cart-items">
                <h2><?php echo esc_html__('Shopping Cart', 'dubaidirect-rwanda'); ?></h2>
                
                <?php if (!WC()->cart->is_empty()) : ?>
                    
                    <div class="cart-table">
                        <div class="cart-header">
                            <div class="cart-header-product"><?php echo esc_html__('Product', 'dubaidirect-rwanda'); ?></div>
                            <div class="cart-header-price"><?php echo esc_html__('Price', 'dubaidirect-rwanda'); ?></div>
                            <div class="cart-header-quantity"><?php echo esc_html__('Quantity', 'dubaidirect-rwanda'); ?></div>
                            <div class="cart-header-subtotal"><?php echo esc_html__('Subtotal', 'dubaidirect-rwanda'); ?></div>
                            <div class="cart-header-remove"></div>
                        </div>
                        
                        <?php do_action('woocommerce_before_cart_contents'); ?>
                        
                        <?php
                        foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
                            $_product = apply_filters('woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key);
                            $product_id = apply_filters('woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key);
                            
                            if ($_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters('woocommerce_cart_item_visible', true, $cart_item, $cart_item_key)) {
                                $product_permalink = apply_filters('woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink($cart_item) : '', $cart_item, $cart_item_key);
                                ?>
                                
                                <div class="cart-item" data-cart-item-key="<?php echo esc_attr($cart_item_key); ?>">
                                    
                                    <!-- Product Image & Info -->
                                    <div class="cart-item-product">
                                        <div class="cart-item-image">
                                            <?php
                                            $thumbnail = apply_filters('woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key);
                                            
                                            if (!$product_permalink) {
                                                echo $thumbnail; // WPCS: XSS ok.
                                            } else {
                                                printf('<a href="%s">%s</a>', esc_url($product_permalink), $thumbnail); // WPCS: XSS ok.
                                            }
                                            ?>
                                        </div>
                                        
                                        <div class="cart-item-details">
                                            <h3 class="cart-item-title">
                                                <?php
                                                if (!$product_permalink) {
                                                    echo wp_kses_post(apply_filters('woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key) . '&nbsp;');
                                                } else {
                                                    echo wp_kses_post(apply_filters('woocommerce_cart_item_name', sprintf('<a href="%s">%s</a>', esc_url($product_permalink), $_product->get_name()), $cart_item, $cart_item_key));
                                                }
                                                
                                                do_action('woocommerce_after_cart_item_name', $cart_item, $cart_item_key);
                                                
                                                // Meta data.
                                                echo wc_get_formatted_cart_item_data($cart_item); // WPCS: XSS ok.
                                                ?>
                                            </h3>
                                            
                                            <?php if ($_product->is_on_sale()) : ?>
                                                <span class="sale-badge"><?php echo esc_html__('Sale', 'dubaidirect-rwanda'); ?></span>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                    
                                    <!-- Price -->
                                    <div class="cart-item-price">
                                        <?php
                                        echo apply_filters('woocommerce_cart_item_price', WC()->cart->get_product_price($_product), $cart_item, $cart_item_key); // WPCS: XSS ok.
                                        ?>
                                    </div>
                                    
                                    <!-- Quantity -->
                                    <div class="cart-item-quantity">
                                        <?php
                                        if ($_product->is_sold_individually()) {
                                            $product_quantity = sprintf('1 <input type="hidden" name="cart[%s][qty]" value="1" />', $cart_item_key);
                                        } else {
                                            $product_quantity = woocommerce_quantity_input(
                                                array(
                                                    'input_name'   => "cart[{$cart_item_key}][qty]",
                                                    'input_value'  => $cart_item['quantity'],
                                                    'max_value'    => $_product->get_max_purchase_quantity(),
                                                    'min_value'    => '0',
                                                    'product_name' => $_product->get_name(),
                                                ),
                                                $_product,
                                                false
                                            );
                                        }
                                        
                                        echo apply_filters('woocommerce_cart_item_quantity', $product_quantity, $cart_item_key, $cart_item); // WPCS: XSS ok.
                                        ?>
                                    </div>
                                    
                                    <!-- Subtotal -->
                                    <div class="cart-item-subtotal">
                                        <?php
                                        echo apply_filters('woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal($_product, $cart_item['quantity']), $cart_item, $cart_item_key); // WPCS: XSS ok.
                                        ?>
                                    </div>
                                    
                                    <!-- Remove -->
                                    <div class="cart-item-remove">
                                        <?php
                                        echo apply_filters( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                                            'woocommerce_cart_item_remove_link',
                                            sprintf(
                                                '<a href="%s" class="remove" aria-label="%s" data-product_id="%s" data-product_sku="%s">&times;</a>',
                                                esc_url(wc_get_cart_remove_url($cart_item_key)),
                                                esc_html__('Remove this item', 'dubaidirect-rwanda'),
                                                esc_attr($product_id),
                                                esc_attr($_product->get_sku())
                                            ),
                                            $cart_item_key
                                        );
                                        ?>
                                    </div>
                                    
                                </div>
                                
                                <?php
                            }
                        }
                        ?>
                        
                        <?php do_action('woocommerce_cart_contents'); ?>
                        
                        <!-- Cart Actions -->
                        <div class="cart-actions">
                            <button type="submit" class="btn btn-secondary" name="update_cart" value="<?php esc_attr_e('Update cart', 'dubaidirect-rwanda'); ?>">
                                <?php esc_html_e('Update cart', 'dubaidirect-rwanda'); ?>
                            </button>
                            
                            <?php do_action('woocommerce_cart_actions'); ?>
                            
                            <?php wp_nonce_field('woocommerce-cart', 'woocommerce-cart-nonce'); ?>
                        </div>
                        
                        <?php do_action('woocommerce_after_cart_contents'); ?>
                        
                    </div>
                    
                <?php else : ?>
                    
                    <div class="cart-empty">
                        <div class="empty-cart-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </div>
                        <h3><?php echo esc_html__('Your cart is empty', 'dubaidirect-rwanda'); ?></h3>
                        <p><?php echo esc_html__('Looks like you haven\'t added any products to your cart yet.', 'dubaidirect-rwanda'); ?></p>
                        <a href="<?php echo esc_url(get_permalink(get_option('woocommerce_shop_page_id'))); ?>" class="btn btn-primary">
                            <?php echo esc_html__('Continue Shopping', 'dubaidirect-rwanda'); ?>
                        </a>
                    </div>
                    
                <?php endif; ?>
                
            </div>
            
            <!-- Cart Summary -->
            <?php if (!WC()->cart->is_empty()) : ?>
                <div class="cart-summary">
                    <div class="summary-card">
                        <h3><?php echo esc_html__('Order Summary', 'dubaidirect-rwanda'); ?></h3>
                        
                        <!-- Delivery Options -->
                        <div class="delivery-options">
                            <h4><?php echo esc_html__('Delivery Options', 'dubaidirect-rwanda'); ?></h4>
                            <div class="delivery-tiers">
                                <label class="delivery-option">
                                    <input type="radio" name="delivery_tier" value="express" checked>
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-name"><?php echo esc_html__('Express', 'dubaidirect-rwanda'); ?></span>
                                            <span class="option-price"><?php echo esc_html__('200-300%', 'dubaidirect-rwanda'); ?></span>
                                        </div>
                                        <span class="option-timeline"><?php echo esc_html__('1-2 Days', 'dubaidirect-rwanda'); ?></span>
                                    </div>
                                </label>
                                
                                <label class="delivery-option">
                                    <input type="radio" name="delivery_tier" value="priority">
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-name"><?php echo esc_html__('Priority', 'dubaidirect-rwanda'); ?></span>
                                            <span class="option-price"><?php echo esc_html__('100-150%', 'dubaidirect-rwanda'); ?></span>
                                        </div>
                                        <span class="option-timeline"><?php echo esc_html__('3-5 Days', 'dubaidirect-rwanda'); ?></span>
                                    </div>
                                </label>
                                
                                <label class="delivery-option">
                                    <input type="radio" name="delivery_tier" value="standard">
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-name"><?php echo esc_html__('Standard', 'dubaidirect-rwanda'); ?></span>
                                            <span class="option-price"><?php echo esc_html__('50-75%', 'dubaidirect-rwanda'); ?></span>
                                        </div>
                                        <span class="option-timeline"><?php echo esc_html__('1-2 Weeks', 'dubaidirect-rwanda'); ?></span>
                                    </div>
                                </label>
                                
                                <label class="delivery-option">
                                    <input type="radio" name="delivery_tier" value="economy">
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-name"><?php echo esc_html__('Economy', 'dubaidirect-rwanda'); ?></span>
                                            <span class="option-price"><?php echo esc_html__('25-40%', 'dubaidirect-rwanda'); ?></span>
                                        </div>
                                        <span class="option-timeline"><?php echo esc_html__('1 Month', 'dubaidirect-rwanda'); ?></span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Order Totals -->
                        <div class="order-totals">
                            <div class="total-row">
                                <span><?php echo esc_html__('Subtotal', 'dubaidirect-rwanda'); ?></span>
                                <span><?php wc_cart_totals_subtotal(); ?></span>
                            </div>
                            
                            <div class="total-row">
                                <span><?php echo esc_html__('Delivery', 'dubaidirect-rwanda'); ?></span>
                                <span class="delivery-cost"><?php echo esc_html__('Calculating...', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            
                            <?php if (WC()->cart->needs_shipping() && WC()->cart->show_shipping()) : ?>
                                <div class="total-row">
                                    <span><?php echo esc_html__('Shipping', 'dubaidirect-rwanda'); ?></span>
                                    <span><?php wc_cart_totals_shipping(); ?></span>
                                </div>
                            <?php endif; ?>
                            
                            <?php foreach (WC()->cart->get_coupons() as $code => $coupon) : ?>
                                <div class="total-row coupon-<?php echo esc_attr(sanitize_title($code)); ?>">
                                    <span><?php wc_cart_totals_coupon_label($coupon); ?></span>
                                    <span><?php wc_cart_totals_coupon_html($coupon); ?></span>
                                </div>
                            <?php endforeach; ?>
                            
                            <?php foreach (WC()->cart->get_fees() as $fee) : ?>
                                <div class="total-row fee">
                                    <span><?php echo esc_html($fee->name); ?></span>
                                    <span><?php wc_cart_totals_fee_html($fee); ?></span>
                                </div>
                            <?php endforeach; ?>
                            
                            <?php if (wc_tax_enabled() && !WC()->cart->display_prices_including_tax()) : ?>
                                <?php if ('itemized' === get_option('woocommerce_tax_total_display')) : ?>
                                    <?php foreach (WC()->cart->get_tax_totals() as $code => $tax) : ?>
                                        <div class="total-row tax-rate tax-rate-<?php echo esc_attr(sanitize_title($code)); ?>">
                                            <span><?php echo esc_html($tax->label); ?></span>
                                            <span><?php echo wp_kses_post($tax->formatted_amount); ?></span>
                                        </div>
                                    <?php endforeach; ?>
                                <?php else : ?>
                                    <div class="total-row tax-total">
                                        <span><?php echo esc_html(WC()->countries->tax_or_vat()); ?></span>
                                        <span><?php wc_cart_totals_taxes_total_html(); ?></span>
                                    </div>
                                <?php endif; ?>
                            <?php endif; ?>
                            
                            <div class="total-row total">
                                <span><?php echo esc_html__('Total', 'dubaidirect-rwanda'); ?></span>
                                <span><?php wc_cart_totals_order_total_html(); ?></span>
                            </div>
                        </div>
                        
                        <!-- Checkout Button -->
                        <div class="checkout-actions">
                            <a href="<?php echo esc_url(wc_get_checkout_url()); ?>" class="btn btn-primary btn-full">
                                <?php echo esc_html__('Proceed to Checkout', 'dubaidirect-rwanda'); ?>
                            </a>
                            
                            <a href="<?php echo esc_url(get_permalink(get_option('woocommerce_shop_page_id'))); ?>" class="btn btn-secondary btn-full">
                                <?php echo esc_html__('Continue Shopping', 'dubaidirect-rwanda'); ?>
                            </a>
                        </div>
                        
                        <!-- Trust Indicators -->
                        <div class="trust-indicators">
                            <div class="trust-item">
                                <div class="trust-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Secure Payment', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            
                            <div class="trust-item">
                                <div class="trust-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Quality Assured', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            
                            <div class="trust-item">
                                <div class="trust-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('30-Day Returns', 'dubaidirect-rwanda'); ?></span>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
            
        </div>
    </div>
    
    <?php do_action('woocommerce_after_cart_table'); ?>
</form>

<?php do_action('woocommerce_after_cart'); ?> 
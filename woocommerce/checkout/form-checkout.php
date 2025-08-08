<?php
/**
 * Checkout Form
 *
 * @package DubaiDirect_Rwanda
 * @version 1.0.0
 */

defined('ABSPATH') || exit;

do_action('woocommerce_before_checkout_form', $checkout);

// If checkout registration is disabled and not logged in, the user is redirected to login.
if (!$checkout->is_registration_enabled() && $checkout->is_registration_required() && !is_user_logged_in()) {
    echo esc_html(apply_filters('woocommerce_checkout_must_be_logged_in_message', __('You must be logged in to checkout.', 'dubaidirect-rwanda')));
    return;
}
?>

<form name="checkout" method="post" class="checkout woocommerce-checkout" action="<?php echo esc_url(wc_get_checkout_url()); ?>" enctype="multipart/form-data">

    <div class="checkout-container">
        <div class="checkout-content">
            
            <!-- Checkout Form -->
            <div class="checkout-form">
                <h2><?php echo esc_html__('Checkout', 'dubaidirect-rwanda'); ?></h2>
                
                <?php if ($checkout->get_checkout_fields()) : ?>
                    
                    <?php do_action('woocommerce_checkout_before_customer_details'); ?>
                    
                    <!-- Customer Details -->
                    <div class="customer-details">
                        <h3><?php echo esc_html__('Customer Information', 'dubaidirect-rwanda'); ?></h3>
                        
                        <div class="customer-fields">
                            <?php do_action('woocommerce_checkout_billing'); ?>
                            <?php do_action('woocommerce_checkout_shipping'); ?>
                        </div>
                    </div>
                    
                    <?php do_action('woocommerce_checkout_after_customer_details'); ?>
                    
                    <!-- Delivery Options -->
                    <div class="delivery-section">
                        <h3><?php echo esc_html__('Delivery Options', 'dubaidirect-rwanda'); ?></h3>
                        
                        <div class="delivery-options">
                            <div class="delivery-tier">
                                <label class="delivery-option">
                                    <input type="radio" name="delivery_tier" value="express" checked>
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-name"><?php echo esc_html__('Express Delivery', 'dubaidirect-rwanda'); ?></span>
                                            <span class="option-price"><?php echo esc_html__('200-300%', 'dubaidirect-rwanda'); ?></span>
                                        </div>
                                        <span class="option-timeline"><?php echo esc_html__('1-2 Days', 'dubaidirect-rwanda'); ?></span>
                                        <span class="option-description"><?php echo esc_html__('For emergency and critical business needs', 'dubaidirect-rwanda'); ?></span>
                                    </div>
                                </label>
                            </div>
                            
                            <div class="delivery-tier">
                                <label class="delivery-option">
                                    <input type="radio" name="delivery_tier" value="priority">
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-name"><?php echo esc_html__('Priority Delivery', 'dubaidirect-rwanda'); ?></span>
                                            <span class="option-price"><?php echo esc_html__('100-150%', 'dubaidirect-rwanda'); ?></span>
                                        </div>
                                        <span class="option-timeline"><?php echo esc_html__('3-5 Days', 'dubaidirect-rwanda'); ?></span>
                                        <span class="option-description"><?php echo esc_html__('For urgent business operations', 'dubaidirect-rwanda'); ?></span>
                                    </div>
                                </label>
                            </div>
                            
                            <div class="delivery-tier">
                                <label class="delivery-option">
                                    <input type="radio" name="delivery_tier" value="standard">
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-name"><?php echo esc_html__('Standard Delivery', 'dubaidirect-rwanda'); ?></span>
                                            <span class="option-price"><?php echo esc_html__('50-75%', 'dubaidirect-rwanda'); ?></span>
                                        </div>
                                        <span class="option-timeline"><?php echo esc_html__('1-2 Weeks', 'dubaidirect-rwanda'); ?></span>
                                        <span class="option-description"><?php echo esc_html__('For regular business purchases', 'dubaidirect-rwanda'); ?></span>
                                    </div>
                                </label>
                            </div>
                            
                            <div class="delivery-tier">
                                <label class="delivery-option">
                                    <input type="radio" name="delivery_tier" value="economy">
                                    <div class="option-content">
                                        <div class="option-header">
                                            <span class="option-name"><?php echo esc_html__('Economy Delivery', 'dubaidirect-rwanda'); ?></span>
                                            <span class="option-price"><?php echo esc_html__('25-40%', 'dubaidirect-rwanda'); ?></span>
                                        </div>
                                        <span class="option-timeline"><?php echo esc_html__('1 Month', 'dubaidirect-rwanda'); ?></span>
                                        <span class="option-description"><?php echo esc_html__('For cost-conscious customers', 'dubaidirect-rwanda'); ?></span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Payment Methods -->
                    <div class="payment-section">
                        <h3><?php echo esc_html__('Payment Method', 'dubaidirect-rwanda'); ?></h3>
                        
                        <div class="payment-methods">
                            <div class="payment-method">
                                <label class="payment-option">
                                    <input type="radio" name="payment_method" value="mobile_money" checked>
                                    <div class="option-content">
                                        <div class="payment-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                                <line x1="1" y1="10" x2="23" y2="10"></line>
                                            </svg>
                                        </div>
                                        <div class="payment-info">
                                            <span class="payment-name"><?php echo esc_html__('Mobile Money', 'dubaidirect-rwanda'); ?></span>
                                            <span class="payment-description"><?php echo esc_html__('MTN MoMo, Airtel Money', 'dubaidirect-rwanda'); ?></span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            
                            <div class="payment-method">
                                <label class="payment-option">
                                    <input type="radio" name="payment_method" value="card">
                                    <div class="option-content">
                                        <div class="payment-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                                <line x1="1" y1="10" x2="23" y2="10"></line>
                                            </svg>
                                        </div>
                                        <div class="payment-info">
                                            <span class="payment-name"><?php echo esc_html__('Credit/Debit Card', 'dubaidirect-rwanda'); ?></span>
                                            <span class="payment-description"><?php echo esc_html__('Visa, Mastercard', 'dubaidirect-rwanda'); ?></span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            
                            <div class="payment-method">
                                <label class="payment-option">
                                    <input type="radio" name="payment_method" value="bank_transfer">
                                    <div class="option-content">
                                        <div class="payment-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="9" cy="7" r="4"></circle>
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                            </svg>
                                        </div>
                                        <div class="payment-info">
                                            <span class="payment-name"><?php echo esc_html__('Bank Transfer', 'dubaidirect-rwanda'); ?></span>
                                            <span class="payment-description"><?php echo esc_html__('Direct bank transfer', 'dubaidirect-rwanda'); ?></span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Payment Gateway Fields -->
                        <div class="payment-fields">
                            <?php do_action('woocommerce_checkout_payment'); ?>
                        </div>
                    </div>
                    
                    <!-- Order Notes -->
                    <div class="order-notes">
                        <h3><?php echo esc_html__('Order Notes', 'dubaidirect-rwanda'); ?></h3>
                        <textarea name="order_comments" placeholder="<?php echo esc_attr__('Add any special instructions or notes for your order...', 'dubaidirect-rwanda'); ?>" rows="4"></textarea>
                    </div>
                    
                <?php endif; ?>
                
            </div>
            
            <!-- Order Summary -->
            <div class="order-summary">
                <div class="summary-card">
                    <h3><?php echo esc_html__('Order Summary', 'dubaidirect-rwanda'); ?></h3>
                    
                    <!-- Order Items -->
                    <div class="order-items">
                        <?php
                        foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
                            $_product = apply_filters('woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key);
                            $product_id = apply_filters('woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key);
                            
                            if ($_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters('woocommerce_cart_item_visible', true, $cart_item, $cart_item_key)) {
                                ?>
                                <div class="order-item">
                                    <div class="item-image">
                                        <?php
                                        $thumbnail = apply_filters('woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key);
                                        echo $thumbnail;
                                        ?>
                                    </div>
                                    <div class="item-details">
                                        <h4><?php echo esc_html($_product->get_name()); ?></h4>
                                        <span class="item-quantity"><?php echo esc_html__('Qty:', 'dubaidirect-rwanda'); ?> <?php echo esc_html($cart_item['quantity']); ?></span>
                                    </div>
                                    <div class="item-price">
                                        <?php echo apply_filters('woocommerce_cart_item_price', WC()->cart->get_product_price($_product), $cart_item, $cart_item_key); ?>
                                    </div>
                                </div>
                                <?php
                            }
                        }
                        ?>
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
                    
                    <!-- Place Order Button -->
                    <div class="place-order">
                        <?php do_action('woocommerce_review_order_before_payment'); ?>
                        
                        <div id="payment" class="woocommerce-checkout-payment">
                            <?php if (WC()->cart->needs_payment()) : ?>
                                <ul class="wc_payment_methods payment_methods methods">
                                    <?php
                                    if (!empty($available_gateways)) {
                                        foreach ($available_gateways as $gateway) {
                                            wc_get_template('checkout/payment-method.php', array('gateway' => $gateway));
                                        }
                                    } else {
                                        echo '<li class="woocommerce-notice woocommerce-notice--info woocommerce-info">' . apply_filters('woocommerce_no_available_payment_methods_message', WC()->customer->get_billing_country() ? esc_html__('Sorry, it seems that there are no available payment methods for your state. Please contact us if you require assistance or wish to make alternate arrangements.', 'dubaidirect-rwanda') : esc_html__('Please fill in your details above to see available payment methods.', 'dubaidirect-rwanda')) . '</li>'; // @codingStandardsIgnoreLine
                                    }
                                    ?>
                                </ul>
                            <?php endif; ?>
                        </div>
                        
                        <?php do_action('woocommerce_review_order_after_payment'); ?>
                        
                        <button type="submit" class="btn btn-primary btn-full" name="woocommerce_checkout_place_order" id="place_order" value="<?php esc_attr_e('Place order', 'dubaidirect-rwanda'); ?>" data-value="<?php esc_attr_e('Place order', 'dubaidirect-rwanda'); ?>">
                            <?php esc_html_e('Place order', 'dubaidirect-rwanda'); ?>
                        </button>
                        
                        <?php do_action('woocommerce_review_order_after_submit'); ?>
                        
                        <?php wp_nonce_field('woocommerce-process_checkout', 'woocommerce-process-checkout-nonce'); ?>
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
            
        </div>
    </div>
    
</form>

<?php do_action('woocommerce_after_checkout_form', $checkout); ?> 
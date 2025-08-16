<?php
/**
 * Template Name: Checkout
 * 
 * @package DubaiDirect_Rwanda
 * @version 1.0.0
 */

get_header(); ?>

<main id="primary" class="site-main">
    
    <!-- Checkout Header -->
    <section class="checkout-header">
        <div class="container">
            <div class="checkout-header-content">
                <h1 class="checkout-title"><?php echo esc_html__('Complete Your Order', 'dubaidirect-rwanda'); ?></h1>
                <p class="checkout-subtitle"><?php echo esc_html__('Secure checkout for your DubaiDirect Rwanda order', 'dubaidirect-rwanda'); ?></p>
            </div>
        </div>
    </section>

    <!-- Checkout Form -->
    <section class="checkout-form-section">
        <div class="container">
            <div class="checkout-layout">
                
                <!-- Checkout Form -->
                <div class="checkout-form-container">
                    <form class="checkout-form" id="checkout-form">
                        
                        <!-- Customer Information -->
                        <div class="checkout-section">
                            <h2 class="section-title">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                                <?php echo esc_html__('Customer Information', 'dubaidirect-rwanda'); ?>
                            </h2>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="first-name"><?php echo esc_html__('First Name', 'dubaidirect-rwanda'); ?> *</label>
                                    <input type="text" id="first-name" name="first_name" required>
                                </div>
                                <div class="form-group">
                                    <label for="last-name"><?php echo esc_html__('Last Name', 'dubaidirect-rwanda'); ?> *</label>
                                    <input type="text" id="last-name" name="last_name" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="email"><?php echo esc_html__('Email Address', 'dubaidirect-rwanda'); ?> *</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="phone"><?php echo esc_html__('Phone Number', 'dubaidirect-rwanda'); ?> *</label>
                                <input type="tel" id="phone" name="phone" required>
                            </div>
                        </div>

                        <!-- Shipping Address -->
                        <div class="checkout-section">
                            <h2 class="section-title">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                                <?php echo esc_html__('Shipping Address', 'dubaidirect-rwanda'); ?>
                            </h2>
                            
                            <div class="form-group">
                                <label for="address-line-1"><?php echo esc_html__('Address Line 1', 'dubaidirect-rwanda'); ?> *</label>
                                <input type="text" id="address-line-1" name="address_line_1" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="address-line-2"><?php echo esc_html__('Address Line 2 (Optional)', 'dubaidirect-rwanda'); ?></label>
                                <input type="text" id="address-line-2" name="address_line_2">
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="city"><?php echo esc_html__('City', 'dubaidirect-rwanda'); ?> *</label>
                                    <input type="text" id="city" name="city" required>
                                </div>
                                <div class="form-group">
                                    <label for="district"><?php echo esc_html__('District', 'dubaidirect-rwanda'); ?> *</label>
                                    <input type="text" id="district" name="district" required>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="postal-code"><?php echo esc_html__('Postal Code', 'dubaidirect-rwanda'); ?></label>
                                    <input type="text" id="postal-code" name="postal_code">
                                </div>
                                <div class="form-group">
                                    <label for="country"><?php echo esc_html__('Country', 'dubaidirect-rwanda'); ?> *</label>
                                    <select id="country" name="country" required>
                                        <option value=""><?php echo esc_html__('Select Country', 'dubaidirect-rwanda'); ?></option>
                                        <option value="RW" selected><?php echo esc_html__('Rwanda', 'dubaidirect-rwanda'); ?></option>
                                        <option value="UG"><?php echo esc_html__('Uganda', 'dubaidirect-rwanda'); ?></option>
                                        <option value="KE"><?php echo esc_html__('Kenya', 'dubaidirect-rwanda'); ?></option>
                                        <option value="TZ"><?php echo esc_html__('Tanzania', 'dubaidirect-rwanda'); ?></option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Shipping Options -->
                        <div class="checkout-section">
                            <h2 class="section-title">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"/>
                                </svg>
                                <?php echo esc_html__('Shipping Options', 'dubaidirect-rwanda'); ?>
                            </h2>
                            
                            <div class="shipping-options">
                                <div class="shipping-option">
                                    <input type="radio" id="standard-shipping" name="shipping_method" value="standard" checked>
                                    <label for="standard-shipping" class="shipping-option-label">
                                        <div class="shipping-option-content">
                                            <div class="shipping-option-info">
                                                <h4><?php echo esc_html__('Standard Shipping', 'dubaidirect-rwanda'); ?></h4>
                                                <p><?php echo esc_html__('5-7 business days', 'dubaidirect-rwanda'); ?></p>
                                            </div>
                                            <div class="shipping-option-price">$15.00</div>
                                        </div>
                                    </label>
                                </div>
                                
                                <div class="shipping-option">
                                    <input type="radio" id="express-shipping" name="shipping_method" value="express">
                                    <label for="express-shipping" class="shipping-option-label">
                                        <div class="shipping-option-content">
                                            <div class="shipping-option-info">
                                                <h4><?php echo esc_html__('Express Shipping', 'dubaidirect-rwanda'); ?></h4>
                                                <p><?php echo esc_html__('2-3 business days', 'dubaidirect-rwanda'); ?></p>
                                            </div>
                                            <div class="shipping-option-price">$35.00</div>
                                        </div>
                                    </label>
                                </div>
                                
                                <div class="shipping-option">
                                    <input type="radio" id="premium-shipping" name="shipping_method" value="premium">
                                    <label for="premium-shipping" class="shipping-option-label">
                                        <div class="shipping-option-content">
                                            <div class="shipping-option-info">
                                                <h4><?php echo esc_html__('Premium Shipping', 'dubaidirect-rwanda'); ?></h4>
                                                <p><?php echo esc_html__('1-2 business days', 'dubaidirect-rwanda'); ?></p>
                                            </div>
                                            <div class="shipping-option-price">$50.00</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Payment Method -->
                        <div class="checkout-section">
                            <h2 class="section-title">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                    <line x1="1" y1="10" x2="23" y2="10"/>
                                </svg>
                                <?php echo esc_html__('Payment Method', 'dubaidirect-rwanda'); ?>
                            </h2>
                            
                            <div class="payment-methods">
                                <div class="payment-method">
                                    <input type="radio" id="mobile-money" name="payment_method" value="mobile_money" checked>
                                    <label for="mobile-money" class="payment-method-label">
                                        <div class="payment-method-content">
                                            <div class="payment-method-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                                </svg>
                                            </div>
                                            <div class="payment-method-info">
                                                <h4><?php echo esc_html__('Mobile Money', 'dubaidirect-rwanda'); ?></h4>
                                                <p><?php echo esc_html__('MTN, Airtel, or MoMo', 'dubaidirect-rwanda'); ?></p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                
                                <div class="payment-method">
                                    <input type="radio" id="bank-transfer" name="payment_method" value="bank_transfer">
                                    <label for="bank-transfer" class="payment-method-label">
                                        <div class="payment-method-content">
                                            <div class="payment-method-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M3 21h18M3 10h18M5 6l5-3 5 3M4 18h16"/>
                                                </svg>
                                            </div>
                                            <div class="payment-method-info">
                                                <h4><?php echo esc_html__('Bank Transfer', 'dubaidirect-rwanda'); ?></h4>
                                                <p><?php echo esc_html__('Direct bank transfer', 'dubaidirect-rwanda'); ?></p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                
                                <div class="payment-method">
                                    <input type="radio" id="cash-on-delivery" name="payment_method" value="cash_on_delivery">
                                    <label for="cash-on-delivery" class="payment-method-label">
                                        <div class="payment-method-content">
                                            <div class="payment-method-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <circle cx="12" cy="12" r="3"/>
                                                    <path d="M12 1v6m0 6v6"/>
                                                </svg>
                                            </div>
                                            <div class="payment-method-info">
                                                <h4><?php echo esc_html__('Cash on Delivery', 'dubaidirect-rwanda'); ?></h4>
                                                <p><?php echo esc_html__('Pay when you receive', 'dubaidirect-rwanda'); ?></p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Order Notes -->
                        <div class="checkout-section">
                            <h2 class="section-title">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14,2 14,8 20,8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                    <polyline points="10,9 9,9 8,9"/>
                                </svg>
                                <?php echo esc_html__('Order Notes (Optional)', 'dubaidirect-rwanda'); ?>
                            </h2>
                            
                            <div class="form-group">
                                <label for="order-notes"><?php echo esc_html__('Special instructions or delivery notes', 'dubaidirect-rwanda'); ?></label>
                                <textarea id="order-notes" name="order_notes" rows="4" placeholder="<?php echo esc_attr__('Any special instructions for delivery or packaging...', 'dubaidirect-rwanda'); ?>"></textarea>
                            </div>
                        </div>

                        <!-- Terms and Conditions -->
                        <div class="checkout-section">
                            <div class="form-group checkbox-group">
                                <input type="checkbox" id="terms-accept" name="terms_accept" required>
                                <label for="terms-accept">
                                    <?php echo esc_html__('I agree to the', 'dubaidirect-rwanda'); ?> 
                                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('terms-and-conditions'))); ?>" target="_blank"><?php echo esc_html__('Terms and Conditions', 'dubaidirect-rwanda'); ?></a> 
                                    <?php echo esc_html__('and', 'dubaidirect-rwanda'); ?> 
                                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('privacy-policy'))); ?>" target="_blank"><?php echo esc_html__('Privacy Policy', 'dubaidirect-rwanda'); ?></a>
                                </label>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="checkout-submit">
                            <button type="submit" class="checkout-submit-btn" id="place-order-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Place Order', 'dubaidirect-rwanda'); ?>
                            </button>
                        </div>

                    </form>
                </div>

                <!-- Order Summary -->
                <div class="order-summary-container">
                    <div class="order-summary">
                        <h2 class="summary-title"><?php echo esc_html__('Order Summary', 'dubaidirect-rwanda'); ?></h2>
                        
                        <!-- Order Items -->
                        <div class="order-items">
                            <div class="order-item">
                                <div class="item-image">
                                    <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80" alt="Product">
                                </div>
                                <div class="item-details">
                                    <h4><?php echo esc_html__('iPhone 14 Pro Max', 'dubaidirect-rwanda'); ?></h4>
                                    <p class="item-variant"><?php echo esc_html__('256GB, Space Black', 'dubaidirect-rwanda'); ?></p>
                                    <div class="item-quantity"><?php echo esc_html__('Qty:', 'dubaidirect-rwanda'); ?> 1</div>
                                </div>
                                <div class="item-price">$1,199.00</div>
                            </div>
                            
                            <div class="order-item">
                                <div class="item-image">
                                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Product">
                                </div>
                                <div class="item-details">
                                    <h4><?php echo esc_html__('Nike Air Max 270', 'dubaidirect-rwanda'); ?></h4>
                                    <p class="item-variant"><?php echo esc_html__('Size 42, White/Red', 'dubaidirect-rwanda'); ?></p>
                                    <div class="item-quantity"><?php echo esc_html__('Qty:', 'dubaidirect-rwanda'); ?> 2</div>
                                </div>
                                <div class="item-price">$180.00</div>
                            </div>
                        </div>
                        
                        <!-- Price Breakdown -->
                        <div class="price-breakdown">
                            <div class="price-row">
                                <span><?php echo esc_html__('Subtotal', 'dubaidirect-rwanda'); ?></span>
                                <span>$1,559.00</span>
                            </div>
                            <div class="price-row">
                                <span><?php echo esc_html__('Shipping', 'dubaidirect-rwanda'); ?></span>
                                <span>$15.00</span>
                            </div>
                            <div class="price-row">
                                <span><?php echo esc_html__('Tax', 'dubaidirect-rwanda'); ?></span>
                                <span>$77.95</span>
                            </div>
                            <div class="price-row total">
                                <span><?php echo esc_html__('Total', 'dubaidirect-rwanda'); ?></span>
                                <span>$1,651.95</span>
                            </div>
                        </div>
                        
                        <!-- Security Badge -->
                        <div class="security-badge">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            <span><?php echo esc_html__('Secure Checkout', 'dubaidirect-rwanda'); ?></span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?>

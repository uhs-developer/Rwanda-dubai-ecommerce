<?php
/**
 * Template Name: Shop Page
 * The shop page template file
 * 
 * @package DubaiDirect_Rwanda
 * @version 1.0.0
 */

get_header(); ?>

<main id="primary" class="site-main shop-page">
    <div class="container">
        <!-- Shop Header -->
        <div class="shop-header">
            <h1 class="shop-title">Shop</h1>
            <p class="shop-subtitle">Discover our premium selection of electronics and auto parts</p>
        </div>

        <!-- Category Filter Tabs -->
        <div class="category-filter">
            <div class="filter-tabs">
                <button class="filter-tab active" data-category="all">
                    All
                </button>
                <button class="filter-tab" data-category="electronics">
                    Electronics
                </button>
                <button class="filter-tab" data-category="auto-parts">
                    Auto Parts
                </button>
                <button class="filter-tab" data-category="smartphones">
                    Smartphones
                </button>
                <button class="filter-tab" data-category="laptops">
                    Laptops
                </button>
                <button class="filter-tab" data-category="home-appliances">
                    Home Appliances
                </button>
                <button class="filter-tab" data-category="performance-parts">
                    Performance Parts
                </button>
            </div>
        </div>

        <!-- Products Grid -->
        <div class="products-grid">
            <!-- Product 1 -->
            <div class="product-card" data-category="electronics">
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop" alt="Digital Camera">
                    <div class="product-badge sale">-$20</div>
                    <button class="product-wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-title">Fujifilm X100T 16 MP Digital Camera (Silver)</h3>
                    <div class="product-price">
                        <span class="current-price">$899</span>
                        <span class="original-price">$919</span>
                    </div>
                </div>
            </div>

            <!-- Product 2 -->
            <div class="product-card" data-category="electronics">
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop" alt="Monitor">
                    <div class="product-badge new">NEW</div>
                    <button class="product-wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-title">Samsung CF591 Series Curved 27-Inch FHD Monitor</h3>
                    <div class="product-price">
                        <span class="current-price">$299</span>
                    </div>
                </div>
            </div>

            <!-- Product 3 -->
            <div class="product-card" data-category="electronics">
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=400&h=400&fit=crop" alt="Microphone">
                    <button class="product-wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-title">Blue Yeti USB Microphone Blackout Edition</h3>
                    <div class="product-price">
                        <span class="current-price">$129</span>
                    </div>
                </div>
            </div>

            <!-- Product 4 -->
            <div class="product-card" data-category="electronics">
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop" alt="Printer">
                    <div class="product-badge sale">SALE</div>
                    <button class="product-wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-title">DYMO LabelWriter 450 Turbo Thermal Label Printer</h3>
                    <div class="product-price">
                        <span class="current-price">$89</span>
                        <span class="original-price">$119</span>
                    </div>
                </div>
            </div>

            <!-- Product 5 -->
            <div class="product-card" data-category="electronics">
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" alt="Headphones">
                    <button class="product-wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-title">Pryma Headphones, Rose Gold & Grey</h3>
                    <div class="product-price">
                        <span class="current-price">$199</span>
                    </div>
                </div>
            </div>

            <!-- Product 6 -->
            <div class="product-card" data-category="smartphones">
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop" alt="iPhone">
                    <div class="product-badge new">NEW</div>
                    <button class="product-wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-title">iPhone 15 Pro Max 256GB Titanium</h3>
                    <div class="product-price">
                        <span class="current-price">$1,199</span>
                    </div>
                </div>
            </div>

            <!-- Product 7 -->
            <div class="product-card" data-category="laptops">
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop" alt="MacBook">
                    <div class="product-badge sale">-$150</div>
                    <button class="product-wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-title">MacBook Pro 14-inch M3 Pro 512GB</h3>
                    <div class="product-price">
                        <span class="current-price">$1,999</span>
                        <span class="original-price">$2,149</span>
                    </div>
                </div>
            </div>

            <!-- Product 8 -->
            <div class="product-card" data-category="auto-parts">
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop" alt="Car Parts">
                    <button class="product-wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-title">Performance Exhaust System Universal</h3>
                    <div class="product-price">
                        <span class="current-price">$299</span>
                    </div>
                </div>
            </div>

            <!-- Product 9 -->
            <div class="product-card" data-category="home-appliances">
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop" alt="Refrigerator">
                    <div class="product-badge sale">SALE</div>
                    <button class="product-wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-title">Samsung French Door Refrigerator 25 cu ft</h3>
                    <div class="product-price">
                        <span class="current-price">$1,299</span>
                        <span class="original-price">$1,499</span>
                    </div>
                </div>
            </div>

            <!-- Product 10 -->
            <div class="product-card" data-category="performance-parts">
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1562141964-9d3c5a7124b0?w=400&h=400&fit=crop" alt="Turbo Kit">
                    <div class="product-badge new">NEW</div>
                    <button class="product-wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-title">Garrett GTX2863R Turbocharger Kit</h3>
                    <div class="product-price">
                        <span class="current-price">$899</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productCards = document.querySelectorAll('.product-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Show/hide products based on category
            productCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.product-wishlist');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-regular')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                icon.style.color = '#ff4d4f';
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                icon.style.color = '';
            }
        });
    });
});
</script>

<?php get_footer(); ?>

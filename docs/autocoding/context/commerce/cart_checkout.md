# Cart & Checkout

Cart
- Query: `cart` returns items and monetary totals (subtotal, discounts, tax, shipping, grand_total)
- Mutations: `addToCart`, `updateCartItem`, `removeCartItem`

Checkout
- Mutation: `placeOrder(payment_method, shipping_method, billing_address, shipping_address, customer_note?)`
- Address input: `AddressInput` (first_name, last_name, street_address, city, state_province, postal_code, country, phone)

Orders
- Query: `myOrders` (paginated)
- Model fields: `order_number`, statuses, totals, created_at



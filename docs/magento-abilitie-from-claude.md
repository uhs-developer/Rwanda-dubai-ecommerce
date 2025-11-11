# MAGENTO COMPLETE FEATURES & DASHBOARD WORKFLOWS GUIDE

## TABLE OF CONTENTS
1. [Dashboard Overview & Workflows](#dashboard-overview--workflows)
2. [Complete Feature List](#complete-feature-list)
3. [Detailed Workflow Documentation](#detailed-workflow-documentation)

---

## DASHBOARD OVERVIEW & WORKFLOWS

### **ACCESSING THE ADMIN PANEL**
- **URL Access**: `yourdomain.com/admin` (customizable for security)
- **Login**: Enter admin credentials
- **Default Landing Page**: Dashboard (customizable in configuration)
- **Store View Selector**: Top navigation to switch between multiple stores
- **Left Sidebar Navigation**: Main menu with 10 primary tabs

### **DASHBOARD COMPONENTS**

#### **Left Panel - Quick Metrics**
- **Lifetime Sales**: Total revenue across all time
- **Average Order**: Average order value
- **Last Orders**: 5 most recent purchases with customer name, items, and value
- **Last Search Terms**: Recent customer search queries
- **Top Search Terms**: Most frequently searched keywords

#### **Center Chart Area**
- **Orders Graph**: Visual trend of order volume over time
- **Amounts Graph**: Visual trend of order revenue over time
- **Time Range Selection**: Daily, weekly, monthly, custom periods
- **Toggle Between**: Orders count vs. Revenue amounts
- **Below Chart Data**: Total revenue, tax, shipping, quantity

#### **Bottom Right Tabs (Quick Reports)**
1. **Best Sellers**: Top-selling products
2. **Most Viewed Products**: Highest traffic items
3. **New Customers**: Recent registrations
4. **Customers**: Regular customer activity
5. **Yotpo Reviews**: Customer review summary

#### **Dashboard Configuration**
- Enable/Disable Charts (Performance optimization)
- Set Year-To-Date Start Date
- Set Current Month Start Day
- Configure Startup Page (alternative to dashboard)
- Real-time vs. Historical aggregated data options

---

## MAIN NAVIGATION WORKFLOWS

### **1. DASHBOARD TAB**
#### **Primary Functions:**
- **Sales Overview**: View real-time or historical sales metrics
- **Performance Monitoring**: Track store health at a glance
- **Quick Access**: Navigate to detailed sections
- **Advanced Reporting Button**: Access Adobe Commerce Business Intelligence

#### **Key Workflows:**
1. **Monitor Daily Performance**
   - Check lifetime sales and average order
   - Review recent orders
   - Analyze sales trends via charts
   - Identify top/low performing products

2. **Customer Insights**
   - Review search term trends
   - Track new customer registrations
   - Monitor customer engagement

3. **Quick Actions**
   - Click "Go to Advanced Reporting" for detailed analytics
   - Navigate to specific sections from dashboard links
   - Switch store views for multi-store management

---

### **2. SALES TAB**

#### **Menu Structure:**
- Orders
- Invoices
- Shipments
- Credit Memos
- Billing Agreements
- Transactions
- Braintree Virtual Terminal (if enabled)
- Archive (Commerce only)

#### **2.1 ORDERS WORKFLOW**

**Order Grid Capabilities:**
- View all orders with customizable columns
- Filter by: Status, Customer, Date, Amount, Payment Method
- Sort by any column
- Export orders to CSV/XML
- Create new orders manually (admin-assisted)

**Order Lifecycle Management:**
1. **New Order Processing**
   - View order details (customer, items, shipping, payment)
   - Edit order (if not invoiced/shipped)
   - Contact customer
   - Change status

2. **Bulk Actions**
   - Print shipping labels
   - Print invoices
   - Print packing slips
   - Cancel orders
   - Hold orders
   - Unhold orders
   - Update order status

3. **Individual Order Actions**
   - View order details
   - Invoice order
   - Ship order
   - Cancel order
   - Reorder
   - Edit (if allowed)
   - Send order email
   - Add comments/notes

4. **Order Status Workflow**
   - Pending → Processing → Complete
   - Handle: Canceled, On Hold, Payment Review, Suspected Fraud
   - Custom status creation available

#### **2.2 INVOICES WORKFLOW**

**Invoice Management:**
1. **Create Invoice**
   - Generate from order
   - Partial or full invoicing
   - Capture payment (online methods)
   - Send invoice email to customer

2. **Invoice Grid Actions**
   - View all invoices
   - Filter by date, order, amount
   - Print invoices (individual or bulk)
   - Export invoice data
   - PDF generation

3. **Invoice Details**
   - Order reference
   - Items invoiced
   - Payment information
   - Invoice total
   - Comments and history

#### **2.3 SHIPMENTS WORKFLOW**

**Shipment Processing:**
1. **Create Shipment**
   - Select items to ship
   - Enter tracking numbers
   - Add carrier information
   - Set quantity shipped
   - Create packing slip

2. **Shipping Options**
   - Multiple shipments per order
   - Partial shipments
   - Print shipping labels
   - Print packing slips
   - Send shipment notification email

3. **Tracking Management**
   - Add multiple tracking numbers
   - Update tracking information
   - Customer tracking visibility
   - Carrier integration

4. **Bulk Shipping Actions**
   - Print multiple labels
   - Batch shipment processing
   - Mass shipment creation

#### **2.4 CREDIT MEMOS WORKFLOW**

**Return & Refund Management:**
1. **Create Credit Memo**
   - Full or partial refunds
   - Return to stock option
   - Adjustment refunds
   - Adjustment fees
   - Shipping refund

2. **Credit Memo Types**
   - Online refund (automatic)
   - Offline refund (manual)
   - Store credit (Commerce only)

3. **Refund Processing**
   - Select items to refund
   - Specify quantities
   - Calculate totals
   - Process payment refund
   - Send credit memo email

4. **Credit Memo Grid**
   - View all refunds
   - Filter and search
   - Export data
   - Print PDF credit memos

#### **2.5 BILLING AGREEMENTS WORKFLOW**

**Payment Agreement Management:**
1. **View Agreements**
   - PayPal billing agreements
   - Customer reference numbers
   - Agreement status
   - Creation date

2. **Manage Agreements**
   - Create new agreements
   - Update existing agreements
   - Cancel agreements
   - View related orders

#### **2.6 TRANSACTIONS WORKFLOW**

**Payment Transaction Tracking:**
1. **Transaction Grid**
   - View all payment transactions
   - Transaction ID
   - Order reference
   - Payment method
   - Transaction type (auth, capture, void, refund)

2. **Transaction Details**
   - Transaction ID
   - Parent transaction
   - Method used
   - Amount
   - Status

---

### **3. CATALOG TAB**

#### **Menu Structure:**
- Products
- Categories
- Shared Catalogs (B2B Commerce)

#### **3.1 PRODUCTS WORKFLOW**

**Product Grid Management:**
- **Default Columns**: ID, Thumbnail, Name, Type, Attribute Set, SKU, Price, Quantity, Salable Quantity, Visibility, Status, Websites, Actions

**Product Creation Workflow:**
1. **Select Product Type**
   - Simple Product
   - Configurable Product (with variations)
   - Grouped Product
   - Bundle Product
   - Virtual Product
   - Downloadable Product

2. **Basic Product Information**
   - Enable/Disable product
   - Attribute set selection
   - Product name
   - SKU (unique identifier)
   - Price
   - Tax class
   - Quantity

3. **Product Content**
   - Description (WYSIWYG editor)
   - Short description
   - Images and videos
   - Product specifications
   - Related products
   - Up-sells
   - Cross-sells

4. **Product Configuration**
   - Configurations (for configurable products)
   - Customizable options
   - Inventory settings
   - Advanced pricing
   - Search engine optimization
   - Design updates
   - Gift options
   - Downloadable information (for downloadable products)

5. **Advanced Settings**
   - Visibility settings
   - New from/to dates
   - Manage stock
   - Stock status
   - Weight
   - Category assignment
   - Related products
   - Up-sell products
   - Cross-sell products
   - Country of manufacture
   - Custom layout updates
   - Gift messages

**Bulk Product Actions:**
- Update attributes
- Change status (enable/disable)
- Update prices
- Delete products
- Change websites
- Update inventory
- Transfer inventory source (MSI)

**Product Import/Export:**
- Import products via CSV
- Export products to CSV
- Advanced pricing import/export
- Product images import via ZIP

#### **3.2 CATEGORIES WORKFLOW**

**Category Management:**
1. **Category Tree**
   - Hierarchical category structure
   - Drag-and-drop organization
   - Root categories for different stores
   - Unlimited category depth

2. **Create/Edit Category**
   - Enable/Disable category
   - Include in menu
   - Category name
   - URL key
   - Description
   - CMS block
   - Category image
   - Meta information

3. **Category Display Settings**
   - Display mode (products only, static block, both)
   - Anchor category (for layered navigation)
   - Available product listing sort
   - Default sort order
   - Layered navigation price step

4. **Category Products Assignment**
   - Search and filter products
   - Add/remove products
   - Set product position
   - Mass product assignment

5. **Category Permissions** (Commerce only)
   - Customer group permissions
   - Browsing category
   - Display product prices
   - Add to cart permissions

#### **3.3 SHARED CATALOGS WORKFLOW** (B2B Commerce)

**Company-Specific Catalogs:**
1. **Create Shared Catalog**
   - Catalog name
   - Description
   - Customer tax class
   - Catalog type (public/custom)

2. **Configure Catalog**
   - Select companies
   - Choose products
   - Set custom pricing
   - Category permissions

3. **Pricing Structure**
   - Custom pricing per company
   - Quantity-based pricing
   - Tiered pricing

---

### **4. CUSTOMERS TAB**

#### **Menu Structure:**
- All Customers
- Now Online
- Customer Groups
- Segments (Commerce only)
- Companies (B2B Commerce)

#### **4.1 ALL CUSTOMERS WORKFLOW**

**Customer Grid:**
- **Default Columns**: ID, Name, Email, Group, Phone, ZIP, Country, State/Province, Customer Since, Website, Action

**Customer Management:**
1. **View Customer Details**
   - Account information
   - Addresses
   - Orders
   - Shopping cart
   - Wishlist
   - Newsletter subscription
   - Product reviews
   - Reward points (Commerce only)
   - Store credit (Commerce only)

2. **Create New Customer**
   - Account information (name, email)
   - Associate to website
   - Customer group
   - Send welcome email
   - Add addresses
   - Password settings

3. **Edit Customer Account**
   - Update personal information
   - Change email
   - Reset password
   - Add/edit addresses
   - Change customer group
   - Newsletter subscription

4. **Customer Actions**
   - Create order
   - Manage shopping cart
   - View orders
   - Delete customer
   - Subscribe to newsletter
   - Confirm account

5. **Bulk Customer Actions**
   - Subscribe to newsletter
   - Unsubscribe from newsletter
   - Assign customer group
   - Delete customers

**Customer Import/Export:**
- Import customers via CSV
- Import customer addresses via CSV
- Export customer data
- Export customer addresses

#### **4.2 NOW ONLINE WORKFLOW**

**Real-Time Customer Activity:**
- View customers currently browsing
- Last activity timestamp
- Page/product viewed
- Shopping cart contents
- Customer type (visitor/registered)
- Session information

#### **4.3 CUSTOMER GROUPS WORKFLOW**

**Group Management:**
1. **Default Groups**
   - NOT LOGGED IN (guests)
   - General (registered customers)
   - Wholesale
   - Retailer

2. **Create Custom Groups**
   - Group name
   - Tax class
   - Automatic group assignment

3. **Group Benefits**
   - Special pricing
   - Catalog permissions
   - Promotion eligibility
   - Discount rules

#### **4.4 CUSTOMER SEGMENTS WORKFLOW** (Commerce only)

**Dynamic Customer Segmentation:**
1. **Create Segment**
   - Segment name
   - Description
   - Status
   - Website assignment

2. **Define Conditions**
   - Shopping cart attributes
   - Products purchased
   - Customer attributes
   - Order total
   - Number of orders
   - Date ranges
   - Abandoned carts

3. **Segment Applications**
   - Targeted promotions
   - Dynamic blocks
   - Email campaigns
   - Price rules
   - Banner rules

#### **4.5 COMPANIES WORKFLOW** (B2B Commerce)

**B2B Company Management:**
1. **Company Grid**
   - Company name
   - Status
   - Customer group
   - Sales representative
   - Company email

2. **Create/Edit Company**
   - Company information
   - Legal name
   - Email
   - Sales representative assignment
   - Company admin designation

3. **Company Structure**
   - Company hierarchy
   - Add teams/divisions
   - Assign users to structure
   - Role management

4. **Company Settings**
   - Payment on account
   - Credit limit
   - Purchase approvals
   - Quote management
   - Shared catalog assignment

---

### **5. MARKETING TAB**

#### **Menu Structure:**
- Promotions (Catalog Rules, Cart Rules, Related Product Rules)
- Communications (Email Templates, Newsletter, Email Reminders)
- SEO & Search (URL Rewrites, Search Terms, Search Synonyms, Site Map)
- User Content (Reviews, Tags)
- Private Sales (Commerce only)

#### **5.1 PROMOTIONS - CATALOG PRICE RULES WORKFLOW**

**Product Discount Rules:**
1. **Create Catalog Rule**
   - Rule name
   - Description
   - Status
   - Websites
   - Customer groups
   - Priority
   - Active date range

2. **Define Conditions**
   - Category membership
   - Product attributes
   - Price conditions
   - Stock status
   - Multiple condition combinations

3. **Set Actions**
   - Discount type (%, fixed, adjust to X%)
   - Discount amount
   - Discard subsequent rules
   - Stop further rules processing

4. **Apply Rules**
   - Apply rule manually
   - Schedule automatic application
   - View affected products

#### **5.2 PROMOTIONS - CART PRICE RULES WORKFLOW**

**Shopping Cart Discounts:**
1. **Create Cart Rule**
   - Rule name
   - Description
   - Status
   - Websites
   - Customer groups
   - Coupon code (optional)
   - Uses per customer
   - Uses per coupon
   - Valid date range
   - Priority

2. **Conditions Tab**
   - Cart subtotal
   - Total quantity
   - Total weight
   - Product attributes in cart
   - Shipping conditions
   - Payment method

3. **Actions Tab**
   - Discount type
   - Discount amount
   - Apply to shipping
   - Free shipping
   - Discard subsequent rules
   - Buy X Get Y free

4. **Labels**
   - Custom labels per store view
   - Display on cart
   - Display on checkout

5. **Coupon Management**
   - Generate coupon codes
   - Auto-generated codes
   - Specific coupon codes
   - Coupon code format
   - Prefix/suffix
   - Dash interval
   - Code length
   - Export coupons

#### **5.3 RELATED PRODUCT RULES WORKFLOW** (Commerce only)

**Automated Product Relationships:**
1. **Create Rule**
   - Rule name
   - Status
   - Apply to (related/up-sell/cross-sell)
   - Customer segments

2. **Define Conditions**
   - Products to match
   - Category rules
   - Attribute rules
   - Price rules

3. **Define Results**
   - Products to display
   - Result conditions
   - Result sorting
   - Maximum results

#### **5.4 EMAIL TEMPLATES WORKFLOW**

**Transactional Email Management:**
1. **Default Templates**
   - New order
   - Order update
   - Shipment
   - Invoice
   - Credit memo
   - New customer account
   - Password reset
   - Newsletter subscription

2. **Create Custom Template**
   - Template name
   - Template subject
   - Template content (HTML)
   - Template styles
   - Variables insertion
   - Preview template

3. **Configure Email Settings**
   - Sender information
   - Template selection per email type
   - Email copy settings
   - Logo upload
   - Design configuration

#### **5.5 NEWSLETTER WORKFLOW**

**Email Marketing:**
1. **Newsletter Templates**
   - Create template
   - Template name
   - Template subject
   - Template content
   - Template styles
   - Sender information

2. **Newsletter Queue**
   - Create newsletter
   - Select template
   - Queue date/time
   - Select subscribers
   - Preview newsletter
   - Send test email

3. **Newsletter Subscribers**
   - View all subscribers
   - Import subscribers
   - Export subscribers
   - Delete subscribers
   - Subscriber status

4. **Newsletter Problems**
   - View failed sends
   - Retry failed sends
   - Unsubscribe requests

#### **5.6 EMAIL REMINDERS WORKFLOW** (Commerce only)

**Automated Customer Emails:**
1. **Create Reminder Rule**
   - Rule name
   - Description
   - Status
   - Websites
   - Customer segments

2. **Conditions**
   - Shopping cart conditions
   - Wishlist conditions
   - Product conditions

3. **Emails Configuration**
   - Number of reminders
   - Send after X days
   - Email template
   - Sender

#### **5.7 URL REWRITES WORKFLOW**

**SEO URL Management:**
1. **Create URL Rewrite**
   - Store selection
   - ID path
   - Request path
   - Target path
   - Redirect type (permanent 301, temporary 302)

2. **Automatic Rewrites**
   - Product URL changes
   - Category URL changes
   - CMS page URL changes

3. **Custom Rewrites**
   - Custom redirects
   - Legacy URL support
   - External redirects

4. **URL Rewrite Grid**
   - Filter by store
   - Filter by type
   - Search by path
   - Edit/delete rewrites

#### **5.8 SEARCH TERMS WORKFLOW**

**Search Optimization:**
1. **Popular Search Terms Grid**
   - Search query
   - Number of results
   - Number of uses
   - Redirect URL
   - Suggested terms

2. **Search Term Actions**
   - Add synonym
   - Add redirect
   - View results
   - Increase popularity

#### **5.9 SEARCH SYNONYMS WORKFLOW**

**Search Enhancement:**
1. **Create Synonym Group**
   - Synonym terms
   - Store view
   - Website scope

2. **Synonym Expansion**
   - Bi-directional synonyms
   - One-way synonyms
   - Multi-term synonyms

#### **5.10 SITEMAP WORKFLOW**

**SEO Sitemap Generation:**
1. **Create Sitemap**
   - Filename
   - Path
   - Store selection

2. **Sitemap Configuration**
   - Categories inclusion
   - Products inclusion
   - CMS pages inclusion
   - Update frequency
   - Priority settings

3. **Generate Sitemap**
   - Manual generation
   - Automatic generation (cron)
   - Submit to search engines

#### **5.11 REVIEWS WORKFLOW**

**Product Review Management:**
1. **All Reviews Grid**
   - Review ID
   - Created date
   - Status (pending/approved)
   - Title
   - Nickname
   - Review
   - Product
   - Visibility

2. **Pending Reviews**
   - Approve reviews
   - Reject reviews
   - Edit reviews
   - Delete reviews

3. **Review Actions**
   - Moderate content
   - Change status
   - Update visibility
   - Delete reviews

#### **5.12 PRIVATE SALES WORKFLOW** (Commerce only)

**Exclusive Event Management:**
1. **Create Event**
   - Event name
   - Category selection
   - Start/End dates
   - Display settings

2. **Event Settings**
   - Category display mode
   - Landing page
   - Countdown ticker
   - Event widget

---

### **6. CONTENT TAB**

#### **Menu Structure:**
- Elements (Pages, Blocks, Widgets, Templates, Media Gallery)
- Design (Configuration, Themes, Schedule)
- Content Staging (Commerce only)

#### **6.1 PAGES WORKFLOW**

**CMS Page Management:**
1. **Pages Grid**
   - Page ID
   - Title
   - URL Key
   - Layout
   - Store View
   - Status
   - Created/Modified dates

2. **Create New Page**
   - Enable page
   - Page title
   - URL key
   - Store view selection

3. **Content Tab**
   - Page heading
   - Content editor (WYSIWYG)
   - Insert images
   - Insert videos
   - Insert widgets
   - Insert variables
   - HTML editing

4. **Search Engine Optimization**
   - Meta title
   - Meta keywords
   - Meta description
   - URL key

5. **Page Design**
   - Layout selection
   - Layout update XML
   - Custom design
   - Custom layout update
   - Display date range

6. **Hierarchy** (Commerce only)
   - Parent page
   - Page position
   - Pagination

#### **6.2 BLOCKS WORKFLOW**

**Static Block Management:**
1. **Blocks Grid**
   - Block title
   - Identifier
   - Store view
   - Status

2. **Create Block**
   - Enable block
   - Block title
   - Identifier (unique)
   - Store view

3. **Block Content**
   - Content editor (WYSIWYG)
   - Insert images
   - Insert widgets
   - Insert variables

4. **Block Usage**
   - Insert in CMS pages
   - Insert via widgets
   - Insert in layouts
   - Call via template

#### **6.3 WIDGETS WORKFLOW**

**Widget Management:**
1. **Widget Types**
   - CMS Static Block
   - Catalog Category Link
   - Catalog Product Link
   - Catalog Products List
   - Recently Compared Products
   - Recently Viewed Products
   - Orders and Returns
   - Catalog New Products List
   - Dynamic Blocks Rotator (Commerce only)

2. **Create Widget**
   - Select widget type
   - Design theme
   - Widget title
   - Assign to store views

3. **Storefront Properties**
   - Widget title
   - Sort order
   - Container assignment

4. **Widget Options**
   - Template selection
   - Display configuration
   - Products selection
   - Categories selection
   - Conditions

5. **Layout Updates**
   - Display on specific pages
   - All pages
   - Specific categories
   - Specific products
   - Anchor categories
   - Container position

#### **6.4 MEDIA GALLERY WORKFLOW**

**Media Asset Management:**
1. **Media Gallery Interface**
   - Folder structure
   - Image thumbnails
   - Upload images
   - Create folders
   - Delete media

2. **Image Management**
   - View image details
   - Edit image (crop, resize, rotate)
   - Optimize images
   - Assign keywords/tags
   - Search images

3. **Upload Options**
   - Single file upload
   - Multiple file upload
   - Drag and drop
   - Maximum file size handling

4. **Image Usage**
   - View where used
   - Insert in content
   - Product images
   - Category images
   - CMS content

#### **6.5 TEMPLATES WORKFLOW**

**Email and Page Templates:**
1. **Template Grid**
   - Template name
   - Added date
   - Modified date
   - Subject

2. **Create Template**
   - Template code
   - Template name
   - Template subject
   - Template content
   - Template styles

3. **Template Variables**
   - Insert variables
   - Custom variables
   - Store information
   - Customer data
   - Order data

#### **6.6 DESIGN CONFIGURATION WORKFLOW**

**Store Design Settings:**
1. **Configuration Grid**
   - Store view
   - Theme applied
   - Configuration scope

2. **Edit Configuration**
   - Default theme
   - HTML head settings
   - Header configuration
   - Footer configuration
   - Product image watermarks
   - Pagination

3. **Transactional Emails**
   - Logo upload
   - Logo alt text
   - Logo width/height
   - Email header template
   - Email footer template

#### **6.7 THEMES WORKFLOW**

**Theme Management:**
1. **Installed Themes**
   - Theme name
   - Parent theme
   - Theme path
   - Theme screenshot

2. **Apply Theme**
   - Assign to store view
   - Set as default
   - Preview theme

3. **Customize Theme**
   - Theme customization
   - Logo upload
   - Favicon upload
   - Color scheme
   - Typography
   - Layout modifications

#### **6.8 CONTENT STAGING WORKFLOW** (Commerce only)

**Scheduled Content Updates:**
1. **Create Update**
   - Update name
   - Description
   - Start date/time
   - End date/time

2. **Stageable Content**
   - Products
   - Categories
   - CMS pages
   - CMS blocks
   - Cart price rules
   - Catalog price rules
   - Dynamic blocks

3. **Staging Dashboard**
   - Calendar view
   - Timeline view
   - View scheduled updates
   - Edit updates
   - Delete updates

4. **Preview Staged Content**
   - Preview mode
   - Share preview links
   - Test staged changes

---

### **7. REPORTS TAB**

#### **Menu Structure:**
- Marketing
- Reviews
- Sales
- Customers
- Products
- Statistics
- Business Intelligence (Commerce only)

#### **7.1 MARKETING REPORTS WORKFLOW**

**Marketing Analytics:**
1. **Products in Cart**
   - Product name
   - Price
   - Number of carts
   - Date range filter

2. **Search Terms**
   - Search query
   - Number of results
   - Number of uses
   - Popularity

3. **Abandoned Carts**
   - Customer name
   - Email
   - Products
   - Cart total
   - Date created

4. **Newsletter Problem Reports**
   - Subscriber email
   - Problem type
   - Newsletter name
   - Date sent

#### **7.2 REVIEWS REPORTS WORKFLOW**

**Review Analytics:**
1. **By Customer**
   - Customer name
   - Number of reviews
   - Average rating
   - Date range

2. **By Product**
   - Product name
   - Number of reviews
   - Average rating
   - Last review date

#### **7.3 SALES REPORTS WORKFLOW**

**Sales Analytics:**
1. **Orders Report**
   - Orders by period
   - Total orders
   - Total items ordered
   - Subtotal
   - Tax
   - Shipping
   - Discounts
   - Grand total
   - Invoiced
   - Refunded

2. **Tax Report**
   - Tax rate
   - Orders
   - Tax amount
   - Date range

3. **Invoiced Report**
   - Period
   - Number of invoices
   - Invoiced amount
   - Date range

4. **Shipping Report**
   - Period
   - Number of shipments
   - Shipping charged
   - Date range

5. **Refunds Report**
   - Period
   - Number of refunds
   - Refunded amount
   - Date range

6. **Coupons Report**
   - Coupon code
   - Uses
   - Subtotal
   - Discount
   - Total
   - Date range

7. **PayPal Settlement Reports**
   - Transaction details
   - Settlement date
   - Transaction type
   - Amount

8. **Braintree Settlement Reports**
   - Transaction ID
   - Amount
   - Status
   - Settlement date

#### **7.4 CUSTOMERS REPORTS WORKFLOW**

**Customer Analytics:**
1. **Order Total Report**
   - Customer name
   - Orders
   - Average order
   - Total
   - Date range

2. **Order Count Report**
   - Customer name
   - Number of orders
   - Average order
   - Total spent

3. **New Accounts Report**
   - Period
   - Number of new accounts
   - Date range

4. **Customer Segments Report** (Commerce only)
   - Segment name
   - Number of customers
   - Matched conditions

#### **7.5 PRODUCTS REPORTS WORKFLOW**

**Product Analytics:**
1. **Views Report**
   - Product name
   - Number of views
   - Date range

2. **Bestsellers Report**
   - Product name
   - Quantity ordered
   - Date range

3. **Low Stock Report**
   - Product name
   - SKU
   - Quantity
   - Notify for quantity below

4. **Ordered Products Report**
   - Product name
   - Quantity ordered
   - Date range

5. **Downloads Report** (for downloadable products)
   - Product name
   - Number of downloads
   - Link purchased
   - Link used

#### **7.6 STATISTICS WORKFLOW**

**Report Statistics:**
1. **Refresh Statistics**
   - Refresh lifetime statistics
   - Refresh recent statistics
   - Select specific reports to refresh

2. **Statistics Grid**
   - Report name
   - Last updated
   - Refresh action

#### **7.7 BUSINESS INTELLIGENCE WORKFLOW** (Commerce only)

**Advanced Analytics:**
1. **BI Dashboard**
   - Custom reports
   - Data visualizations
   - KPI tracking
   - Historical analysis

2. **Report Builder**
   - Create custom reports
   - Data source selection
   - Metric creation
   - Dimension configuration

3. **Advanced Features**
   - Cohort analysis
   - Funnel analysis
   - RFM analysis
   - Predictive analytics

---

### **8. STORES TAB**

#### **Menu Structure:**
- Settings (All Stores, Configuration, Terms and Conditions, Order Status)
- Taxes (Tax Rules, Tax Zones and Rates)
- Currency (Currency Rates, Currency Symbols)
- Attributes (Product, Attribute Set, Rating)
- Other Settings (Reward Exchange Rates, Gift Wrapping, Gift Registry)

#### **8.1 ALL STORES WORKFLOW**

**Multi-Store Management:**
1. **Store Hierarchy**
   - Websites (top level)
   - Stores (within websites)
   - Store Views (within stores)

2. **Create Website**
   - Name
   - Code
   - Sort order
   - Default store

3. **Create Store**
   - Website assignment
   - Name
   - Code
   - Root category

4. **Create Store View**
   - Store assignment
   - Name
   - Code
   - Status
   - Sort order

5. **Multi-Store Configuration**
   - URL configuration per store
   - Currency per store
   - Language per store
   - Tax configuration per store
   - Product prices per store
   - Inventory per store

#### **8.2 CONFIGURATION WORKFLOW**

**System-Wide Settings:**

**Configuration Scope:**
- Default (global)
- Website level
- Store view level

**8.2.1 General Configuration**
- Store information (name, phone, address)
- Country options
- State options
- Locale options (timezone, locale, weight unit)
- Store email addresses
- Contacts configuration
- Currency setup
- Single-store mode

**8.2.2 Catalog Configuration**
- Storefront (list mode, products per page)
- Product fields (country of manufacture)
- Product reviews
- Recently viewed products
- Product alerts (price, stock)
- RSS feeds
- Email to friend
- Catalog search (engine, suggestions)
- Price configuration
- Layered navigation
- Category permissions (Commerce only)
- Magento Reward Points (Commerce only)

**8.2.3 Customers Configuration**
- Customer account (sharing, default group)
- Customer configuration (name prefix, suffix, DOB, tax/VAT)
- Online customers options
- Customer segments (Commerce only)
- Promotions (Newsletter, Persistent Shopping Cart)
- Wish List
- Invitations (Commerce only)
- Reward points (Commerce only)
- CAPTCHA

**8.2.4 Sales Configuration**
- Sales (reorder allow, invoice/packing slip logo)
- Checkout (one-page checkout, guest checkout)
- Shipping settings (origin, methods, tracking)
- Multishipping settings
- Payment methods (all gateways)
- PDF print-outs
- Tax configuration
- Gift options
- Minimum order
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin') - Rwanda Dubai E-commerce</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

    <style>
        body {
            font-size: 0.9rem;
        }
        .sidebar {
            min-height: 100vh;
            box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
        }
        .sidebar .nav-link {
            font-weight: 500;
            color: #333;
            padding: 0.75rem 1rem;
            margin-bottom: 0.2rem;
            border-radius: 0.25rem;
        }
        .sidebar .nav-link:hover {
            color: #0d6efd;
            background-color: #f8f9fa;
        }
        .sidebar .nav-link.active {
            color: #fff;
            background-color: #0d6efd;
        }
        .sidebar .nav-link i {
            width: 20px;
            margin-right: 8px;
        }
        .sidebar-heading {
            cursor: pointer;
            user-select: none;
        }
        .sidebar-heading:hover {
            color: #0d6efd !important;
        }
        .navbar-brand {
            font-weight: 600;
            font-size: 1.25rem;
        }
        main {
            min-height: calc(100vh - 56px);
        }
    </style>

    @stack('styles')
</head>
<body>
    <nav class="navbar navbar-dark bg-dark sticky-top">
        <div class="container-fluid">
            <a class="navbar-brand" href="{{ route('admin.dashboard') }}">
                <i class="bi bi-shop"></i> Rwanda Dubai Admin
            </a>
            <div class="d-flex align-items-center">
                <span class="text-white me-3">
                    <i class="bi bi-person-circle"></i> {{ Auth::user()->name }}
                </span>
                <form action="{{ route('admin.logout') }}" method="POST" class="d-inline">
                    @csrf
                    <button type="submit" class="btn btn-outline-light btn-sm">
                        <i class="bi bi-box-arrow-right"></i> Logout
                    </button>
                </form>
            </div>
        </div>
    </nav>

    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <nav class="col-md-2 d-md-block bg-light sidebar">
                <div class="position-sticky pt-3">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}" href="{{ route('admin.dashboard') }}">
                                <i class="bi bi-speedometer2"></i> Dashboard
                            </a>
                        </li>
                    </ul>

                    <!-- Sales Section -->
                    <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted" data-bs-toggle="collapse" data-bs-target="#salesMenu">
                        <span>Sales</span>
                        <i class="bi bi-chevron-down"></i>
                    </h6>
                    <div class="collapse" id="salesMenu">
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <a class="nav-link {{ request()->routeIs('admin.orders.*') ? 'active' : '' }}" href="{{ route('admin.orders.index') }}">
                                    <i class="bi bi-cart3"></i> Orders
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link {{ request()->routeIs('admin.invoices.*') ? 'active' : '' }}" href="{{ route('admin.invoices.index') }}">
                                    <i class="bi bi-receipt"></i> Invoices
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link {{ request()->routeIs('admin.shipments.*') ? 'active' : '' }}" href="{{ route('admin.shipments.index') }}">
                                    <i class="bi bi-truck"></i> Shipments
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- Catalog Section -->
                    <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted" data-bs-toggle="collapse" data-bs-target="#catalogMenu">
                        <span>Catalog</span>
                        <i class="bi bi-chevron-down"></i>
                    </h6>
                    <div class="collapse" id="catalogMenu">
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <a class="nav-link {{ request()->routeIs('admin.products.*') ? 'active' : '' }}" href="{{ route('admin.products.index') }}">
                                    <i class="bi bi-box-seam"></i> Products
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link {{ request()->routeIs('admin.categories.*') ? 'active' : '' }}" href="{{ route('admin.categories.index') }}">
                                    <i class="bi bi-tags"></i> Categories
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- Customers Section -->
                    <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted" data-bs-toggle="collapse" data-bs-target="#customersMenu">
                        <span>Customers</span>
                        <i class="bi bi-chevron-down"></i>
                    </h6>
                    <div class="collapse" id="customersMenu">
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <a class="nav-link {{ request()->routeIs('admin.customers.*') ? 'active' : '' }}" href="{{ route('admin.customers.index') }}">
                                    <i class="bi bi-people"></i> All Customers
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- Marketing Section -->
                    <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted" data-bs-toggle="collapse" data-bs-target="#marketingMenu">
                        <span>Marketing</span>
                        <i class="bi bi-chevron-down"></i>
                    </h6>
                    <div class="collapse" id="marketingMenu">
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <a class="nav-link {{ request()->routeIs('admin.promotions.*') ? 'active' : '' }}" href="{{ route('admin.promotions.index') }}">
                                    <i class="bi bi-gift"></i> Promotions
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- System Section -->
                    <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted" data-bs-toggle="collapse" data-bs-target="#systemMenu">
                        <span>System</span>
                        <i class="bi bi-chevron-down"></i>
                    </h6>
                    <div class="collapse" id="systemMenu">
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <a class="nav-link {{ request()->routeIs('admin.configuration.*') ? 'active' : '' }}" href="{{ route('admin.configuration.index') }}">
                                    <i class="bi bi-gear"></i> Configuration
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link {{ request()->routeIs('admin.users.*') ? 'active' : '' }}" href="{{ route('admin.users.index') }}">
                                    <i class="bi bi-person-badge"></i> Admin Users
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <!-- Main Content -->
            <main class="col-md-10 ms-sm-auto px-md-4 py-4">
                @yield('content')
            </main>
        </div>
    </div>

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        // Auto-expand the active section on page load
        document.addEventListener('DOMContentLoaded', function() {
            const activeLink = document.querySelector('.sidebar .nav-link.active');
            if (activeLink) {
                const collapseParent = activeLink.closest('.collapse');
                if (collapseParent) {
                    const bsCollapse = new bootstrap.Collapse(collapseParent, { show: true });
                }
            }
        });
    </script>

    @stack('scripts')
</body>
</html>

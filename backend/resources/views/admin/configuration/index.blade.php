@extends('admin.layout')

@section('title', 'Configuration')

@section('content')
<h1 class="h3 mb-4">Store Configuration</h1>

<div class="row">
    <div class="col-md-4 mb-4">
        <div class="card h-100">
            <div class="card-body text-center">
                <div class="mb-3">
                    <i class="bi bi-percent" style="font-size: 3rem; color: #0d6efd;"></i>
                </div>
                <h5 class="card-title">Tax Rates</h5>
                <p class="card-text text-muted">Manage tax rates and rules</p>
                <div class="mb-3">
                    <span class="badge bg-primary fs-5">{{ $taxRatesCount }} Tax Rates</span>
                </div>
                <a href="{{ route('admin.configuration.taxes') }}" class="btn btn-primary">
                    Manage Tax Rates
                </a>
            </div>
        </div>
    </div>

    <div class="col-md-4 mb-4">
        <div class="card h-100">
            <div class="card-body text-center">
                <div class="mb-3">
                    <i class="bi bi-truck" style="font-size: 3rem; color: #198754;"></i>
                </div>
                <h5 class="card-title">Shipping Methods</h5>
                <p class="card-text text-muted">Configure shipping options and rates</p>
                <div class="mb-3">
                    <span class="badge bg-success fs-5">{{ $shippingMethodsCount }} Methods</span>
                </div>
                <a href="{{ route('admin.configuration.shipping') }}" class="btn btn-success">
                    Manage Shipping
                </a>
            </div>
        </div>
    </div>

    <div class="col-md-4 mb-4">
        <div class="card h-100">
            <div class="card-body text-center">
                <div class="mb-3">
                    <i class="bi bi-gift" style="font-size: 3rem; color: #dc3545;"></i>
                </div>
                <h5 class="card-title">Coupons & Promotions</h5>
                <p class="card-text text-muted">Create and manage discount coupons</p>
                <div class="mb-3">
                    <span class="badge bg-danger fs-5">{{ $couponsCount }} Coupons</span>
                </div>
                <a href="{{ route('admin.configuration.coupons') }}" class="btn btn-danger">
                    Manage Coupons
                </a>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-6 mb-4">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">Store Settings</h5>
            </div>
            <div class="card-body">
                <div class="list-group list-group-flush">
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-shop me-3"></i>
                            <div>
                                <strong>General Settings</strong>
                                <p class="mb-0 text-muted small">Store name, email, address</p>
                            </div>
                        </div>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-currency-dollar me-3"></i>
                            <div>
                                <strong>Currency</strong>
                                <p class="mb-0 text-muted small">Default currency and exchange rates</p>
                            </div>
                        </div>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-credit-card me-3"></i>
                            <div>
                                <strong>Payment Methods</strong>
                                <p class="mb-0 text-muted small">Configure payment gateways</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-6 mb-4">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">Advanced Settings</h5>
            </div>
            <div class="card-body">
                <div class="list-group list-group-flush">
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-envelope me-3"></i>
                            <div>
                                <strong>Email Templates</strong>
                                <p class="mb-0 text-muted small">Customize email notifications</p>
                            </div>
                        </div>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-search me-3"></i>
                            <div>
                                <strong>SEO Settings</strong>
                                <p class="mb-0 text-muted small">Meta tags and sitemap</p>
                            </div>
                        </div>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-shield-check me-3"></i>
                            <div>
                                <strong>Security</strong>
                                <p class="mb-0 text-muted small">SSL, authentication, and permissions</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

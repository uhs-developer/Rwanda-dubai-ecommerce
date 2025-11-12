@extends('admin.layout')

@section('title', 'Order #' . $order->order_number)

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 mb-0">Order #{{ $order->order_number }}</h1>
    <a href="{{ route('admin.orders.index') }}" class="btn btn-secondary">
        <i class="bi bi-arrow-left"></i> Back to Orders
    </a>
</div>

@if(session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
@endif

<div class="row">
    <div class="col-md-8">
        <!-- Order Items -->
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="card-title mb-0">Order Items</h5>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table mb-0">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($order->items as $item)
                                <tr>
                                    <td>
                                        <strong>{{ $item->product_name }}</strong><br>
                                        <small class="text-muted">SKU: {{ $item->product_sku }}</small>
                                    </td>
                                    <td>${{ number_format($item->price, 2) }}</td>
                                    <td>{{ $item->quantity }}</td>
                                    <td>${{ number_format($item->row_total, 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                        <tfoot class="table-light">
                            <tr>
                                <td colspan="3" class="text-end"><strong>Subtotal:</strong></td>
                                <td><strong>${{ number_format($order->subtotal, 2) }}</strong></td>
                            </tr>
                            @if($order->shipping_amount > 0)
                                <tr>
                                    <td colspan="3" class="text-end"><strong>Shipping:</strong></td>
                                    <td><strong>${{ number_format($order->shipping_amount, 2) }}</strong></td>
                                </tr>
                            @endif
                            @if($order->tax_amount > 0)
                                <tr>
                                    <td colspan="3" class="text-end"><strong>Tax:</strong></td>
                                    <td><strong>${{ number_format($order->tax_amount, 2) }}</strong></td>
                                </tr>
                            @endif
                            @if($order->discount_amount > 0)
                                <tr>
                                    <td colspan="3" class="text-end"><strong>Discount:</strong></td>
                                    <td><strong class="text-danger">-${{ number_format($order->discount_amount, 2) }}</strong></td>
                                </tr>
                            @endif
                            <tr>
                                <td colspan="3" class="text-end"><strong>Grand Total:</strong></td>
                                <td><strong class="fs-5">${{ number_format($order->grand_total, 2) }}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

        <!-- Addresses -->
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">Shipping Address</h6>
                    </div>
                    <div class="card-body">
                        @if($order->shippingAddress)
                            <address>
                                {{ $order->shippingAddress->first_name }} {{ $order->shippingAddress->last_name }}<br>
                                {{ $order->shippingAddress->street }}<br>
                                {{ $order->shippingAddress->city }}, {{ $order->shippingAddress->state }} {{ $order->shippingAddress->postal_code }}<br>
                                {{ $order->shippingAddress->country }}<br>
                                {{ $order->shippingAddress->phone }}
                            </address>
                        @else
                            <p class="text-muted">No shipping address</p>
                        @endif
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">Billing Address</h6>
                    </div>
                    <div class="card-body">
                        @if($order->billingAddress)
                            <address>
                                {{ $order->billingAddress->first_name }} {{ $order->billingAddress->last_name }}<br>
                                {{ $order->billingAddress->street }}<br>
                                {{ $order->billingAddress->city }}, {{ $order->billingAddress->state }} {{ $order->billingAddress->postal_code }}<br>
                                {{ $order->billingAddress->country }}<br>
                                {{ $order->billingAddress->phone }}
                            </address>
                        @else
                            <p class="text-muted">No billing address</p>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <!-- Order Info -->
        <div class="card mb-4">
            <div class="card-header">
                <h6 class="mb-0">Order Information</h6>
            </div>
            <div class="card-body">
                <dl class="row mb-0">
                    <dt class="col-sm-6">Order Number:</dt>
                    <dd class="col-sm-6"><strong>{{ $order->order_number }}</strong></dd>

                    <dt class="col-sm-6">Order Date:</dt>
                    <dd class="col-sm-6">{{ $order->created_at->format('M d, Y H:i') }}</dd>

                    <dt class="col-sm-6">Customer:</dt>
                    <dd class="col-sm-6">{{ $order->user->name }}</dd>

                    <dt class="col-sm-6">Email:</dt>
                    <dd class="col-sm-6">{{ $order->user->email }}</dd>

                    <dt class="col-sm-6">Payment Method:</dt>
                    <dd class="col-sm-6">{{ ucfirst(str_replace('_', ' ', $order->payment_method ?? 'N/A')) }}</dd>

                    <dt class="col-sm-6">Shipping Method:</dt>
                    <dd class="col-sm-6">{{ $order->shipping_method_name ?? 'N/A' }}</dd>

                    @if($order->coupon_code)
                        <dt class="col-sm-6">Coupon:</dt>
                        <dd class="col-sm-6"><code>{{ $order->coupon_code }}</code></dd>
                    @endif
                </dl>
            </div>
        </div>

        <!-- Status Update -->
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0">Update Status</h6>
            </div>
            <div class="card-body">
                <form action="{{ route('admin.orders.updateStatus', $order) }}" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="mb-3">
                        <label for="status" class="form-label">Current Status</label>
                        <select name="status" id="status" class="form-select" required>
                            <option value="pending" {{ $order->status == 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="processing" {{ $order->status == 'processing' ? 'selected' : '' }}>Processing</option>
                            <option value="on_hold" {{ $order->status == 'on_hold' ? 'selected' : '' }}>On Hold</option>
                            <option value="completed" {{ $order->status == 'completed' ? 'selected' : '' }}>Completed</option>
                            <option value="cancelled" {{ $order->status == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                            <option value="refunded" {{ $order->status == 'refunded' ? 'selected' : '' }}>Refunded</option>
                            <option value="failed" {{ $order->status == 'failed' ? 'selected' : '' }}>Failed</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Update Status</button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

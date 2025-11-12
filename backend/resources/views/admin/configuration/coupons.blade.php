@extends('admin.layout')

@section('title', 'Coupons & Promotions')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 mb-0">Coupons & Promotions</h1>
    <a href="{{ route('admin.configuration.index') }}" class="btn btn-secondary">
        <i class="bi bi-arrow-left"></i> Back to Configuration
    </a>
</div>

<div class="card">
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Discount</th>
                        <th>Usage</th>
                        <th>Valid Period</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($coupons as $coupon)
                        <tr>
                            <td><code class="fs-6">{{ $coupon->code }}</code></td>
                            <td>
                                <span class="badge bg-secondary">
                                    {{ ucfirst($coupon->type) }}
                                </span>
                            </td>
                            <td>
                                @if($coupon->type === 'percentage')
                                    {{ $coupon->value }}%
                                @else
                                    ${{ number_format($coupon->value, 2) }}
                                @endif
                            </td>
                            <td>
                                <span class="badge bg-info">
                                    {{ $coupon->times_used }} / {{ $coupon->usage_limit ?? '∞' }}
                                </span>
                            </td>
                            <td>
                                @if($coupon->start_date && $coupon->end_date)
                                    {{ $coupon->start_date->format('M d') }} - {{ $coupon->end_date->format('M d, Y') }}
                                @else
                                    No expiry
                                @endif
                            </td>
                            <td>
                                <span class="badge {{ $coupon->is_active ? 'bg-success' : 'bg-secondary' }}">
                                    {{ $coupon->is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center py-4 text-muted">
                                No coupons configured yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection

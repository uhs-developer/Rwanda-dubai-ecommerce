@extends('admin.layout')

@section('title', 'Tax Rates')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 mb-0">Tax Rates</h1>
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
                        <th>Name</th>
                        <th>Country</th>
                        <th>State</th>
                        <th>Rate</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($taxRates as $rate)
                        <tr>
                            <td><strong>{{ $rate->name }}</strong></td>
                            <td>{{ $rate->country }}</td>
                            <td>{{ $rate->state ?? '-' }}</td>
                            <td>{{ $rate->rate }}%</td>
                            <td>
                                <span class="badge {{ $rate->is_active ? 'bg-success' : 'bg-secondary' }}">
                                    {{ $rate->is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center py-4 text-muted">
                                No tax rates configured yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection

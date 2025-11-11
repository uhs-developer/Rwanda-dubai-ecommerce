@extends('admin.layout')

@section('title', 'Shipping Methods')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 mb-0">Shipping Methods</h1>
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
                        <th>Code</th>
                        <th>Rates</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($shippingMethods as $method)
                        <tr>
                            <td>
                                <strong>{{ $method->name }}</strong>
                                @if($method->description)
                                    <br><small class="text-muted">{{ $method->description }}</small>
                                @endif
                            </td>
                            <td><code>{{ $method->code }}</code></td>
                            <td>
                                <span class="badge bg-info">{{ $method->rates->count() }} rates</span>
                            </td>
                            <td>
                                <span class="badge {{ $method->is_active ? 'bg-success' : 'bg-secondary' }}">
                                    {{ $method->is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="text-center py-4 text-muted">
                                No shipping methods configured yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection

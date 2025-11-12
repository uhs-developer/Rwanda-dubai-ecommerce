<tr>
    <td>
        @if($category->image)
            <img src="{{ $category->image }}" alt="{{ $category->name }}" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">
        @else
            <div class="bg-light d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                <i class="bi bi-folder text-muted"></i>
            </div>
        @endif
    </td>
    <td>
        <span style="margin-left: {{ $level * 20 }}px;">
            @if($level > 0)
                <i class="bi bi-arrow-return-right text-muted me-1"></i>
            @endif
            <strong>{{ $category->name }}</strong>
        </span>
    </td>
    <td><code>{{ $category->slug }}</code></td>
    <td>{{ $category->parent ? $category->parent->name : '-' }}</td>
    <td>
        <span class="badge bg-info">{{ $category->products()->count() }}</span>
    </td>
    <td>
        <span class="badge {{ $category->is_active ? 'bg-success' : 'bg-secondary' }}">
            {{ $category->is_active ? 'Active' : 'Inactive' }}
        </span>
    </td>
    <td>
        <div class="btn-group btn-group-sm" role="group">
            <a href="{{ route('admin.categories.edit', $category) }}" class="btn btn-outline-primary" title="Edit">
                <i class="bi bi-pencil"></i>
            </a>
            <form action="{{ route('admin.categories.destroy', $category) }}" method="POST" class="d-inline" onsubmit="return confirm('Are you sure you want to delete this category?')">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn btn-outline-danger" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </form>
        </div>
    </td>
</tr>

@if(isset($category->children_tree))
    @foreach($category->children_tree as $child)
        @include('admin.categories.partials.tree-item', ['category' => $child, 'level' => $level + 1])
    @endforeach
@endif

@extends('admin.layouts.app')

@section('title', $title)
@section('page-title', $title)

@section('content')
<div class="bg-white rounded-lg shadow p-8 text-center">
    <svg class="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
    <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ $title }}</h2>
    <p class="text-gray-600 mb-4">This page is coming soon. The foundation is ready and working!</p>
    <a href="{{ route('admin.dashboard') }}" class="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Back to Dashboard
    </a>
</div>
@endsection

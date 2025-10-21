<?php

return [
	// Apply to API routes; add others if needed
	'paths' => ['api/*', 'sanctum/csrf-cookie'],

	// Allow all methods for now; tighten if desired
	'allowed_methods' => ['*'],

	// Allow all origins - set to wildcard for development
	'allowed_origins' => ['*'],

	'allowed_origins_patterns' => [],

	// Allow any headers from the frontend
	'allowed_headers' => ['*'],

	// Expose headers that might be needed
	'exposed_headers' => ['*'],

	// No caching of preflight in dev
	'max_age' => 0,

	// Set to false when using wildcard origins
	'supports_credentials' => false,
];













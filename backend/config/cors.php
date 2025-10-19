<?php

return [
	// Apply to API routes; add others if needed
	'paths' => ['api/*', 'sanctum/csrf-cookie'],

	// Allow all methods for now; tighten if desired
	'allowed_methods' => ['*'],

	// Explicitly list frontend origins; no wildcards when credentials are used
	'allowed_origins' => [
		'http://localhost:3000',
	],

	'allowed_origins_patterns' => [],

	// Allow any headers from the frontend
	'allowed_headers' => ['*'],

	// Expose none by default
	'exposed_headers' => [],

	// No caching of preflight in dev
	'max_age' => 0,

	// Critical: allow cookies/credentials over CORS
	'supports_credentials' => true,
];












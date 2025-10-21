<?php

return [
	// Apply to API routes; add others if needed
	'paths' => ['api/*', 'sanctum/csrf-cookie'],

	// Allow all methods for now; tighten if desired
	'allowed_methods' => ['*'],

	// Allow specific origins for credentials support
	'allowed_origins' => [
		'http://localhost:3000',
		'http://localhost:5173',
		'http://127.0.0.1:3000',
		'http://127.0.0.1:5173',
		'https://api.seba.hanohost.net',
		'https://seba.hanohost.net',
	],

	'allowed_origins_patterns' => [
		'/^https?:\/\/localhost:\d+$/',
		'/^https?:\/\/127\.0\.0\.1:\d+$/',
		'/^https?:\/\/.*\.hanohost\.net$/',
	],

	// Allow any headers from the frontend
	'allowed_headers' => ['*'],

	// Expose headers that might be needed
	'exposed_headers' => ['*'],

	// No caching of preflight in dev
	'max_age' => 0,

	// Enable credentials support
	'supports_credentials' => true,
];













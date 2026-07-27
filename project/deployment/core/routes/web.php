<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    $console = [
        'health' => [
            'Database' => 'Unavailable',
            'Storage' => is_writable(storage_path()) ? 'Operational' : 'Unavailable',
            'Cache' => is_writable(storage_path('framework/cache')) ? 'Operational' : 'Unavailable',
            'Routes' => 'Operational',
            'Filesystem' => 'Operational'
        ],
        'runtime' => [
            'Laravel' => app()->version(),
            'PHP' => phpversion(),
            'Memory Peak' => round(memory_get_peak_usage(true) / 1048576, 2) . ' MB',
            'Execution Time' => defined('LARAVEL_START') ? round((microtime(true) - LARAVEL_START) * 1000, 2) . ' ms' : 'Unavailable',
            'Server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unavailable',
            'Timezone' => config('app.timezone', 'Unavailable'),
            'Environment' => config('app.env', 'Unavailable'),
            'Debug Mode' => config('app.debug') ? 'True' : 'False',
        ],
        'deployment' => [
            'Application' => config('app.name', 'CrosswordLabs API'),
            'API URL' => config('app.url', 'Unavailable'),
            'Frontend URL' => config('app.frontend_url', 'Unavailable'),
            'Repository' => config('app.repository', 'Unavailable'),
            'Version' => config('app.version', 'v1.0.0'),
            'Status' => 'Stable',
            'Release' => config('app.release', 'Auto'),
            'Developer' => 'Erliandika Syahputra',
            'University' => 'UIN Sultan Syarif Kasim Riau'
        ],
        'features' => [
            'Authentication' => 'Stateless Bearer Token',
            'Course Management' => 'Enabled',
            'Material Upload' => 'Enabled',
            'PDF Streaming' => 'Enabled',
            'Crossword Engine' => 'Enabled',
            'Submission Tracking' => 'Enabled',
            'Role Management' => 'RBAC Enabled',
        ],
        'adr' => [
            'Stateless Authentication' => 'Using Laravel Sanctum Bearer Token for seamless cross-origin requests.',
            'PDF Streaming' => 'Avoids storage:link requirement, ideal for InfinityFree hosting constraints.',
            'Queue' => 'Sync queue driver utilized due to shared hosting background process limitations.',
            'Cache & Session' => 'File driver implemented for zero-configuration compatibility.',
            'Deployment' => 'Separated Frontend & Backend for independent scaling and Vercel hosting.',
        ],
        'routes' => [],
        'stats' => [
            'Models' => 'Unavailable',
            'Migrations' => 'Unavailable',
        ]
    ];

    try {
        if (DB::connection()->getPdo()) {
            $console['health']['Database'] = 'Operational';
        }
    } catch (\Exception $e) {}

    try {
        $console['stats']['Models'] = count(glob(app_path('Models') . '/*.php'));
        $console['stats']['Migrations'] = count(glob(database_path('migrations') . '/*.php'));
    } catch (\Exception $e) {}

    $apiRoutes = collect(Route::getRoutes())->filter(function ($route) {
        return str_starts_with($route->uri(), 'api');
    });

    $grouped = [];
    foreach ($apiRoutes as $route) {
        $uri = $route->uri();
        $methods = array_diff($route->methods(), ['HEAD']);
        $method = reset($methods) ?: 'GET';
        $prefix = explode('/', $uri)[1] ?? 'general';
        $prefix = ucfirst($prefix);
        
        if (!isset($grouped[$prefix])) {
            $grouped[$prefix] = [];
        }
        $grouped[$prefix][] = [
            'method' => $method,
            'uri' => '/' . $uri,
            'middleware' => implode(', ', $route->middleware()),
        ];
    }
    $console['routes'] = $grouped;

    return view('pages.api-console', compact('console'));
});
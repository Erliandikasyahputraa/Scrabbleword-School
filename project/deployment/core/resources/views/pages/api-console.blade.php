@extends('layouts.api-console')

@section('content')
<div class="flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-12 gap-8">
    <!-- Sidebar -->
    <div class="w-full md:w-64 flex-shrink-0">
        <div class="sticky top-8 space-y-8">
            <div>
                <h1 class="text-xl font-bold tracking-tight mb-2">{{ $console['deployment']['Application'] }}</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400">API Console {{ $console['deployment']['Version'] }}</p>
                <button onclick="toggleTheme()" class="mt-2 text-xs font-medium bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">Toggle Dark Mode</button>
            </div>
            
            <div>
                <input type="text" id="search-input" onkeyup="filterRoutes()" placeholder="Search routes..." class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <nav class="space-y-1 text-sm font-medium">
                <a href="#overview" class="block px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">Overview</a>
                <a href="#endpoints" class="block px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">Endpoints</a>
                <a href="#request-builder" class="block px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">Request Builder</a>
                <a href="#architecture" class="block px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">Architecture</a>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 space-y-12">
        <!-- Overview -->
        <section id="overview" class="space-y-6">
            <h2 class="text-2xl font-bold tracking-tight border-b border-slate-200 dark:border-slate-800 pb-2">Overview</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 shadow-sm">
                    <h3 class="text-sm font-semibold mb-3 text-slate-500 dark:text-slate-400">System Health</h3>
                    <ul class="space-y-2 text-sm">
                        @foreach($console['health'] as $key => $status)
                        <li class="flex justify-between">
                            <span>{{ $key }}</span>
                            <span class="{{ $status === 'Operational' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400' }}">{{ $status }}</span>
                        </li>
                        @endforeach
                    </ul>
                </div>
                
                <div class="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 shadow-sm">
                    <h3 class="text-sm font-semibold mb-3 text-slate-500 dark:text-slate-400">Runtime Info</h3>
                    <ul class="space-y-2 text-sm">
                        @foreach($console['runtime'] as $key => $val)
                        <li class="flex justify-between">
                            <span class="text-slate-600 dark:text-slate-400">{{ $key }}</span>
                            <span class="font-mono">{{ $val }}</span>
                        </li>
                        @endforeach
                    </ul>
                </div>
            </div>
            
            <div class="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 shadow-sm">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-sm font-semibold text-slate-500 dark:text-slate-400">Base URL</h3>
                    <button onclick="copyText('{{ $console['deployment']['API URL'] }}')" class="text-xs text-blue-600 dark:text-blue-400 hover:underline">Copy Base URL</button>
                </div>
                <code class="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded block font-mono">{{ $console['deployment']['API URL'] }}</code>
            </div>
        </section>

        <!-- Endpoints -->
        <section id="endpoints" class="space-y-6">
            <h2 class="text-2xl font-bold tracking-tight border-b border-slate-200 dark:border-slate-800 pb-2">Endpoints</h2>
            
            @foreach($console['routes'] as $group => $routes)
            <div class="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                <div class="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                    <h3 class="font-semibold">{{ $group }} <span class="text-xs font-normal text-slate-500">({{ count($routes) }} endpoints)</span></h3>
                </div>
                <div class="divide-y divide-slate-100 dark:divide-slate-800">
                    @foreach($routes as $route)
                    <div class="px-4 py-3 flex items-center justify-between text-sm route-item hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div class="flex items-center space-x-3">
                            @php
                                $methodColor = match($route['method']) {
                                    'GET' => 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
                                    'POST' => 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30',
                                    'PUT', 'PATCH' => 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
                                    'DELETE' => 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
                                    default => 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800',
                                };
                            @endphp
                            <span class="font-mono text-xs font-bold px-2 py-1 rounded {{ $methodColor }} w-16 text-center">{{ $route['method'] }}</span>
                            <span class="font-mono text-slate-700 dark:text-slate-300">{{ $route['uri'] }}</span>
                        </div>
                        <button onclick="copyText('{{ $route['uri'] }}')" class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900">Copy</button>
                    </div>
                    @endforeach
                </div>
            </div>
            @endforeach
        </section>
        
        <!-- Request Builder -->
        <section id="request-builder" class="space-y-6">
            <h2 class="text-2xl font-bold tracking-tight border-b border-slate-200 dark:border-slate-800 pb-2">Request Builder</h2>
            <div id="builder-container" class="border border-slate-200 dark:border-slate-800 rounded-lg p-6 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
                <div id="builder-overlay" class="absolute inset-0 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6">
                    <svg class="w-12 h-12 text-amber-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <h3 class="text-lg font-bold mb-2">Experimental Feature</h3>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md">The Request Builder is disabled by default to prevent unintended API requests in production. Ensure you have authorization before enabling.</p>
                    <button onclick="document.getElementById('builder-overlay').style.display='none'" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition">Enable Testing</button>
                </div>
                
                <div class="space-y-4">
                    <div class="flex space-x-2">
                        <select id="rb-method" class="w-24 px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 focus:outline-none">
                            <option>GET</option>
                            <option>POST</option>
                            <option>PUT</option>
                            <option>DELETE</option>
                        </select>
                        <input type="text" id="rb-url" placeholder="/api/auth/login" class="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none">
                        <button onclick="sendRequest()" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm transition">Send</button>
                    </div>
                    
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Authorization (Bearer)</label>
                        <input type="text" id="rb-token" placeholder="Bearer Token..." class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">JSON Body</label>
                        <textarea id="rb-body" rows="4" placeholder="{}" class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none"></textarea>
                    </div>
                    
                    <div class="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <div class="flex justify-between items-center mb-2">
                            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Response</label>
                            <div class="text-xs space-x-4 font-mono">
                                <span id="rb-status" class="text-slate-500">Status: -</span>
                                <span id="rb-latency" class="text-slate-500">Latency: -</span>
                            </div>
                        </div>
                        <pre id="rb-response" class="w-full h-48 overflow-y-auto px-4 py-3 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-slate-900 text-slate-300 font-mono focus:outline-none">Waiting for request...</pre>
                    </div>
                </div>
            </div>
            
            <script>
                async function sendRequest() {
                    const method = document.getElementById('rb-method').value;
                    const url = document.getElementById('rb-url').value;
                    const token = document.getElementById('rb-token').value;
                    const bodyRaw = document.getElementById('rb-body').value;
                    const responseEl = document.getElementById('rb-response');
                    const statusEl = document.getElementById('rb-status');
                    const latencyEl = document.getElementById('rb-latency');
                    
                    if(!url) { alert('URL is required'); return; }
                    
                    responseEl.textContent = 'Loading...';
                    statusEl.textContent = 'Status: -';
                    latencyEl.textContent = 'Latency: -';
                    
                    const headers = {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    };
                    if(token) headers['Authorization'] = token.startsWith('Bearer') ? token : 'Bearer ' + token;
                    
                    let options = { method, headers };
                    if(method !== 'GET' && method !== 'HEAD' && bodyRaw) {
                        try {
                            JSON.parse(bodyRaw);
                            options.body = bodyRaw;
                        } catch(e) {
                            alert('Invalid JSON Body');
                            responseEl.textContent = 'Error: Invalid JSON body.';
                            return;
                        }
                    }
                    
                    const start = performance.now();
                    try {
                        const res = await fetch(url, options);
                        const end = performance.now();
                        latencyEl.textContent = `Latency: ${Math.round(end - start)} ms`;
                        statusEl.textContent = `Status: ${res.status} ${res.statusText}`;
                        
                        const text = await res.text();
                        try {
                            const json = JSON.parse(text);
                            responseEl.textContent = JSON.stringify(json, null, 2);
                        } catch(e) {
                            responseEl.textContent = text;
                        }
                    } catch(e) {
                        responseEl.textContent = 'Network Error: ' + e.message;
                    }
                }
            </script>
        </section>

        <!-- Architecture -->
        <section id="architecture" class="space-y-6">
            <h2 class="text-2xl font-bold tracking-tight border-b border-slate-200 dark:border-slate-800 pb-2">Architecture Decision Records</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @foreach($console['adr'] as $feature => $reason)
                <div class="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 shadow-sm">
                    <h4 class="font-semibold text-sm mb-1 text-slate-800 dark:text-slate-200">{{ $feature }}</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ $reason }}</p>
                </div>
                @endforeach
            </div>
            
            <h3 class="text-lg font-bold tracking-tight pt-4">Request Flow</h3>
            <div class="p-6 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-sm shadow-sm flex flex-col items-center space-y-2">
                <div class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm w-48 text-center">React Frontend</div>
                <div class="text-slate-400">↓ fetch()</div>
                <div class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm w-48 text-center">Laravel Route</div>
                <div class="text-slate-400">↓ Sanctum Auth</div>
                <div class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm w-48 text-center">Controller Logic</div>
                <div class="text-slate-400">↓ Eloquent ORM</div>
                <div class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm w-48 text-center">MySQL Database</div>
            </div>
        </section>
        
        <!-- Footer Info -->
        <footer class="pt-8 pb-4 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center border-t border-slate-200 dark:border-slate-800">
            <div class="mb-4 md:mb-0">
                <span class="font-semibold">{{ $console['deployment']['Application'] }}</span> API Console • Developed by <span class="font-medium text-slate-700 dark:text-slate-300">{{ $console['deployment']['Developer'] }}</span>, {{ $console['deployment']['University'] }}
            </div>
            <div class="flex space-x-4">
                <span>Release: {{ $console['deployment']['Release'] }}</span>
                <span>Generated: {{ date('Y-m-d H:i:s') }}</span>
            </div>
        </footer>
    </div>
</div>
@endsection
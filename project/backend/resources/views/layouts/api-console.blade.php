<!DOCTYPE html>
<html lang="en" class="antialiased text-slate-900 bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $console['deployment']['Application'] }} - API Console</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'] },
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="flex flex-col min-h-screen">
    @yield('content')
    <script>
        function toggleTheme() {
            document.documentElement.classList.toggle('dark');
        }
        function copyText(text) {
            navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        }
        function filterRoutes() {
            let search = document.getElementById('search-input').value.toLowerCase();
            let items = document.querySelectorAll('.route-item');
            items.forEach(item => {
                let text = item.innerText.toLowerCase();
                item.style.display = text.includes(search) ? 'block' : 'none';
            });
        }
    </script>
</body>
</html>
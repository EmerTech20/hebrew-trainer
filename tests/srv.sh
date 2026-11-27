# Serves the repository folder on http://localhost:8765 (if not already running).
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
curl -s -o /dev/null localhost:8765 || (cd "$ROOT" && setsid nohup python3 -m http.server 8765 --bind 127.0.0.1 >/dev/null 2>&1 &); sleep 1

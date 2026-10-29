from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import sys

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    port = 3000
    server = ThreadingHTTPServer(('0.0.0.0', port), Handler)
    print(f"Multi-threaded dev server running on http://localhost:{port}")
    sys.stdout.flush()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass

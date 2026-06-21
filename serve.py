#!/usr/bin/env python3
"""Dev server for Terminjäger that disables browser caching, so edits to
styles.css / script.js always show up on a normal refresh."""
import http.server
import socketserver

PORT = 4322


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Strip query parameters and anchors for matching
        clean_path = path.split('?', 1)[0].split('#', 1)[0]
        if clean_path in ("/impressum", "/impressum/"):
            return super().translate_path("/impressum.html")
        elif clean_path in ("/datenschutzerklaerung", "/datenschutzerklaerung/"):
            return super().translate_path("/datenschutzerklaerung.html")
        elif clean_path in ("/agb", "/agb/"):
            return super().translate_path("/agb.html")
        return super().translate_path(path)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
        print(f"Serving on http://localhost:{PORT} (no-cache)")
        httpd.serve_forever()

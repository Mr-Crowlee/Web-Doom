#!/usr/bin/env python3
"""Sirve a pasta com gzip, cache e X-UA-Compatible (melhor que so a meta no IE11)."""
import gzip
import io
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
GZIP_EXT = (".js", ".css", ".html", ".htm", ".svg", ".txt", ".md")


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("X-UA-Compatible", "IE=11")
        self.send_header("Cache-Control", "public, max-age=86400")
        SimpleHTTPRequestHandler.end_headers(self)

    def send_head(self):
        path = self.translate_path(self.path.split("?", 1)[0])
        if os.path.isdir(path):
            return SimpleHTTPRequestHandler.send_head(self)
        ctype = self.guess_type(path)
        try:
            with open(path, "rb") as handle:
                data = handle.read()
        except OSError:
            self.send_error(404, "File not found")
            return None
        accept = self.headers.get("Accept-Encoding", "")
        if "gzip" in accept and path.endswith(GZIP_EXT):
            buf = io.BytesIO()
            gz = gzip.GzipFile(fileobj=buf, mode="wb", mtime=0)
            gz.write(data)
            gz.close()
            data = buf.getvalue()
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Encoding", "gzip")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Vary", "Accept-Encoding")
            self.end_headers()
            return io.BytesIO(data)
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        return io.BytesIO(data)


if __name__ == "__main__":
    os.chdir(ROOT)
    port = int(os.environ.get("PORT", "8000"))
    httpd = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print("Serving %s on http://127.0.0.1:%s (gzip + IE=11)" % (ROOT, port))
    httpd.serve_forever()

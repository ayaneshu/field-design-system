// Vercel Edge Middleware — gate the entire playground behind a shared password.
//
// Vercel's native Password Protection is a Pro-plan feature; this HTTP Basic
// Auth gate is the free equivalent and runs on the Edge before any asset is
// served. The browser shows a login prompt: leave the username blank (or type
// anything) and enter the password below.
//
// Runs on all routes (see `config.matcher`). No dependencies — uses only Web
// platform APIs available in the Edge runtime.

export const config = {
  // Protect everything. Static assets are intentionally gated too, so nothing
  // is reachable without the password.
  matcher: "/:path*",
};

const PASSWORD = "letmein";

export default function middleware(request: Request): Response | undefined {
  const header = request.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");

  if (scheme === "Basic" && encoded) {
    try {
      const decoded = atob(encoded); // "username:password"
      const password = decoded.slice(decoded.indexOf(":") + 1);
      if (password === PASSWORD) {
        return undefined; // correct password → let the request through
      }
    } catch {
      // malformed header → fall through to the challenge
    }
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Field DS Playground", charset="UTF-8"',
    },
  });
}

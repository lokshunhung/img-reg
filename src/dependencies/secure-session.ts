import type { FastifyInstance } from "fastify";
import fastifySecureSession from "fastify-secure-session";

export default async function (app: FastifyInstance, options: {}) {
    app.register(fastifySecureSession, {
        key: [
            // https://github.com/fastify/fastify-secure-session#using-keys-as-strings
            Buffer.from(app.appConfig.SECURE_SESSION_COOKIE_KEY),
        ],
        cookieName: "__Host-SID",
        cookie: {
            domain: undefined, // cookies sent to current domain, but excluding subdomains
            httpOnly: true, // cookies cannot be accessed from javascript
            path: "/", // cookies are sent when path matches "/" (all paths)
            sameSite: "lax", // cookies not sent when cross-site request, but sent when top-level navigating from external site
            secure: true, // cookies sent via https connection only (except localhost)
        },
    });
}

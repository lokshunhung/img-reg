import fp from "fastify-plugin";
import appEnv from "./app-env";
import authenticator from "./authenticator";
import multipart from "./multipart";
import s3Client from "./s3-client";
import secureSession from "./secure-session";

export default fp(async function (app, options) {
    app.register(fp(appEnv));
    app.register(fp(authenticator));
    app.register(fp(multipart));
    app.register(fp(s3Client));
    app.register(fp(secureSession));
});

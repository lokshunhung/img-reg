import fp from "fastify-plugin";
import appEnv from "./app-env";
import multipart from "./multipart";
import s3Client from "./s3-client";

export default fp(async function (app, options) {
    app.register(fp(appEnv));
    app.register(fp(multipart));
    app.register(fp(s3Client));
});

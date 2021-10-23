import { MikroORM, RequestContext } from "@mikro-orm/core";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";
import type { FastifyInstance } from "fastify";
import mikroORMConfig from "../mikro-orm.config";

declare module "fastify" {
    interface FastifyInstance {
        orm: MikroORM<PostgreSqlDriver>;
    }
}

export default async function (app: FastifyInstance, options: {}) {
    const orm = await MikroORM.init(mikroORMConfig);

    app.addHook("onRequest", (request, reply, done) => {
        RequestContext.create(orm.em, done);
    });

    app.addHook("onClose", async (app) => {
        await orm.close();
    });

    app.decorate("orm", orm);
}

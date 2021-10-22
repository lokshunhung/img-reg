import type { FastifyInstance } from "fastify";
import * as knex from "knex";

interface Options {
    host: string;
    database: string;
    user: string;
    password: string;
    port: number;
}

function createKnex(options: Options): knex.Knex {
    return knex.knex({
        client: "postgresql",
        connection: {
            host: options.host,
            database: options.database,
            user: options.user,
            password: options.password,
            port: options.port,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    });
}

declare module "fastify" {
    interface FastifyInstance {
        knex: knex.Knex;
    }
}

export default async function (app: FastifyInstance, options: {}) {
    app.decorate(
        "knex",
        createKnex({
            host: app.appConfig.POSTGRES_HOST,
            database: app.appConfig.POSTGRES_DATABASE,
            user: app.appConfig.POSTGRES_USER,
            password: app.appConfig.POSTGRES_PASSWORD,
            port: app.appConfig.POSTGRES_PORT,
        }),
    );
}

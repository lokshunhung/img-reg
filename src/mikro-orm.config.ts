import type { Options } from "@mikro-orm/core";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";
import path from "path";

const processEnv = process.env as any;

const config: Options<PostgreSqlDriver> = {
    type: "postgresql",
    host: processEnv.POSTGRES_HOST || "127.0.0.1",
    dbName: processEnv.POSTGRES_DB || "img_reg_db",
    user: processEnv.POSTGRES_USER || "img_reg_local",
    password: processEnv.POSTGRES_PASSWORD || "hunter2",
    port: parseInt(processEnv.POSTGRES_PORT || "5432", 10),
    entities: ["**/*.schema.js"],
    entitiesTs: ["**/*.schema.ts"],
    debug: true,
    pool: { min: 2, max: 10 },
};

export default config;

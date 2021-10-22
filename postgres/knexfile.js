// @ts-check

const path = require("path");

/** @type {import("knex").Knex.Config} */
const config = {
    client: "postgresql",
    connection: {
        host: "127.0.0.1",
        database: "img_reg_db",
        user: "img_reg_local",
        password: "hunter2",
        port: 5432,
    },
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        directory: path.join(__dirname, "..", "migrations"),
        tableName: "knex_migrations",
    },
};

module.exports = config;

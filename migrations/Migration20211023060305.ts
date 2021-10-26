import { Migration } from "@mikro-orm/migrations";

export class Migration20211023060305 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            create table "user" (
                "id" uuid not null,
                "created_at" timestamptz(0) not null,
                "updated_at" timestamptz(0) not null,
                "username" text not null,
                "password" text not null
            );
        `);
        this.addSql(`
            alter table "user"
            add constraint "user_pkey" primary key ("id");
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            drop table "user";
        `);
    }
}

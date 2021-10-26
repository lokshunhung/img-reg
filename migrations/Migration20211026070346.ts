import { Migration } from "@mikro-orm/migrations";

export class Migration20211026070346 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            create table "image" (
                "id" uuid not null,
                "created_at" timestamptz(0) not null,
                "updated_at" timestamptz(0) not null,
                "image_url" text not null,
                "caption" text null,
                "author_id" uuid not null,
                "tag" text[] null
            );
        `);
        this.addSql(`
            alter table "image"
            add constraint "image_pkey" primary key ("id");
        `);
        this.addSql(`
            alter table "image"
            add constraint "image_author_id_foreign" foreign key ("author_id") references "user" ("id")
            on update cascade;
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            drop table "image";
        `);
    }
}

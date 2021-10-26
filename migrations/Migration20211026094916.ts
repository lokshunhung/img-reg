import { Migration } from "@mikro-orm/migrations";

export class Migration20211026094916 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            alter table "image"
            rename column "tag" to "tags";
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "image"
            rename column "tags" to "tag";
        `);
    }
}

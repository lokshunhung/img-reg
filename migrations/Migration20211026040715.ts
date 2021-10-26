import { Migration } from "@mikro-orm/migrations";

export class Migration20211026040715 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            alter table "user"
            add column "salt" text not null;
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "user"
            drop column "salt";
        `);
    }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBrandStatus1771609999999 implements MigrationInterface {
    name = 'AddBrandStatus1771609999999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."brands_status_enum" AS ENUM('APPROVED','DISAPPROVED')`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "status" "public"."brands_status_enum" NOT NULL DEFAULT 'DISAPPROVED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."brands_status_enum"`);
    }

}

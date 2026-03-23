import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1774298208963 implements MigrationInterface {
  name = 'Init1774298208963';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`example-user\` (\`uuid\` varchar(36) NOT NULL, \`email\` varchar(500) NOT NULL, INDEX \`IDX_USER_EMAIL\` (\`email\`), UNIQUE INDEX \`IDX_dc017a4532823dd67124d1d428\` (\`email\`), PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_dc017a4532823dd67124d1d428\` ON \`example-user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_USER_EMAIL\` ON \`example-user\``,
    );
    await queryRunner.query(`DROP TABLE \`example-user\``);
  }
}

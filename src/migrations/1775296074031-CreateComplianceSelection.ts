import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComplianceSelection1775296074031 implements MigrationInterface {
  name = 'CreateComplianceSelection1775296074031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`compliance_selections\` (
        \`uuid\` varchar(36) NOT NULL,
        \`userId\` varchar(255) NOT NULL,
        \`frameworkCode\` varchar(50) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        INDEX \`IDX_COMPLIANCE_SELECTION_USER_ID\` (\`userId\`),
        PRIMARY KEY (\`uuid\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_COMPLIANCE_SELECTION_USER_ID\` ON \`compliance_selections\``,
    );
    await queryRunner.query(`DROP TABLE \`compliance_selections\``);
  }
}

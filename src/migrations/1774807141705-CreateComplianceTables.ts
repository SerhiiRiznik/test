import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComplianceTables1774807141705 implements MigrationInterface {
  name = 'CreateComplianceTables1774807141705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`compliance_frameworks\` (
        \`uuid\` varchar(36) NOT NULL,
        \`code\` varchar(50) NOT NULL,
        \`name\` varchar(100) NOT NULL,
        \`description\` text NULL,
        \`entityTypesCount\` int NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_COMPLIANCE_FRAMEWORK_CODE\` (\`code\`),
        PRIMARY KEY (\`uuid\`)
      ) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `CREATE TABLE \`compliance_selections\` (
        \`uuid\` varchar(36) NOT NULL,
        \`userId\` varchar(255) NOT NULL,
        \`frameworkCode\` varchar(50) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        INDEX \`IDX_COMPLIANCE_SELECTION_USER_ID\` (\`userId\`),
        PRIMARY KEY (\`uuid\`)
      ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_COMPLIANCE_SELECTION_USER_ID\` ON \`compliance_selections\``,
    );

    await queryRunner.query(`DROP TABLE \`compliance_selections\``);

    await queryRunner.query(
      `DROP INDEX \`IDX_COMPLIANCE_FRAMEWORK_CODE\` ON \`compliance_frameworks\``,
    );

    await queryRunner.query(`DROP TABLE \`compliance_frameworks\``);
  }
}

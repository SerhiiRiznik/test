import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedComplianceFrameworks1774808941653 implements MigrationInterface {
  name = 'SeedComplianceFrameworks1774808941653';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO compliance_frameworks
      (uuid, code, name, description, entityTypesCount, isActive, createdAt, updatedAt)
      VALUES
        (UUID(), 'HIPAA_US', 'HIPAA', 'Health Insurance Portability and Accountability Act (US)', 18, 1, NOW(), NOW()),
        (UUID(), 'GDPR_EU', 'EU GDPR', 'European Union General Data Protection Regulation', 11, 1, NOW(), NOW()),
        (UUID(), 'GDPR_UK', 'UK GDPR', 'United Kingdom General Data Protection Regulation', 11, 1, NOW(), NOW()),
        (UUID(), 'FADP_CH', 'Swiss FADP', 'Swiss Federal Act on Data Protection', 11, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        description = VALUES(description),
        entityTypesCount = VALUES(entityTypesCount),
        isActive = VALUES(isActive),
        updatedAt = NOW();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM compliance_frameworks
      WHERE code IN ('HIPAA_US', 'GDPR_EU', 'GDPR_UK', 'FADP_CH');
    `);
  }
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import ComplianceFramework from './compliance-framework.entity';

@Entity({ name: 'compliance_selections' })
export default class ComplianceSelection {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index('IDX_COMPLIANCE_SELECTION_USER_ID')
  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 36 })
  frameworkId: string;

  @ManyToOne(() => ComplianceFramework, { eager: true, nullable: false })
  @JoinColumn({ name: 'frameworkId', referencedColumnName: 'uuid' })
  framework: ComplianceFramework;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 6 })
  updatedAt: Date;
}

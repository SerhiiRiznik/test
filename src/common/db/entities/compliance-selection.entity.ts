import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'compliance_selections' })
export default class ComplianceSelection {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index('IDX_COMPLIANCE_SELECTION_USER_ID')
  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  frameworkCode: string;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 6 })
  updatedAt: Date;
}

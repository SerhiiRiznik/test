import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'contact-message' })
export default class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column({ length: 100, nullable: false })
  firstName!: string;

  @Column({ length: 100, nullable: false })
  lastName!: string;

  @Column({ length: 255, nullable: false })
  email!: string;

  @Column({ length: 30, nullable: false })
  phoneNumber!: string;

  @Column({ type: 'text', nullable: false })
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

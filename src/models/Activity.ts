import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Length, IsNotEmpty, IsOptional } from 'class-validator';
import { Contact } from './Contact';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Contact, contact => contact.activities, { nullable: false, onDelete: 'CASCADE' })
  contact!: Contact;

  @Column({ length: 256, nullable: true })
  @IsOptional()
  @Length(1, 256)
  name?: string;

  @Column({ type: 'datetime' })
  @IsNotEmpty()
  timestamp!: Date;

  @Column({ length: 512 })
  @IsNotEmpty()
  @Length(1, 512)
  note!: string;
} 
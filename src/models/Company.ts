import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import { Contact } from './Contact';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 256 })
  @IsNotEmpty()
  @Length(1, 256)
  name!: string;

  @OneToMany(() => Contact, contact => contact.company)
  contacts!: Contact[];
} 
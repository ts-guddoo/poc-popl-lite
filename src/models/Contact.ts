import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Length, IsNotEmpty, IsEmail } from 'class-validator';
import { Company } from './Company';
import { Activity } from './Activity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Company, company => company.contacts, { nullable: false, onDelete: 'CASCADE' })
  company!: Company;

  @Column({ length: 128 })
  @IsNotEmpty()
  @Length(1, 128)
  name!: string;

  @Column({ length: 256 })
  @IsNotEmpty()
  @Length(1, 256)
  @IsEmail()
  email!: string;

  @OneToMany(() => Activity, activity => activity.contact)
  activities!: Activity[];
} 
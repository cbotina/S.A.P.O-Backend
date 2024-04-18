import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nCredits: number;

  @Column()
  description: string;
}

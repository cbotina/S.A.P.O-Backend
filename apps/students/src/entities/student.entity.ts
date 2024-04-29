import { Subject } from 'apps/subjects/src/entities/subject.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @ManyToMany(() => Subject, (subject) => subject.students)
  subjects: Subject[];
}

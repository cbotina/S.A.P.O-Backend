import { Subject } from 'apps/subjects/src/entities/subject.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @OneToMany(() => Subject, (subject) => subject.id)
  subjects: Subject[];
}

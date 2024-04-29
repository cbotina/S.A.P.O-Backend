import { Student } from 'apps/students/src/entities/student.entity';
import { Teacher } from 'apps/teachers/src/entities/teacher.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ default: 0 })
  semester: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.subjects)
  teacher: Teacher;

  @ManyToMany(() => Student, (student) => student.subjects)
  @JoinTable()
  students: Student[];
}

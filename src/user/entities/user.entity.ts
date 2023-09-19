import { Competition } from 'src/competition/entities/competition.entity';
import { UserRole } from 'src/user/enums/role.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true, select: false })
  jwt: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Competition, (competition) => competition.users, { onDelete: 'CASCADE' })
  competitions: Competition[];

  constructor(id: number, email: string, role: UserRole) {
    super();

    this.id = id;
    this.email = email;
    this.role = role;
  }
}

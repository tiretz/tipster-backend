import { CompetitionConfig } from 'src/competition-config/entities/competition-config.entity';
import { User } from 'src/user/entities/user.entity';
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Competition extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  info: string;

  @Column()
  country: string;

  @Column()
  date: Date;

  @Column({ default: false })
  isOpen: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => User, (user) => user.competitions, { onDelete: 'CASCADE' })
  @JoinTable()
  users: User[];

  @OneToOne(() => CompetitionConfig, { onDelete: 'RESTRICT' })
  @JoinColumn()
  config: CompetitionConfig;
}

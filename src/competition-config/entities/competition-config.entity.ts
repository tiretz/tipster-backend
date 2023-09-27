import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Scoring } from '../../competition-config/enums/scoring.enum';
import { RankOrder } from '../../competition-config/enums/rank-order.enum';
import { Competition } from 'src/competition/entities/competition.entity';

@Entity()
export class CompetitionConfig extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Competition, (competition) => competition.config, { onDelete: 'CASCADE' })
  competition: Competition;

  @Column({ type: 'enum', enum: Scoring, default: Scoring.REGULAR_AFTER_90_MINUTES })
  scoring: Scoring;

  @Column({ type: 'enum', enum: RankOrder, default: RankOrder.MORE_EXACT_TIPS })
  finalRankingOrder: RankOrder;

  @Column({ default: 3 })
  exactTipPoints: number;

  @Column({ default: 2 })
  correctDifferencePoints: number;

  @Column({ default: 1 })
  correctTendencyPoints: number;

  @Column({ default: false })
  extraTipsActive: boolean;

  @Column({ default: false })
  totalNumberOfGoalsActive: boolean;

  @Column({ default: 10 })
  totalNumberOfGoalsPoints: number;

  @Column({ default: false })
  finalWinnerActive: boolean;

  @Column({ default: 10 })
  finalWinnerPoints: number;

  @Column({ default: false })
  finalOpponentsActive: boolean;

  @Column({ default: 10 })
  finalOpponentsPoints: number;
}

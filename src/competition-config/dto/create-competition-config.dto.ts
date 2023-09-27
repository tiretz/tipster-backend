import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { Scoring } from '../enums/scoring.enum';
import { RankOrder } from '../enums/rank-order.enum';

export class CreateCompetitionConfigDto {
  @IsEnum(Scoring)
  scoring: Scoring;

  @IsEnum(RankOrder)
  finalRankingOrder: RankOrder;

  @IsNumber()
  exactTipPoints: number;

  @IsNumber()
  correctDifferencePoints: number;

  @IsNumber()
  correctTendencyPoints: number;

  @IsBoolean()
  extraTipsActive: boolean;

  @IsBoolean()
  totalNumberOfGoalsActive: boolean;

  @IsNumber()
  totalNumberOfGoalsPoints: number;

  @IsBoolean()
  finalWinnerActive: boolean;

  @IsNumber()
  finalWinnerPoints: number;

  @IsBoolean()
  finalOpponentsActive: boolean;

  @IsNumber()
  finalOpponentsPoints: number;
}

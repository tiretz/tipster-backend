import { Competition as CompetitionType } from '@prisma/client';

export class Competition implements CompetitionType {
  id: number;
  name: string;
  info: string;
  country: string;
  date: Date;
  isActive: boolean;
}

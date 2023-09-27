import { InferSubjects } from '@casl/ability';
import { CompetitionConfig } from 'src/competition-config/entities/competition-config.entity';
import { Competition } from 'src/competition/entities/competition.entity';
import { User } from 'src/user/entities/user.entity';

export type Subjects = InferSubjects<typeof User | typeof Competition | typeof CompetitionConfig> | 'all';

import { InferSubjects } from '@casl/ability';
import { Competition } from 'src/competition/entities/competition.entity';
import { User } from 'src/user/entities/user.entity';

export type Subjects = InferSubjects<typeof User | typeof Competition> | 'all';

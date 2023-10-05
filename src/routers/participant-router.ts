import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { createParticpantSchema } from 'schemas/participants-schemas';
import { createparticipant, findAllParticipants,} from '@/controllers/participants-controller';

const participantsRouter = Router();

participantsRouter.post('/', validateBody(createParticpantSchema), createparticipant);
participantsRouter.get('/', findAllParticipants);

export { participantsRouter };

import { Router } from 'express';
import { validateBody } from '../middlewares';
import { createparticipant, findAllParticipants } from '../controllers/participants-controller';
import { createParticpantSchema } from '../schemas/participants-schemas';

const participantsRouter = Router();

participantsRouter.post('/', validateBody(createParticpantSchema), createparticipant);
participantsRouter.get('/', findAllParticipants);

export { participantsRouter };

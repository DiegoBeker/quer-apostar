import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { createParticpantSchema } from 'schemas/participants-schemas';
import { createparticipant } from '@/controllers/participants-controller';

const participantsRouter = Router();

participantsRouter.post('/', validateBody(createParticpantSchema), createparticipant);

export { participantsRouter };

import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { createGameSchema } from '@/schemas';
import { createGame } from '@/controllers/games-controller';

const gamesRouter = Router();

gamesRouter.post('/', validateBody(createGameSchema), createGame);

export { gamesRouter };

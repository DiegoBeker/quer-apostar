import { Router } from 'express';
import { validateBody, validateParams } from '@/middlewares';
import { createGameSchema, finishGameSchema, gameIdSchema } from '@/schemas';
import { createGame, finishGame } from '@/controllers/games-controller';

const gamesRouter = Router();

gamesRouter.post('/', validateBody(createGameSchema), createGame);
gamesRouter.post('/:id/finish', validateParams(gameIdSchema), validateBody(finishGameSchema), finishGame);

export { gamesRouter };

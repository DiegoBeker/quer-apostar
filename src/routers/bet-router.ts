import { Router } from 'express';
import { createBet } from '../controllers/bets-controller';
import { validateBody } from '../middlewares';
import { createBetSchema } from '../schemas';

const betsRouter = Router();

betsRouter.post('/', validateBody(createBetSchema), createBet);

export default betsRouter;

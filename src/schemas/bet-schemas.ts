import Joi from 'joi';
import { CreateBetParams } from '@/protocols';

export const createBetSchema = Joi.object<CreateBetParams>({
  homeTeamScore: Joi.number().integer().positive().greater(0).required(),
  awayTeamScore: Joi.number().integer().positive().greater(0).required(),
  amountBet: Joi.number().integer().positive().greater(0).required(),
  gameId: Joi.number().integer().positive().greater(0).required(),
  participantId: Joi.number().integer().positive().greater(0).required(),
});

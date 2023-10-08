import Joi from 'joi';
import { CreateGameParams, FinishGameParams } from '../protocols';

export const createGameSchema = Joi.object<CreateGameParams>({
  homeTeamName: Joi.string().required(),
  awayTeamName: Joi.string().required(),
});

export const finishGameSchema = Joi.object<FinishGameParams>({
  homeTeamScore: Joi.number().integer().min(0).required(),
  awayTeamScore: Joi.number().integer().min(0).required(),
});

export const gameIdSchema = Joi.object({
  id: Joi.number().integer().positive().greater(0).required(),
});

import Joi from 'joi';
import { CreateGameParams } from '@/protocols';

export const createGameSchema = Joi.object<CreateGameParams>({
  homeTeamName: Joi.string().required(),
  awayTeamName: Joi.string().required(),
});

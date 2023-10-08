import Joi from 'joi';
import { CreateParticipantParams } from '../services/participants-service';

export const createParticpantSchema = Joi.object<CreateParticipantParams>({
  name: Joi.string().required(),
  balance: Joi.number().integer().positive().required(),
});

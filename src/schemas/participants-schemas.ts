import { CreateParticipantParams } from "@/services/participants-service";
import Joi from "joi";

export const createParticpantSchema = Joi.object<CreateParticipantParams>({
  name: Joi.string().required(),
  balance: Joi.number().integer().positive().required()
});
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import participantService from '@/services/participants-service';

export async function createparticipant(req: Request, res: Response) {
  const { name, balance } = req.body;

  const participant = await participantService.createParticipant({ name, balance });
  return res.status(httpStatus.CREATED).send(participant);
}

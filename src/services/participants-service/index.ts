import { Participant } from '@prisma/client';
import participantRepository from '@/repositories/participant-repository';

export type CreateParticipantParams = Pick<Participant, 'name' | 'balance'>;

async function createParticipant(data: CreateParticipantParams) {
  return participantRepository.create(data);
}

export default {
  createParticipant,
};

import { Participant } from '@prisma/client';
import participantRepository from '@/repositories/participant-repository';

export type CreateParticipantParams = Pick<Participant, 'name' | 'balance'>;

async function createParticipant(data: CreateParticipantParams) {
  if (data.balance < 1000) throw { name: 'Forbidden', message: 'Saldo mínimo não atingido' };
  return participantRepository.create(data);
}

async function findAll() {
  return participantRepository.findAll();
}

export default {
  createParticipant,
  findAll,
};

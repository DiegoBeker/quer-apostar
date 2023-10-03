import { CreateGameParams } from '@/protocols';
import gameRepository from '@/repositories/game-repository';

async function createGame(data: CreateGameParams) {
  return gameRepository.create(data);
}

export default {
  createGame,
};

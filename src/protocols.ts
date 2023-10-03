export type ApplicationError = {
  name: string;
  message: string;
};

export type CreateGameParams = {
  homeTeamName: string;
  awayTeamName: string;
};

export type CreateBetParams = {
  homeTeamScore: number;
  awayTeamScore: number;
  amountBet: number;
  gameId: number;
  participantId: number;
};

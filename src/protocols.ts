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

export type FinishGameParams = {
  homeTeamScore: number;
  awayTeamScore: number;
};

export type ProcessWinnersParams = {
  homeTeamScore: number;
  awayTeamScore: number;
  totalAmount: number;
  totalWinnersAmount: number;
};

export type TotalAmountResult = {
  totalAmount: number;
};

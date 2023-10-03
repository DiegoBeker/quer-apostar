export type ApplicationError = {
  name: string;
  message: string;
};

export type CreateGameParams = {
  homeTeamName: string;
  awayTeamName: string;
};

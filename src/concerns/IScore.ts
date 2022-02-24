import { TeamType } from "./TeamType";

export interface IScore {
  id?: string;
  eventID: string;
  name: string;
  score: number;
  team: TeamType;
  participants: string[];
}

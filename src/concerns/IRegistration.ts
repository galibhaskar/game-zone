import { TeamType } from "./TeamType";
import firebase from "firebase/compat";

export interface IRegistration {
  id?: string;
  eventID: string;
  team: TeamType;
  userID: string;
  userName: string;
  userEmail: string;
  isSelected: boolean;
  timestamp: string | firebase.firestore.Timestamp;
}

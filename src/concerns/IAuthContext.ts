import firebase from "firebase/compat/app";
import { IEvent } from "../concerns/IEvent";

export interface IAuthContext {
  loggedInUserProfile: firebase.User | null;
  events: IEvent[];
  isUserAdmin: boolean;
  setUser?: (user: firebase.User | null) => void;
  setEvents?: (events: IEvent[]) => void;
}

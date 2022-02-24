import { EventStatus } from "./EventStatus";

export interface IEvent {
  id: string;
  title: string;
  date: string;
  status: EventStatus;
  organizer: string;
}

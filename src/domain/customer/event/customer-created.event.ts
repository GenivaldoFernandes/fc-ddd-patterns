import EventInterface from "../../@shared/event/event.interface";

export default class CustomerCreatedEvent implements EventInterface {
  dataTimeOccurred: Date;
  public eventData: any;

  constructor(eventData: any) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}

import CustomerFactory from "./customer.factory";
import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import EnviaConsoleLog1Handler from "../event/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../event/handler/envia-console-log-2.handler";
import CustomerCreatedEvent from "../event/customer-created.event";
import ChangeAddressHandler from "../event/handler/change-address.handler";
import CustomerChangeAddressEvent from "../event/customer-change-address.event";

describe("Customer factory unit test", () => {
  it("should create a customer", () => {
    let customer = CustomerFactory.create("John");

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.Address).toBeUndefined();
  });

  it("should create a customer with an address", () => {
    const address = new Address("Street", 1, "13330-250", "São Paulo");

    let customer = CustomerFactory.createWithAddress("John", address);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.Address).toBe(address);
  });


  // ==============  CustomerCreatedEvent  ===================================

  it("should notify events customer created", () => {
    const eventDispatcher = new EventDispatcher();
    const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
    const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
    const spyEventLog1Handler = jest.spyOn(enviaConsoleLog1Handler, "handle");
    const spyEventLog2Handler = jest.spyOn(enviaConsoleLog2Handler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog1Handler);
    eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog2Handler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(enviaConsoleLog1Handler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(enviaConsoleLog2Handler);

    const customerCreatedEvent = new CustomerCreatedEvent({});

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventLog1Handler).toHaveBeenCalled();
    expect(spyEventLog2Handler).toHaveBeenCalled();

  });


  // ==============  CustomerChangeAddress  ===================================


  it("should notify events customer change address", () => {
    const eventDispatcher = new EventDispatcher();
    const changeAddressHandler = new ChangeAddressHandler();
    const spyEventChangeAddressHandler = jest.spyOn(changeAddressHandler, "handle");

    eventDispatcher.register("CustomerChangeAddressEvent", changeAddressHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"]
    ).toBeDefined();

    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"].length
    ).toBe(1);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]
    ).toMatchObject(changeAddressHandler);

    const customerCreatedEvent = new CustomerChangeAddressEvent({
      id: "1",
      nome: "Pedro",
      endereco: "Rua 33, ...",
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventChangeAddressHandler).toHaveBeenCalled();

  });

});

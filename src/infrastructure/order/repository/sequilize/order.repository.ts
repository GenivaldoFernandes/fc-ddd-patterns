import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  
    for (const item of entity.items) {
      await OrderItemModel.update(
        {
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        },
        {
          where: {
            id: item.id,
            order_id: entity.id,
          },
        }
      );
    }
  }  

  async find(id: string): Promise<Order> {
    const order  =  await OrderModel.findOne({
      where: { id: id },
      include: ["items"],
    });
    
    let listItens: OrderItem[] = [];
      for(const item of order.items) {
        listItens.push(new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        ));
      }
      return new Order(order.id, order.customer_id, listItens);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: ["items"],
    });

    return orderModels.map((orderModel) => {
      let listItens: OrderItem[] = [];
      for(const item of orderModel.items) {
        listItens.push(new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        ));
      }
      return new Order(orderModel.id, orderModel.customer_id, listItens);
    });
  }
}

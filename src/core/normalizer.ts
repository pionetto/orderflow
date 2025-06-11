import { OrderLine } from '../types/OrderLine';
import { NormalizedUser, NormalizedOrder, NormalizedProduct } from '../types/NormalizedOrder';

function formatDate(date: string): string {

  return `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`;
}

function toFixed2(val: number): string {
  return val.toFixed(2);
}

export function normalizeOrders(orderLines: OrderLine[]): NormalizedUser[] {
  const userMap: Map<number, NormalizedUser> = new Map();

  for (const line of orderLines) {

    if (!userMap.has(line.userId)) {
      userMap.set(line.userId, {
        user_id: line.userId,
        name: line.userName,
        orders: []
      });
    }
    const user = userMap.get(line.userId)!;

    let order = user.orders.find(o => o.order_id === line.orderId && o.date === formatDate(line.date));
    if (!order) {
      order = {
        order_id: line.orderId,
        total: "0.00",
        date: formatDate(line.date),
        products: []
      };
      user.orders.push(order);
    }

    order.products.push({
      product_id: line.productId,
      value: toFixed2(line.value)
    });
  }

  for (const user of userMap.values()) {
    for (const order of user.orders) {
      const total = order.products.reduce((sum, p) => sum + Number(p.value), 0);
      order.total = toFixed2(total);
    }
  }

  return Array.from(userMap.values());
}
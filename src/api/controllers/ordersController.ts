import { Request, Response } from 'express';
import { lastNormalized } from './uploadController';

function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
}

export const ordersController = (req: Request, res: Response): void => {
  let data = lastNormalized;

  if (!Array.isArray(data) || data.length === 0) {
    res.status(200).json([]);
    return;
  }

  const { orderId, startDate, endDate } = req.query;

  if (orderId && isNaN(Number(orderId))) {
    res.status(400).json({ error: 'orderId deve ser um número.' });
    return;
  }
  if (startDate && !isValidDate(String(startDate))) {
    res.status(400).json({ error: 'startDate inválida. Use formato yyyy-mm-dd.' });
    return;
  }
  if (endDate && !isValidDate(String(endDate))) {
    res.status(400).json({ error: 'endDate inválida. Use formato yyyy-mm-dd.' });
    return;
  }

  let filtered = data;
  if (orderId) {
    filtered = filtered
      .map(user => ({
        ...user,
        orders: user.orders.filter((order: any) => order.order_id === Number(orderId)),
      }))
      .filter(user => user.orders.length > 0);
  }

  if (startDate || endDate) {
    const start = startDate ? new Date(String(startDate) + 'T00:00:00') : null;
    const end = endDate ? new Date(String(endDate) + 'T23:59:59') : null;
    filtered = filtered
      .map(user => ({
        ...user,
        orders: user.orders.filter((order: any) => {
          const orderDate = new Date(order.date + 'T00:00:00');
          const afterStart = start ? orderDate >= start : true;
          const beforeEnd = end ? orderDate <= end : true;
          return afterStart && beforeEnd;
        }),
      }))
      .filter(user => user.orders.length > 0);
  }

  res.status(200).json(filtered);
  return;
};

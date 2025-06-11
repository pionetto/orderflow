import { Request, Response } from 'express';
import { lastNormalized } from './uploadController';

export const ordersController = (req: Request, res: Response) => {
    let data = lastNormalized;
  
    const { orderId, startDate, endDate } = req.query;
  
    if (orderId) {
      data = data
        .map((user: any) => ({
          ...user,
          orders: user.orders.filter((order: any) => order.order_id === Number(orderId)),
        }))
        .filter((user: any) => user.orders.length > 0);
    }
  
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate as string) : null;
      const end = endDate ? new Date(endDate as string) : null;
  
      data = data
        .map((user: any) => ({
          ...user,
          orders: user.orders.filter((order: any) => {
            const orderDate = new Date(order.date + 'T00:00:00');
            const afterStart = start ? orderDate >= start : true;
            const beforeEnd = end ? orderDate <= end : true;
            return afterStart && beforeEnd;
          }),
        }))
        .filter((user: any) => user.orders.length > 0);
    }
  
    res.status(200).json(data);
  };  

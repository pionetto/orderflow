import { normalizeOrders } from '../src/core/normalizer';
import { OrderLine } from '../src/types/OrderLine';

describe('normalizeOrders', () => {
  it('deve normalizar pedidos conforme o esperado', () => {
    const parsed: OrderLine[] = [
      {
        userId: 2,
        userName: 'Medeiros',
        orderId: 12345,
        productId: 111,
        value: 256.24,
        date: '20201201'
      },
      {
        userId: 2,
        userName: 'Medeiros',
        orderId: 12345,
        productId: 122,
        value: 256.24,
        date: '20201201'
      },
      {
        userId: 1,
        userName: 'Zarelli',
        orderId: 123,
        productId: 111,
        value: 512.24,
        date: '20211201'
      }
    ];

    const normalized = normalizeOrders(parsed);

    expect(normalized).toEqual([
      {
        user_id: 2,
        name: 'Medeiros',
        orders: [
          {
            order_id: 12345,
            total: "512.48",
            date: "2020-12-01",
            products: [
              { product_id: 111, value: "256.24" },
              { product_id: 122, value: "256.24" }
            ]
          }
        ]
      },
      {
        user_id: 1,
        name: 'Zarelli',
        orders: [
          {
            order_id: 123,
            total: "512.24",
            date: "2021-12-01",
            products: [
              { product_id: 111, value: "512.24" }
            ]
          }
        ]
      }
    ]);
  });
});

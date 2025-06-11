import request from 'supertest';
import app from '../src/api/server';
import fs from 'fs';
import path from 'path';
import { NormalizedUser } from '../src/types/NormalizedOrder';

function createTestFile(content: string, filename = 'pedidos-test.txt') {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

function pad(str: string, length: number) {
    return str.toString().padEnd(length, ' ');
  }
  function padNumber(num: string | number, length: number) {
    return num.toString().padStart(length, '0');
  }
  
  const fileContent = [
    padNumber(2, 10) +
      pad('Medeiros', 45) +
      padNumber(12345, 10) +
      padNumber(111, 10) +
      padNumber('256.24', 12) +
      '20201201',
    padNumber(2, 10) +
      pad('Medeiros', 45) +
      padNumber(12345, 10) +
      padNumber(112, 10) +
      padNumber('256.24', 12) +
      '20201201',
    padNumber(1, 10) +
      pad('Zarelli', 45) +
      padNumber(123, 10) +
      padNumber(111, 10) +
      padNumber('512.24', 12) +
      '20211201'
  ].join('\n');

describe('API REST', () => {
  let testFile: string;

  beforeAll(() => {
    testFile = createTestFile(fileContent, 'pedidos-test.txt');
  });

  afterAll(() => {
    fs.unlinkSync(testFile);
  });

  it('deve retornar erro ao fazer GET /orders antes de qualquer upload', async () => {
    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('deve retornar array vazio ao fazer GET /orders antes de qualquer upload', async () => {
    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('deve aceitar upload correto e retornar dados normalizados', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', testFile);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    const user = res.body.find((u: NormalizedUser) => u.user_id === 2);
    expect(user).toBeDefined();
    expect(user.orders[0].order_id).toBe(12345);
    expect(user.orders[0].products.length).toBe(2);
  });

  it('deve retornar todos os pedidos sem filtro após upload', async () => {
    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it('deve filtrar pedidos por orderId corretamente', async () => {
    const res = await request(app).get('/orders?orderId=12345');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBe(1);
    expect(res.body[0].user_id).toBe(2);
    expect(res.body[0].orders.length).toBe(1);
    expect(res.body[0].orders[0].order_id).toBe(12345);
  });

  it('deve filtrar pedidos por intervalo de datas', async () => {
    const res = await request(app).get('/orders?startDate=2020-11-01&endDate=2020-12-31');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].user_id).toBe(2);
    expect(res.body[0].orders.length).toBe(1);
    expect(res.body[0].orders[0].date).toBe('2020-12-01');
  });

  it('deve filtrar por orderId e intervalo de datas combinados', async () => {
    const res = await request(app).get('/orders?orderId=123&startDate=2021-01-01&endDate=2021-12-31');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].user_id).toBe(1);
    expect(res.body[0].orders[0].order_id).toBe(123);
    expect(res.body[0].orders[0].date).toBe('2021-12-01');
  });

  it('deve retornar array vazio se filtro não encontrar nenhum pedido', async () => {
    const res = await request(app).get('/orders?startDate=2030-01-01&endDate=2030-12-31');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('faz upload, retorna dados e aceita filtros válidos', async () => {
    const up = await request(app).post('/upload').attach('file', testFile);
    expect(up.status).toBe(200);
    expect(Array.isArray(up.body)).toBe(true);

    const res1 = await request(app).get('/orders');
    expect(res1.status).toBe(200);
    expect(res1.body.length).toBe(2);

    const res2 = await request(app).get('/orders?orderId=12345');
    expect(res2.status).toBe(200);
    expect(res2.body.length).toBe(1);
    expect(res2.body[0].user_id).toBe(2);

    const res3 = await request(app).get('/orders?startDate=2020-12-01&endDate=2020-12-01');
    expect(res3.status).toBe(200);
    expect(res3.body.length).toBe(1);
    expect(res3.body[0].user_id).toBe(2);

    const res4 = await request(app).get('/orders?orderId=123&startDate=2021-12-01');
    expect(res4.status).toBe(200);
    expect(res4.body.length).toBe(1);
    expect(res4.body[0].user_id).toBe(1);
  });

  it('retorna erro com orderId inválido', async () => {
    const res = await request(app).get('/orders?orderId=abc');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/orderId deve ser um número/i);
  });

  it('retorna erro com data inválida', async () => {
    const res = await request(app).get('/orders?startDate=2021-31-01');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/startDate inválida/i);
  });
});
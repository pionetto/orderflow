import { OrderFileParser } from '../src/core/parser';

describe('OrderFileParser', () => {
  it('deve parsear uma linha corretamente', () => {
    
    const linha = '0000000002Medeiros                                   00000123450000000111256.2420201201';
    const obj = OrderFileParser.parseLine(linha);

    expect(obj).toEqual({
      userId: 2,
      userName: 'Medeiros',
      orderId: 12345,
      productId: 111,
      value: 256.24,
      date: '20201201'
    });
  });

  it('deve parsear várias linhas', () => {
    const fileContent = `0000000002Medeiros                                   00000123450000000111256.2420201201
0000000001Zarelli                                    0000001230000000111512.2420211201`;

    const arr = OrderFileParser.parseFileContent(fileContent);

    expect(arr[0].userId).toBe(2);
    expect(arr[1].userName).toBe('Zarelli');
    expect(arr[1].orderId).toBe(123);
  });
});
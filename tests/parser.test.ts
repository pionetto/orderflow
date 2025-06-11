import { OrderFileParser } from '../src/core/parser';

describe('OrderFileParser', () => {
  it('deve parsear uma linha corretamente', () => {
    const linha = [
      '0000000002',
      'Medeiros'.padEnd(45, ' '),
      '0000012345',
      '0000000111',
      '256.24'.padStart(12, '0'),
      '20201201'
    ].join('');
    const obj = OrderFileParser.parseLine(linha);
    expect(obj).toEqual({
      userId: 2,
      userName: 'Medeiros',
      orderId: 12345,
      productId: 111,
      value: 256.24,
      date: '20201201',
    });
  });  
  
  it('deve parsear várias linhas', () => {
    const linha1 = [
      '0000000002',
      'Medeiros'.padEnd(45, ' '),
      '0000012345',
      '0000000111',
      '00000256.24',
      '20201201'
    ].join('');
    const linha2 = [
      '0000000001',
      'Zarelli'.padEnd(45, ' '),
      '0000000123',
      '0000000111',
      '00000512.24',
      '20211120'
    ].join('');
    const fileContent = [linha1, linha2].join('\n');
  
    const arr = OrderFileParser.parseFileContent(fileContent);
  
    expect(arr[0].userId).toBe(2);
    expect(arr[0].userName).toBe('Medeiros');
    expect(arr[0].orderId).toBe(12345);
  
    expect(arr[1].userId).toBe(1);
    expect(arr[1].userName).toBe('Zarelli');
    expect(arr[1].orderId).toBe(123);
  });  
});
import { OrderLine } from '../types/OrderLine';

export class OrderFileParser {
  static parseLine(line: string): OrderLine {
    
    const userId = parseInt(line.slice(0, 10), 10);
    const userName = line.slice(10, 55).trim();
    const orderId = parseInt(line.slice(55, 65), 10);
    const productId = parseInt(line.slice(65, 75), 10);
    const value = parseFloat(line.slice(75, 87).trim());
    const date = line.slice(87, 95);

    return {
      userId,
      userName,
      orderId,
      productId,
      value,
      date,
    };
  }

  static parseFileContent(content: string): OrderLine[] {
    
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(OrderFileParser.parseLine);
  }
}

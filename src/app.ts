import { OrderFileParser } from './core/parser';

const demoLine = '0000000002Medeiros                                   00000123450000000111256.2420201201';
console.log(OrderFileParser.parseLine(demoLine));
import { OrderFileParser } from './core/parser';
import { normalizeOrders } from './core/normalizer';

const lines = [
  '0000000002Medeiros                                   00000123450000000111256.2420201201',
  '0000000002Medeiros                                   00000123450000000112256.2420201201',
  '0000000001Zarelli                                    0000001230000000111512.2420211201'
];
const parsed = lines.map(OrderFileParser.parseLine);
const normalized = normalizeOrders(parsed);
console.dir(normalized, { depth: null });
import * as fs from 'fs';
import { OrderFileParser } from '../src/core/parser';
import { normalizeOrders } from '../src/core/normalizer';

const filePath = process.argv[2] || 'assets/pedidos.txt';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo:', err);
    process.exit(1);
  }
  const parsed = OrderFileParser.parseFileContent(data);
  const normalized = normalizeOrders(parsed);
  console.dir(normalized, { depth: null });
});
